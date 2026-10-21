"""Publish the tested frontend and waitlist entrypoint; preserve private files and other APIs."""
import base64
import errno
import hashlib
import io
import json
import os
import posixpath
import re
import stat
import sys
import time
from pathlib import Path, PurePosixPath
from urllib.error import HTTPError
from urllib.request import Request, urlopen

ROOT_FILES = {'index.html', 'index.php', 'no-script.css', 'robots.txt',
              'sitemap.xml', 'favicon.svg', 'og-image.png', 'release.json'}
FOLDERS = {'assets', 'seo', 'product-clips'}
PRESERVED = {'.htaccess', '_headers', '_redirects', 'api'}
WAITLIST_ENTRYPOINT = 'api/waitlist.php'
ORIGIN = 'https://delir.it'


class ReleaseError(Exception):
    pass


def required(name):
    value = os.environ.get(name, '').strip()
    if not value:
        raise ReleaseError('Missing configuration: ' + name)
    return value


def fingerprint(key):
    return 'SHA256:' + base64.b64encode(hashlib.sha256(key).digest()).decode().rstrip('=')


def connect():
    import paramiko
    host = required('IONOS_SFTP_HOST')
    user = required('IONOS_SFTP_USER')
    password = os.environ.get('IONOS_SFTP_PASSWORD', '')
    expected = required('IONOS_SFTP_FINGERPRINT')
    if not re.fullmatch(r'[A-Za-z0-9.-]+', host) or not password:
        raise ReleaseError('Invalid or missing SFTP configuration')
    if not re.fullmatch(r'SHA256:[A-Za-z0-9+/]{43}', expected):
        raise ReleaseError('IONOS_SFTP_FINGERPRINT must be an OpenSSH SHA256 fingerprint')
    port = int(os.environ.get('IONOS_SFTP_PORT', '22'))
    if not 1 <= port <= 65535:
        raise ReleaseError('Invalid SFTP port')
    transport = paramiko.Transport((host, port))
    try:
        # Pin the key type documented by IONOS, as well as its fingerprint.
        transport.get_security_options().key_types = ('ssh-ed25519',)
        transport.start_client(timeout=30)
        if fingerprint(transport.get_remote_server_key().asbytes()) != expected:
            raise ReleaseError('SFTP server fingerprint mismatch; password was not sent')
        transport.auth_password(user, password, fallback=False)
        sftp = paramiko.SFTPClient.from_transport(transport)
        sftp.get_channel().settimeout(60)
        return transport, sftp
    except BaseException:
        transport.close()
        raise


def attributes(sftp, path):
    try:
        result = sftp.lstat(path)
        if stat.S_ISLNK(result.st_mode):
            raise ReleaseError('Refusing a symlink in a deployment path')
        return result
    except OSError as error:
        if error.errno != errno.ENOENT:
            raise
        return None


def directory(sftp, path, mode=0o700):
    if path == '/':
        return
    directory(sftp, posixpath.dirname(path), mode)
    existing = attributes(sftp, path)
    if existing is None:
        sftp.mkdir(path, mode=mode)
    elif not stat.S_ISDIR(existing.st_mode):
        raise ReleaseError('Deployment parent is not a directory')


def plan(build, sha):
    if not re.fullmatch(r'[a-f0-9]{40}', sha):
        raise ReleaseError('Invalid release SHA')
    if json.loads((build / 'release.json').read_text())['sha'] != sha:
        raise ReleaseError('Build artifact belongs to a different commit')
    result = []
    for item in sorted(build.rglob('*')):
        relative = item.relative_to(build).as_posix()
        top = relative.split('/')[0]
        if item.is_symlink():
            raise ReleaseError('Build contains a symlink')
        if relative == WAITLIST_ENTRYPOINT and item.is_file():
            result.append(relative)
            continue
        if top in PRESERVED or item.is_dir():
            continue
        if top not in FOLDERS and relative not in ROOT_FILES:
            raise ReleaseError('Unexpected file in build: ' + relative)
        result.append(relative)
    for essential in ['index.php', 'index.html', 'seo/home.it.html', 'seo/home.en.html', 'release.json', WAITLIST_ENTRYPOINT]:
        if essential not in result:
            raise ReleaseError('Incomplete frontend artifact: ' + essential)
    # Content-addressed assets are ready before HTML; the release marker is last.
    return sorted(result, key=lambda name: (0 if name.startswith('assets/') else
                    3 if name == 'release.json' else 2 if name in {'index.html', 'index.php'} else 1, name))


