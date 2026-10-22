<?php
declare(strict_types=1);
require_once __DIR__ . '/pilot.php';

// The 2026-10-22 notice tells the visitor a welcome email with the product video follows.
const DELIR_INTEREST_NOTICES = ['product-interest-2026-10-12', 'product-interest-2026-10-22'];
const DELIR_WELCOME_NOTICE = 'product-interest-2026-10-22';
const DELIR_WALKTHROUGH_URL = 'https://delir.it/product-videos/walkthrough.mp4';

function delir_validate_interest(string $raw): ?array
{
    try { $data = json_decode($raw, true, 8, JSON_THROW_ON_ERROR); }
    catch (JsonException $error) { return null; }
    $keys = ['email', 'practice', 'timing', 'source', 'noticeVersion'];
    if (!is_array($data) || count($data) !== count($keys) || array_diff($keys, array_keys($data))) return null;
    foreach ($keys as $key) {
        if (!is_string($data[$key])) return null;
        $data[$key] = trim($data[$key]);
        if (preg_match('/[\x00-\x1F\x7F]/', $data[$key]) !== 0) return null;
    }
    if (strlen($data['email']) > 254 || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) return null;
    if (!in_array($data['practice'], ['independent', 'consulting-team', 'in-house', 'other'], true)) return null;
    if (!in_array($data['timing'], ['', 'active', 'next-90-days', 'exploring'], true)) return null;
    if ($data['source'] !== 'delir-product-interest' || !in_array($data['noticeVersion'], DELIR_INTEREST_NOTICES, true)) return null;
    $data['email'] = strtolower($data['email']);
    return $data;
}

function delir_handle_interest(array $server, array $config, callable $readBody, ?callable $connect = null): array
{
    // Independent of pilot intake: installing the endpoint must not enable it.
    if (($config['waitlist_enabled'] ?? false) !== true) return delir_result(503, 'temporarily_unavailable');
    if (($server['REQUEST_METHOD'] ?? '') !== 'POST') return delir_result(405, 'method_not_allowed');
    if (!in_array(strtolower((string) ($server['HTTPS'] ?? '')), ['on', '1'], true)) return delir_result(403, 'https_required');
    if (!in_array($server['HTTP_ORIGIN'] ?? '', $config['origins'] ?? [], true)) return delir_result(403, 'origin_not_allowed');
    if (isset($server['HTTP_SEC_FETCH_SITE']) && $server['HTTP_SEC_FETCH_SITE'] !== 'same-origin') return delir_result(403, 'origin_not_allowed');
    if (strtolower(trim(explode(';', $server['CONTENT_TYPE'] ?? '')[0])) !== 'application/json') return delir_result(415, 'json_required');
    if (isset($server['CONTENT_LENGTH']) && (!ctype_digit((string) $server['CONTENT_LENGTH']) || (int) $server['CONTENT_LENGTH'] > 4096)) return delir_result(413, 'body_too_large');
    $raw = $readBody();
    if (strlen($raw) > 4096) return delir_result(413, 'body_too_large');
    $data = delir_validate_interest($raw);
    if ($data === null) return delir_result(422, 'invalid_request');
    if (!is_string($config['rate_secret'] ?? null) || !preg_match('/^[a-f0-9]{64}$/', $config['rate_secret'])) throw new RuntimeException('rate_secret_invalid');
    $ip = $server['REMOTE_ADDR'] ?? '';
    if (!filter_var($ip, FILTER_VALIDATE_IP)) return delir_result(403, 'client_unavailable');
    try { $pdo = $connect ? $connect() : delir_connect_pilot($config); }
    catch (PDOException $error) { throw new RuntimeException('database_connection_failed', 0, $error); }
    try { $result = delir_store_interest($pdo, $data, $ip, $config['rate_secret'], time()); }
    catch (PDOException $error) { throw new RuntimeException('database_write_failed', 0, $error); }
    // One welcome email per new address, only to people shown the notice that announces it.
    // The public response stays identical either way: membership is never revealed.
    $new = ($result['new'] ?? false) === true;
    unset($result['new']);
    if ($new && $data['noticeVersion'] === DELIR_WELCOME_NOTICE) $result['welcome_to'] = $data['email'];
    return $result;
}

