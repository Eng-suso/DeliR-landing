"""Deployment regression checks against a disposable filesystem transport."""
import importlib.util
import io
import json
import os
from pathlib import Path
import tempfile
import types
import unittest
from datetime import datetime, timezone
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('deploy', Path(__file__).with_name('deploy-ionos.py'))
deploy = importlib.util.module_from_spec(spec)
spec.loader.exec_module(deploy)
SHA = 'a' * 40


class FilesystemSFTP:
    def __init__(self, root):
        self.root = root
        self.fail_publish = False
        self.fail_upload = False

    def path(self, value):
        return self.root / value.lstrip('/')

    def lstat(self, value):
        return self.path(value).lstat()

    def listdir(self, value):
        return os.listdir(self.path(value))

    def mkdir(self, value, mode):
        self.path(value).mkdir(mode=mode)

    def putfo(self, stream, value):
        self.path(value).write_bytes(stream.read())

    def put(self, source, value):
        if self.fail_upload:
            raise OSError('simulated transport failure')
        self.path(value).write_bytes(Path(source).read_bytes())

    def rename(self, source, target):
        if self.fail_publish and '/stage/release.json' in source:
            self.fail_publish = False
            raise OSError('simulated publish failure')
        if self.path(target).exists():
            raise FileExistsError('standard SFTP rename does not replace an existing target')
        self.path(source).rename(self.path(target))

    def remove(self, value):
        self.path(value).unlink()

    def open(self, value, mode):
        return self.path(value).open('xb' if mode == 'wx' else mode)

    def chmod(self, value, mode):
        self.path(value).chmod(mode)


class DeploymentTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.build = self.root / 'build'
        self.remote = self.root / 'remote'
        for folder in [self.build, self.remote / 'public' / 'api']:
            folder.mkdir(parents=True)
        self.sftp = FilesystemSFTP(self.remote)
        self.names = ['index.php', 'index.html', 'seo/home.it.html', 'seo/home.en.html', 'assets/app.js']
        for name in self.names:
            target = self.build / name
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text('new frontend')
        (self.build / 'release.json').write_text(json.dumps({'sha': SHA}))
        (self.build / '.htaccess').write_text('new build rules that must not replace server rules')
        (self.build / 'api').mkdir()
        (self.build / 'api/pilot.php').write_text('build API that must not replace existing API')
        (self.build / 'api/waitlist.php').write_text('reviewed waitlist entrypoint')
        (self.remote / 'public/.htaccess').write_text('existing server rules')
        (self.remote / 'public/index.html').write_text('previous frontend')
        (self.remote / 'public/api/pilot.php').write_text('existing working API')

    def publish(self, check=lambda sha: None, http=lambda path, sha: (403, ''), probe=lambda sha: None):
        return deploy.deploy(self.sftp, self.build, SHA, '/public', 'a' * 12 + '-123-1', check, http, probe)

    def assert_preserved(self):
        self.assertEqual((self.remote / 'public/.htaccess').read_text(), 'existing server rules')
        self.assertEqual((self.remote / 'public/api/pilot.php').read_text(), 'existing working API')

    def test_build_preflight_needs_no_hosting_configuration_or_connection(self):
        with patch.dict(os.environ, {'GITHUB_SHA': SHA}, clear=True), \
                patch.object(deploy, 'Path', return_value=self.build), \
                patch.object(deploy, 'connect') as connection, \
                patch('builtins.print') as output:
            deploy.main(check_only=True)
        connection.assert_not_called()
        self.assertIn('Validated', output.call_args.args[0])

    def test_unexpected_public_document_is_rejected_before_connecting(self):
        document = self.build / 'landing-v2/media/README.md'
        document.parent.mkdir(parents=True)
        document.write_text('internal video instructions')
        with patch.dict(os.environ, {'GITHUB_SHA': SHA}, clear=True), \
                patch.object(deploy, 'Path', return_value=self.build), \
                patch.object(deploy, 'connect') as connection:
            with self.assertRaisesRegex(deploy.ReleaseError, 'Unexpected file in build'):
                deploy.main()
        connection.assert_not_called()
        self.assertEqual((self.remote / 'public/index.html').read_text(), 'previous frontend')

    def test_success_preserves_api_and_routing_and_keeps_old_frontend_backup(self):
        backup = self.publish()
        self.assertEqual((self.remote / 'public/index.html').read_text(), 'new frontend')
        self.assertEqual(self.sftp.path(backup + '/index.html').read_text(), 'previous frontend')
        self.assert_preserved()
        self.assertEqual((self.remote / 'public/api/waitlist.php').read_text(), 'reviewed waitlist entrypoint')

    def test_waitlist_probe_runs_before_new_html_and_rolls_back_on_failure(self):
        def unavailable(sha):
            self.assertEqual((self.remote / 'public/index.html').read_text(), 'previous frontend')
            raise deploy.ReleaseError('simulated closed private intake')
        with self.assertRaises(deploy.ReleaseError):
            self.publish(probe=unavailable)
        self.assertFalse((self.remote / 'public/api/waitlist.php').exists())
        self.assert_preserved()

    def test_previous_waitlist_endpoint_is_backed_up_and_restored(self):
        endpoint = self.remote / 'public/api/waitlist.php'
        endpoint.write_text('previous waitlist entrypoint')
        self.sftp.fail_publish = True
        with self.assertRaises(OSError):
            self.publish()
        self.assertEqual(endpoint.read_text(), 'previous waitlist entrypoint')
        self.assert_preserved()

    def test_missing_waitlist_entrypoint_is_rejected_before_upload(self):
        (self.build / 'api/waitlist.php').unlink()
        with self.assertRaises(deploy.ReleaseError):
            self.publish()

    def test_waitlist_probe_accepts_only_the_expected_validation_rejection(self):
        from urllib.error import HTTPError
        for status, body, valid in [(422, b'{"accepted":false,"error":"invalid_request"}', True),
                                    (503, b'{"accepted":false,"error":"temporarily_unavailable"}', False),
                                    (404, b'<html>missing</html>', False),
                                    (201, b'{"accepted":true}', False)]:
            with self.subTest(status=status):
                error = HTTPError('https://example.test/api', status, 'fixture', {}, io.BytesIO(body))
                with patch.object(deploy, 'urlopen', side_effect=error) as fetch:
                    if valid:
                        deploy.verify_waitlist(SHA)
                    else:
                        with self.assertRaises(deploy.ReleaseError):
                            deploy.verify_waitlist(SHA)
                    self.assertEqual(fetch.call_args.args[0].data, b'{}')

    def test_failed_upload_does_not_change_the_live_frontend(self):
        self.sftp.fail_upload = True
        with self.assertRaises(OSError):
            self.publish()
        self.assertEqual((self.remote / 'public/index.html').read_text(), 'previous frontend')
        self.assert_preserved()

    def test_waitlist_diagnostic_reports_status_without_echoing_arbitrary_bodies(self):
        from urllib.error import HTTPError
        cases = [
            (503, b'{"accepted":false,"error":"temporarily_unavailable"}', 'temporarily_unavailable'),
            (403, b'{"accepted":false,"error":"origin_not_allowed"}', 'origin_not_allowed'),
            (404, b'<html>DO_NOT_LOG_RESPONSE</html>', 'non-JSON response'),
            (500, b'{"error":"DO_NOT_LOG_RESPONSE"}', 'unexpected_response'),
            (500, b'{"error":["DO_NOT_LOG_RESPONSE"]}', 'unexpected_response'),
            (500, b'["DO_NOT_LOG_RESPONSE"]', 'unexpected_response'),
        ]
        for status, body, code in cases:
            with self.subTest(status=status, body=body):
                error = HTTPError('https://example.test/api', status, 'fixture', {}, io.BytesIO(body))
                with patch.object(deploy, 'urlopen', side_effect=error):
                    with self.assertRaises(deploy.ReleaseError) as failure:
                        deploy.verify_waitlist(SHA)
                self.assertIn('HTTP ' + str(status), str(failure.exception))
                self.assertIn(code, str(failure.exception))
                self.assertNotIn('DO_NOT_LOG_RESPONSE', str(failure.exception))

    def test_private_diagnostic_reads_only_fresh_fixed_codes_and_never_changes_private_files(self):
        folder = self.remote / 'private/delir'
        folder.mkdir(parents=True)
        config = folder / 'config.php'
        config.write_text('DO_NOT_READ_CONFIGURATION')
        log = folder / 'diagnostic.log'
        stamp = datetime.now(timezone.utc).isoformat(timespec='seconds')
        for body, expected in [
            (stamp + ' interest_private_handler_missing\n', 'interest_private_handler_missing'),
            (stamp + ' interest_DO_NOT_LOG_RESPONSE\n', None),
            ('2000-01-01T00:00:00+00:00 interest_capture_disabled\n', None),
            ('DO_NOT_LOG_RESPONSE\n', None),
            ('x' * 66001, None),
        ]:
            with self.subTest(expected=expected, length=len(body)):
                log.write_text(body)
                self.assertEqual(deploy.private_waitlist_event(self.sftp, '/public'), expected)
                self.assertEqual(log.read_text(), body)
                self.assertEqual(config.read_text(), 'DO_NOT_READ_CONFIGURATION')
        self.assertIsNone(deploy.private_waitlist_event(self.sftp, '/'))
        log.unlink()
        self.assertIsNone(deploy.private_waitlist_event(self.sftp, '/public'))
        with patch.object(self.sftp, 'open', side_effect=PermissionError('DO_NOT_LOG_RESPONSE')):
            log.write_text(stamp + ' interest_capture_disabled\n')
            self.assertIsNone(deploy.private_waitlist_event(self.sftp, '/public'))

    def test_failed_probe_emits_only_a_fixed_private_code_and_still_rolls_back(self):
        folder = self.remote / 'private/delir'
        folder.mkdir(parents=True)
        stamp = datetime.now(timezone.utc).isoformat(timespec='seconds')
        (folder / 'diagnostic.log').write_text(stamp + ' interest_private_handler_missing\n')
        def unavailable(sha):
            raise deploy.ReleaseError('probe fixture')
        with patch('builtins.print') as output:
            with self.assertRaises(deploy.ReleaseError):
                self.publish(probe=unavailable)
        self.assertEqual(output.call_args.args[0], '::notice::Waitlist private diagnostic: interest_private_handler_missing')
        self.assertEqual((self.remote / 'public/index.html').read_text(), 'previous frontend')
        self.assertFalse((self.remote / 'public/api/waitlist.php').exists())

    def private_backend(self):
        folder = self.remote / 'private/delir'
        folder.mkdir(parents=True)
        for name in ['config.php', 'pilot.php']:
            (folder / name).write_text('existing private ' + name)
        stamp = datetime.now(timezone.utc).isoformat(timespec='seconds')
        (folder / 'diagnostic.log').write_text(stamp + ' interest_private_waitlist_missing\n')
        return folder

    def test_missing_private_library_is_installed_and_probed_before_html(self):
        folder = self.private_backend()
        calls = []
        def ready_after_install(sha):
            calls.append(sha)
            self.assertEqual((self.remote / 'public/index.html').read_text(), 'previous frontend')
            if not (folder / 'waitlist.php').exists():
                raise deploy.ReleaseError('fixture missing library')
            self.assertEqual((folder / 'waitlist.php').read_bytes(), deploy.WAITLIST_LIBRARY.read_bytes())
        with patch('builtins.print'):
            self.publish(probe=ready_after_install)
        self.assertEqual(len(calls), 2)
        self.assertEqual((self.remote / 'public/index.html').read_text(), 'new frontend')
        self.assertEqual((folder / 'config.php').read_text(), 'existing private config.php')
        self.assertEqual((folder / 'pilot.php').read_text(), 'existing private pilot.php')
        self.assertFalse(list(folder.glob('.waitlist-*.tmp')))

    def test_failed_readiness_after_bootstrap_removes_only_the_created_library(self):
        folder = self.private_backend()
        def unavailable(sha):
            raise deploy.ReleaseError('fixture still unavailable')
        with patch('builtins.print'), self.assertRaises(deploy.ReleaseError):
            self.publish(probe=unavailable)
        self.assertFalse((folder / 'waitlist.php').exists())
        self.assertEqual((folder / 'config.php').read_text(), 'existing private config.php')
        self.assertEqual((folder / 'pilot.php').read_text(), 'existing private pilot.php')
        self.assertEqual((self.remote / 'public/index.html').read_text(), 'previous frontend')

    def test_bootstrap_refuses_existing_libraries_and_missing_prerequisites(self):
        folder = self.private_backend()
        existing = folder / 'waitlist.php'
        existing.write_text('owner library')
        with self.assertRaises(deploy.ReleaseError):
            deploy.install_missing_waitlist_library(self.sftp, '/public', 'a' * 12 + '-123-1')
        self.assertEqual(existing.read_text(), 'owner library')
        existing.unlink()
        (folder / 'pilot.php').unlink()
        with self.assertRaises(deploy.ReleaseError):
            deploy.install_missing_waitlist_library(self.sftp, '/public', 'a' * 12 + '-123-1')
        self.assertFalse(existing.exists())
        with self.assertRaises(deploy.ReleaseError):
            deploy.install_missing_waitlist_library(self.sftp, '/', 'a' * 12 + '-123-1')

    def test_bootstrap_keeps_a_concurrently_created_owner_library(self):
        folder = self.private_backend()
        original = self.sftp.rename
        def owner_created_file(source, target):
            (folder / 'waitlist.php').write_text('concurrent owner library')
            original(source, target)
        with patch.object(self.sftp, 'rename', side_effect=owner_created_file), self.assertRaises(FileExistsError):
            deploy.install_missing_waitlist_library(self.sftp, '/public', 'a' * 12 + '-123-1')
        self.assertEqual((folder / 'waitlist.php').read_text(), 'concurrent owner library')
        self.assertFalse(list(folder.glob('.waitlist-*.tmp')))

    def test_bootstrap_does_not_replace_an_existing_temporary_file(self):
        folder = self.private_backend()
        temporary = folder / ('.waitlist-' + 'a' * 12 + '-123-1.tmp')
        temporary.write_text('owner temporary file')
        with self.assertRaises(FileExistsError):
            deploy.install_missing_waitlist_library(self.sftp, '/public', 'a' * 12 + '-123-1')
        self.assertEqual(temporary.read_text(), 'owner temporary file')
        self.assertFalse((folder / 'waitlist.php').exists())

    def test_final_verification_failure_also_rolls_back_created_private_module(self):
        folder = self.private_backend()
        def readiness(sha):
            if not (folder / 'waitlist.php').exists():
                raise deploy.ReleaseError('fixture missing library')
        def failed_release(sha):
            raise deploy.ReleaseError('fixture final check failure')
        with patch('builtins.print'), patch.object(deploy.time, 'sleep'), self.assertRaises(deploy.ReleaseError):
            self.publish(check=failed_release, probe=readiness)
        self.assertFalse((folder / 'waitlist.php').exists())
        self.assertEqual((self.remote / 'public/index.html').read_text(), 'previous frontend')

    def test_rollback_preserves_owner_changes_to_the_new_private_module(self):
        folder = self.private_backend()
        def readiness(sha):
            if not (folder / 'waitlist.php').exists():
                raise deploy.ReleaseError('fixture missing library')
        def owner_changed_library(sha):
            (folder / 'waitlist.php').write_text('owner revision made during release')
            raise deploy.ReleaseError('fixture failed final check')
        with patch('builtins.print'), patch.object(deploy.time, 'sleep'), self.assertRaises(deploy.ReleaseError):
            self.publish(check=owner_changed_library, probe=readiness)
        self.assertEqual((folder / 'waitlist.php').read_text(), 'owner revision made during release')
        self.assertEqual((self.remote / 'public/index.html').read_text(), 'previous frontend')

    def test_partial_publish_failure_restores_previous_frontend(self):
        self.sftp.fail_publish = True
        with self.assertRaises(OSError):
            self.publish()
        self.assertEqual((self.remote / 'public/index.html').read_text(), 'previous frontend')
        self.assertFalse((self.remote / 'public/release.json').exists())
        self.assert_preserved()

    @patch.object(deploy.time, 'sleep')
    def test_http_verification_failure_rolls_back(self, sleep):
        def broken(sha):
            raise deploy.ReleaseError('simulated broken route')
        with self.assertRaises(deploy.ReleaseError):
            self.publish(check=broken)
        self.assertEqual((self.remote / 'public/index.html').read_text(), 'previous frontend')
        self.assert_preserved()

    def test_publicly_readable_staging_blocks_all_live_writes(self):
        with self.assertRaises(deploy.ReleaseError):
            self.publish(http=lambda path, sha: (200, ''))
        self.assertEqual((self.remote / 'public/index.html').read_text(), 'previous frontend')

    def test_artifact_commit_mismatch_is_rejected(self):
        with self.assertRaises(deploy.ReleaseError):
            deploy.plan(self.build, 'b' * 40)

    def test_unexpected_or_sensitive_build_file_is_rejected(self):
        (self.build / '.env').write_text('disposable test fixture, not credentials')
        with self.assertRaises(deploy.ReleaseError):
            deploy.plan(self.build, SHA)

    def test_host_key_mismatch_never_sends_password(self):
        class Transport:
            authenticated = False
            def __init__(self, target): pass
            def get_security_options(self): return types.SimpleNamespace(key_types=())
            def start_client(self, timeout): pass
            def get_remote_server_key(self): return types.SimpleNamespace(asbytes=lambda: b'unexpected server key')
            def auth_password(self, *args, **kwargs): Transport.authenticated = True
            def close(self): pass
        env = {'IONOS_SFTP_HOST': 'test.example', 'IONOS_SFTP_USER': 'fixture',
               'IONOS_SFTP_PASSWORD': 'disposable-fixture', 'IONOS_SFTP_FINGERPRINT': deploy.fingerprint(b'expected server key')}
        with patch.dict(os.environ, env), patch.dict('sys.modules', {'paramiko': types.SimpleNamespace(Transport=Transport)}):
            with self.assertRaises(deploy.ReleaseError):
                deploy.connect()
        self.assertFalse(Transport.authenticated)


if __name__ == '__main__':
    unittest.main()