def response(path, sha):
    separator = '&' if '?' in path else '?'
    request = Request(ORIGIN + path + separator + 'release_check=' + sha,
                      headers={'Cache-Control': 'no-cache', 'User-Agent': 'DeliR-deploy-check'})
    try:
        with urlopen(request, timeout=20) as result:
            return result.status, result.read(2_000_000).decode('utf-8')
    except HTTPError as error:
        return error.code, ''


def verify(sha):
    status, body = response('/release.json', sha)
    if status != 200 or json.loads(body).get('sha') != sha:
        raise ReleaseError('Published release marker does not match the tested commit')
    for path in ['/', '/?lang=en', '/pilot', '/waitlist', '/privacy', '/security-data', '/comparison-sources']:
        status, body = response(path, sha)
        if status != 200 or 'DeliR' not in body:
            raise ReleaseError('Published frontend route failed verification: ' + path)
        if path == '/?lang=en' and 'lang="en"' not in body:
            raise ReleaseError('English document is missing')
        if path in {'/waitlist', '/privacy'} and 'noindex' not in body:
            raise ReleaseError('Private conversion route lost its noindex directive')
        if path == '/':
            for asset in set(re.findall(r'(?:src|href)="(/assets/[^"?]+\.(?:js|css))"', body)):
                if response(asset, sha)[0] != 200:
                    raise ReleaseError('Published entry asset is unavailable')
    for path in ['/robots.txt', '/sitemap.xml']:
        if response(path, sha)[0] != 200:
            raise ReleaseError('Published SEO document is unavailable')
    if response('/delir-deploy-missing-' + sha, sha)[0] != 404:
        raise ReleaseError('Unknown paths no longer return HTTP 404')
    verify_waitlist(sha)


def verify_waitlist(sha):
    # An empty object is rejected before any database connection or lead write.
    # This checks that PHP executes and the existing private intake is enabled.
    request = Request(ORIGIN + '/' + WAITLIST_ENTRYPOINT + '?release_check=' + sha,
                      data=b'{}', method='POST', headers={
                          'Content-Type': 'application/json', 'Origin': ORIGIN,
                          'Sec-Fetch-Site': 'same-origin', 'Cache-Control': 'no-cache',
                          'User-Agent': 'DeliR-deploy-check'})
    try:
        with urlopen(request, timeout=20) as result:
            status, body = result.status, result.read(4096)
    except HTTPError as error:
        status, body = error.code, error.read(4096)
    try:
        payload = json.loads(body)
    except (ValueError, UnicodeError):
        raise ReleaseError('Waitlist readiness failed (HTTP ' + str(status) + ', non-JSON response)') from None
    if status != 422 or payload != {'accepted': False, 'error': 'invalid_request'}:
        # Only fixed protocol codes may reach Actions logs; never echo response bodies.
        known = {'temporarily_unavailable', 'https_required', 'origin_not_allowed',
                 'method_not_allowed', 'json_required', 'body_too_large',
                 'invalid_request', 'invalid_application', 'too_many_requests', 'client_unavailable'}
        code = payload.get('error') if isinstance(payload, dict) else None
        safe_code = code if isinstance(code, str) and code in known else 'unexpected_response'
        raise ReleaseError('Waitlist readiness failed (HTTP ' + str(status) + ', ' + safe_code + ')')