function delir_store_interest(PDO $pdo, array $data, string $ip, string $secret, int $now): array
{
    $cleanup = $pdo->prepare('DELETE FROM pilot_rate_limits WHERE expires_at <= ? LIMIT 1000');
    $cleanup->execute([$now]);
    $expires = (intdiv($now, 900) + 1) * 900;
    $buckets = [
        hash_hmac('sha256', 'interest:global', $secret) => 100,
        hash_hmac('sha256', 'interest:ip:' . $ip, $secret) => 5,
    ];
    $pdo->beginTransaction();
    try {
        foreach ($buckets as $key => $limit) {
            $seed = $pdo->prepare('INSERT INTO pilot_rate_limits (rate_key, hits, expires_at) VALUES (?, 0, ?) ON DUPLICATE KEY UPDATE rate_key = rate_key');
            $seed->execute([$key, $expires]);
            $select = $pdo->prepare('SELECT hits, expires_at FROM pilot_rate_limits WHERE rate_key = ? FOR UPDATE');
            $select->execute([$key]);
            $row = $select->fetch(PDO::FETCH_ASSOC);
            if (!$row) throw new RuntimeException('rate_store_unavailable');
            $hits = (int) $row['expires_at'] <= $now ? 0 : (int) $row['hits'];
            if ($hits >= $limit) {
                $pdo->rollBack();
                return delir_result(429, 'too_many_requests', $expires - $now);
            }
            $update = $pdo->prepare('UPDATE pilot_rate_limits SET hits = ?, expires_at = ? WHERE rate_key = ?');
            $update->execute([$hits + 1, $expires, $key]);
        }
        // Repeat requests do not create extra people or overwrite their intent.
        // The public response is identical: do not expose membership by email.
        $insert = $pdo->prepare('INSERT INTO product_interest (email, practice, timing, source, notice_version, created_at) VALUES (?, ?, ?, ?, ?, UTC_TIMESTAMP()) ON DUPLICATE KEY UPDATE email = email');
        $insert->execute([$data['email'], $data['practice'], $data['timing'], $data['source'], $data['noticeVersion']]);
        // MySQL reports 1 for a new row and 0 for an unchanged duplicate.
        $new = $insert->rowCount() === 1;
        $pdo->commit();
        return ['status' => 201, 'body' => ['accepted' => true], 'new' => $new];
    } catch (Throwable $error) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        throw $error;
    }
}

/** The welcome message, in Italian and English, as plain text: no tracking, no images. */
function delir_welcome_message(array $config, string $to, string $messageId, int $now): string
{
    $from = (string) $config['mail_from'];
    if (!filter_var($to, FILTER_VALIDATE_EMAIL) || !filter_var($from, FILTER_VALIDATE_EMAIL)) throw new RuntimeException('welcome_mail_address_invalid');
    $subject = 'DeliR · Sei nella lista d’attesa / You’re on the waitlist';
    $body = implode("\r\n", [
        'Ciao,',
        '',
        'grazie per esserti iscritto alla lista d’attesa di DeliR. Ti scriverò quando aprirò nuovi accessi.',
        '',
        'Intanto, ecco il percorso completo del prodotto (4:47, senza audio, caso dimostrativo):',
        DELIR_WALKTHROUGH_URL,
        'Dalle interviste al processo As-Is con le fonti, alla simulazione con i KPI, fino alla consegna al process owner.',
        '',
        'Hai un progetto reale su cui lavorare? Puoi candidarti al pilot: https://delir.it/pilot',
        '',
        'Non ti sei iscritto tu? Ignora questa email oppure rispondi e cancello il tuo indirizzo.',
        '',
        '---',
        '',
        'Hi,',
        '',
        'thanks for joining the DeliR waitlist. I will email you when I open new access.',
        '',
        'Meanwhile, here is the full product walkthrough (4:47, silent, demo case):',
        DELIR_WALKTHROUGH_URL,
        'From interviews to the sourced As-Is process, the simulation with its KPIs and the handover to the process owner.',
        '',
        'Have a real project to work on? You can apply for the pilot: https://delir.it/pilot?lang=en',
        '',
        'Didn’t sign up? Ignore this email or reply and I will delete your address.',
        '',
        'DeliR · ' . $from,
    ]);
    $headers = [
        'Date: ' . gmdate('D, d M Y H:i:s', $now) . ' +0000',
        'From: DeliR <' . $from . '>',
        'To: <' . $to . '>',
        'Subject: =?UTF-8?B?' . base64_encode($subject) . '?=',
        'Message-ID: <' . $messageId . '@delir.it>',
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: base64',
        'Auto-Submitted: auto-generated',
    ];
    return implode("\r\n", $headers) . "\r\n\r\n" . rtrim(chunk_split(base64_encode($body), 76, "\r\n"), "\r\n");
}