def deploy(sftp, build, sha, remote, release_id, check=verify, http=response, probe=verify_waitlist):
    if not remote.startswith('/') or '..' in PurePosixPath(remote).parts:
        raise ReleaseError('IONOS_SFTP_DIRECTORY must be an absolute SFTP path without traversal')
    remote = posixpath.normpath(remote)
    if remote != '/' and PurePosixPath(remote).name != 'public':
        raise ReleaseError('Select /public, or / for an account already restricted to /public')
    if not re.fullmatch(r'[a-f0-9]{12}-[0-9]+-[0-9]+', release_id):
        raise ReleaseError('Invalid release directory identifier')
    files = plan(build, sha)
    target = attributes(sftp, remote)
    if target is None or not stat.S_ISDIR(target.st_mode):
        raise ReleaseError('Configured public directory does not exist')
    if 'private' in sftp.listdir(remote) or 'public' in sftp.listdir(remote):
        raise ReleaseError('Configured directory looks like the hosting root, not the public frontend')
    if attributes(sftp, posixpath.join(remote, '.htaccess')) is None:
        raise ReleaseError('Install the reviewed IONOS .htaccess once before enabling automatic deploy')
    storage = posixpath.join(remote, '.delir-deploy')
    directory(sftp, storage)
    for controlled in ['/.htaccess', '/probe.txt']:
        existing = attributes(sftp, storage + controlled)
        if existing is not None and not stat.S_ISREG(existing.st_mode):
            raise ReleaseError('Deployment control file is not a regular file')
    sftp.putfo(io.BytesIO(b'Require all denied\n'), storage + '/.htaccess')
    sftp.putfo(io.BytesIO(b'protected deployment staging\n'), storage + '/probe.txt')
    if http('/.delir-deploy/probe.txt', sha)[0] not in {403, 404}:
        raise ReleaseError('Server does not protect staging/backup files; nothing was published')
    stage = storage + '/' + release_id + '/stage'
    backup = storage + '/' + release_id + '/backup'
    if attributes(sftp, posixpath.dirname(stage)) is not None:
        raise ReleaseError('Release directory already exists; use a new run attempt')
    directory(sftp, stage)
    directory(sftp, backup)
    journal = []
    try:
        # Upload the complete release before changing any existing frontend file.
        for name in files:
            directory(sftp, posixpath.dirname(stage + '/' + name))
            sftp.put(str(build / name), stage + '/' + name)
        for name in files:
            final = posixpath.join(remote, name)
            directory(sftp, posixpath.dirname(final), mode=0o755)
            old = attributes(sftp, final)
            if old is not None and not stat.S_ISREG(old.st_mode):
                raise ReleaseError('A frontend destination is not a regular file')
            saved = backup + '/' + name
            if old is not None:
                directory(sftp, posixpath.dirname(saved))
                sftp.rename(final, saved)
            journal.append((final, saved if old is not None else None))
            sftp.rename(stage + '/' + name, final)
            if name == WAITLIST_ENTRYPOINT:
                # Fail before publishing HTML that opens the form.
                probe(sha)
        # Retry transient HTTP failures while the release is still reversible.
        for attempt in range(3):
            try:
                check(sha)
                break
            except Exception:
                if attempt == 2:
                    raise
                time.sleep(3)
    except BaseException:
        rollback_failed = False
        for final, saved in reversed(journal):
            try:
                if attributes(sftp, final) is not None:
                    sftp.remove(final)
                if saved:
                    sftp.rename(saved, final)
            except Exception:
                rollback_failed = True
        if rollback_failed:
            raise ReleaseError('Deployment failed and rollback was incomplete; restore the protected server backup') from None
        raise
    return backup


def main(check_only=False):
    sha = required('GITHUB_SHA')
    files = plan(Path('dist'), sha)
    if check_only:
        print('Validated ' + str(len(files)) + ' publishable files for commit ' + sha)
        return
    release_id = sha[:12] + '-' + required('GITHUB_RUN_ID') + '-' + required('GITHUB_RUN_ATTEMPT')
    remote = required('IONOS_SFTP_DIRECTORY')
    transport, sftp = connect()
    try:
        deploy(sftp, Path('dist'), sha, remote, release_id)
        print('Published and verified frontend commit ' + sha + ' on https://delir.it')
    finally:
        sftp.close()
        transport.close()


if __name__ == '__main__':
    try:
        if sys.argv[1:] not in ([], ['--check-build']):
            raise ReleaseError('Unknown deployment option')
        main(check_only=sys.argv[1:] == ['--check-build'])
    except ReleaseError as error:
        print('::error::' + str(error), file=sys.stderr)
        sys.exit(1)
    except Exception as error:
        # No exception contents, credentials, remote file contents or account identifiers in logs.
        print('::error::IONOS deployment failed (' + type(error).__name__ + '); check credentials/connectivity and the protected backup', file=sys.stderr)
        sys.exit(1)