/**
 * Minimal SMTP over implicit TLS (IONOS: port 465) with AUTH LOGIN. `$open`
 * returns ['read' => fn(): string, 'write' => fn(string), 'close' => fn()]; tests
 * pass a scripted server, production opens a verified TLS socket.
 */
function delir_smtp_send(array $config, string $to, string $message, ?callable $open = null): void
{
    $io = $open ? $open() : delir_smtp_socket((string) $config['smtp_host'], (int) $config['smtp_port']);
    try {
        $expect = static function (string $codes) use ($io): void {
            $reply = '';
            do { $line = ($io['read'])(); $reply .= $line; }
            while ($line !== '' && strlen($line) > 3 && $line[3] === '-');
            if (!in_array(substr($reply, 0, 3), explode(',', $codes), true)) throw new RuntimeException('welcome_mail_rejected');
        };
        $say = static function (string $command, string $codes) use ($io, $expect): void { ($io['write'])($command . "\r\n"); $expect($codes); };
        $expect('220');
        $say('EHLO delir.it', '250');
        $say('AUTH LOGIN', '334');
        $say(base64_encode((string) $config['smtp_user']), '334');
        $say(base64_encode((string) $config['smtp_password']), '235');
        $say('MAIL FROM:<' . $config['mail_from'] . '>', '250');
        $say('RCPT TO:<' . $to . '>', '250,251');
        $say('DATA', '354');
        $say($message . "\r\n.", '250');
        ($io['write'])("QUIT\r\n");
    } finally { ($io['close'])(); }
}

function delir_smtp_socket(string $host, int $port): array
{
    if (!preg_match('/^[a-z0-9.-]+$/i', $host) || $port < 1 || $port > 65535) throw new RuntimeException('welcome_mail_configuration_invalid');
    $context = stream_context_create(['ssl' => ['verify_peer' => true, 'verify_peer_name' => true, 'peer_name' => $host]]);
    $socket = @stream_socket_client('ssl://' . $host . ':' . $port, $errno, $error, 10, STREAM_CLIENT_CONNECT, $context);
    if ($socket === false) throw new RuntimeException('welcome_mail_connection_failed');
    stream_set_timeout($socket, 10);
    return [
        'read' => static fn(): string => (string) fgets($socket, 1024),
        'write' => static function (string $data) use ($socket): void { if (fwrite($socket, $data) !== strlen($data)) throw new RuntimeException('welcome_mail_write_failed'); },
        'close' => static function () use ($socket): void { fclose($socket); },
    ];
}

/** Sends the welcome email when the private configuration enables it. */
function delir_send_welcome(array $config, string $to, ?callable $open = null): bool
{
    if (($config['welcome_mail_enabled'] ?? false) !== true) return false;
    foreach (['smtp_host', 'smtp_port', 'smtp_user', 'smtp_password', 'mail_from'] as $key) {
        if (!isset($config[$key]) || $config[$key] === '' || $config[$key] === 'REPLACE_ON_SERVER') throw new RuntimeException('welcome_mail_configuration_invalid');
    }
    delir_smtp_send($config, $to, delir_welcome_message($config, $to, bin2hex(random_bytes(16)), time()), $open);
    return true;
}

