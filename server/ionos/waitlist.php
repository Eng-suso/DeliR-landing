<?php
declare(strict_types=1);
require_once __DIR__ . '/pilot.php';

// The 2026-10-22 notice tells the visitor a welcome email with the product demo follows.
const DELIR_INTEREST_NOTICES = ['product-interest-2026-10-12', 'product-interest-2026-10-22'];
const DELIR_WELCOME_NOTICE = 'product-interest-2026-10-22';
// The demo page is the waitlist reward: unlisted, reached only from these emails.
const DELIR_DEMO_URL = 'https://delir.it/demo';

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
    if ($new && $data['noticeVersion'] === DELIR_WELCOME_NOTICE) {
        $result['welcome_to'] = $data['email'];
        $result['welcome_profile'] = ['practice' => $data['practice'], 'timing' => $data['timing']];
    }
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

/** Headers and body of a plain-text email: no tracking, no images. */
function delir_mail_message(array $config, string $to, string $subject, array $lines, string $messageId, int $now): string
{
    $from = (string) $config['mail_from'];
    if (!filter_var($to, FILTER_VALIDATE_EMAIL) || !filter_var($from, FILTER_VALIDATE_EMAIL)) throw new RuntimeException('mail_address_invalid');
    $body = implode("\r\n", array_merge($lines, ['', 'DeliR · ' . $from]));
    $headers = [
        'Date: ' . gmdate('D, d M Y H:i:s', $now) . ' +0000',
        'From: DeliR <' . $from . '>',
        'To: <' . $to . '>',
        'Reply-To: <' . $from . '>',
        'Subject: =?UTF-8?B?' . base64_encode($subject) . '?=',
        'Message-ID: <' . $messageId . '@delir.it>',
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: base64',
        'Auto-Submitted: auto-generated',
    ];
    return implode("\r\n", $headers) . "\r\n\r\n" . rtrim(chunk_split(base64_encode($body), 76, "\r\n"), "\r\n");
}

/** What the demo shows for the practice the visitor declared: [Italian, English]. */
function delir_demo_focus(string $practice): array
{
    return match ($practice) {
        'independent' => [
            'Da consulente indipendente, guarda come passi dalle interviste del cliente a un As-Is in BPMN in cui ogni elemento ha la sua fonte, fino a una simulazione da portare al cliente.',
            'As an independent consultant, see how you go from client interviews to a BPMN As-Is where every element has its source, and on to a simulation you can take to your client.',
        ],
        'consulting-team' => [
            'Per un team di consulenza, guarda come evidenze, versioni del processo e simulazioni restano in un unico progetto, fino alla consegna al process owner.',
            'For a consulting team, see how evidence, process versions and simulations stay in one project, up to the handover to the process owner.',
        ],
        'in-house' => [
            'Per un team Operations, guarda come ricostruisci un processo interno dalle interviste, misuri il collo di bottiglia e consegni un cruscotto al process owner.',
            'For an Operations team, see how you rebuild an internal process from interviews, measure its bottleneck and hand a dashboard to the process owner.',
        ],
        default => [
            'Guarda come DeliR passa dalle interviste al processo As-Is con le fonti, alla simulazione con i KPI, fino alla consegna al process owner.',
            'See how DeliR goes from interviews to the sourced As-Is process, the simulation with its KPIs and the handover to the process owner.',
        ],
    };
}

/** The welcome email: the link to the demo, worded for the declared practice and timing. */
function delir_welcome_message(array $config, string $to, string $messageId, int $now, array $profile = []): string
{
    [$focusIt, $focusEn] = delir_demo_focus((string) ($profile['practice'] ?? ''));
    [$pilotIt, $pilotEn] = match ((string) ($profile['timing'] ?? '')) {
        'active' => ['Hai indicato un incarico già attivo: se vuoi usare DeliR su quel processo, candidati al pilot:', 'You mentioned an active engagement: if you want to use DeliR on that process, apply for the pilot:'],
        'next-90-days' => ['Hai indicato un incarico nei prossimi 90 giorni: se vuoi partire con DeliR, candidati al pilot:', 'You mentioned an engagement in the next 90 days: if you want to start with DeliR, apply for the pilot:'],
        default => ['Hai un progetto reale su cui lavorare? Puoi candidarti al pilot:', 'Have a real project to work on? You can apply for the pilot:'],
    };
    return delir_mail_message($config, $to, 'La tua demo di DeliR (5 min) · Your DeliR demo', [
        'Ciao,',
        '',
        'sei nella lista d’attesa di DeliR: grazie per esserti iscritto.',
        '',
        'Come promesso, ecco la demo completa del prodotto (5 minuti, senza audio, caso dimostrativo):',
        DELIR_DEMO_URL,
        '',
        $focusIt,
        '',
        $pilotIt,
        'https://delir.it/pilot',
        '',
        'Ti scriverò a questo indirizzo quando aprirò nuovi accessi.',
        'Non ti sei iscritto tu? Ignora questa email oppure rispondi e cancello il tuo indirizzo.',
        '',
        '---',
        '',
        'Hi,',
        '',
        'you are on the DeliR waitlist: thanks for signing up.',
        '',
        'As promised, here is the full product demo (5 minutes, silent, demo case):',
        DELIR_DEMO_URL . '?lang=en',
        '',
        $focusEn,
        '',
        $pilotEn,
        'https://delir.it/pilot?lang=en',
        '',
        'I will email this address when I open new access.',
        'Didn’t sign up? Ignore this email or reply and I will delete your address.',
    ], $messageId, $now);
}

/** Confirms a pilot application to the applicant, by name. */
function delir_pilot_confirmation_message(array $config, array $application, string $messageId, int $now): string
{
    $name = trim((string) preg_replace('/\s+/u', ' ', (string) ($application['name'] ?? '')));
    [$timingIt, $timingEn] = ($application['timing'] ?? '') === 'active'
        ? ['Hai indicato un incarico già attivo: nella risposta partiamo da quello.', 'You mentioned an active engagement: my reply will start from it.']
        : ['Hai indicato un incarico nei prossimi 90 giorni: nella risposta ragioniamo anche sui tempi.', 'You mentioned an engagement in the next 90 days: my reply will also cover timing.'];
    return delir_mail_message($config, (string) ($application['to'] ?? ''), 'DeliR · Candidatura al pilot ricevuta / Pilot application received', [
        'Ciao ' . $name . ',',
        '',
        'ho ricevuto la tua candidatura al pilot di DeliR. La leggo personalmente e ti rispondo a questo indirizzo per concordare perimetro, milestone e criteri di valutazione.',
        '',
        $timingIt,
        '',
        'Intanto puoi guardare la demo completa del prodotto (5 minuti, senza audio, caso dimostrativo):',
        DELIR_DEMO_URL,
        '',
        'Non hai inviato tu questa candidatura? Ignora questa email oppure rispondi e cancello i tuoi dati.',
        '',
        '---',
        '',
        'Hi ' . $name . ',',
        '',
        'I received your application for the DeliR pilot. I read it personally and will reply to this address to agree on scope, milestones and acceptance criteria.',
        '',
        $timingEn,
        '',
        'Meanwhile, you can watch the full product demo (5 minutes, silent, demo case):',
        DELIR_DEMO_URL . '?lang=en',
        '',
        'Didn’t send this application? Ignore this email or reply and I will delete your details.',
    ], $messageId, $now);
}

/**
 * Minimal SMTP over implicit TLS (IONOS: port 465) with AUTH LOGIN. `$open`
 * returns ['read' => fn(): string, 'write' => fn(string), 'close' => fn()]; tests
 * pass a scripted server, production opens a verified TLS socket. A refusal
 * names the step (mail_rejected_auth, mail_rejected_recipient…) for the log.
 */
function delir_smtp_send(array $config, string $to, string $message, ?callable $open = null): void
{
    $io = $open ? $open() : delir_smtp_socket((string) $config['smtp_host'], (int) $config['smtp_port']);
    try {
        $expect = static function (string $codes, string $step) use ($io): void {
            $reply = '';
            do { $line = ($io['read'])(); $reply .= $line; }
            while ($line !== '' && strlen($line) > 3 && $line[3] === '-');
            if (!in_array(substr($reply, 0, 3), explode(',', $codes), true)) throw new RuntimeException('mail_rejected_' . $step);
        };
        $say = static function (string $command, string $codes, string $step) use ($io, $expect): void { ($io['write'])($command . "\r\n"); $expect($codes, $step); };
        $expect('220', 'greeting');
        $say('EHLO delir.it', '250', 'greeting');
        $say('AUTH LOGIN', '334', 'auth');
        $say(base64_encode((string) $config['smtp_user']), '334', 'auth');
        $say(base64_encode((string) $config['smtp_password']), '235', 'auth');
        $say('MAIL FROM:<' . $config['mail_from'] . '>', '250', 'sender');
        $say('RCPT TO:<' . $to . '>', '250,251', 'recipient');
        $say('DATA', '354', 'message');
        $say($message . "\r\n.", '250', 'message');
        ($io['write'])("QUIT\r\n");
    } finally { ($io['close'])(); }
}

function delir_smtp_socket(string $host, int $port): array
{
    if (!preg_match('/^[a-z0-9.-]+$/i', $host) || $port < 1 || $port > 65535) throw new RuntimeException('mail_configuration_invalid');
    $context = stream_context_create(['ssl' => ['verify_peer' => true, 'verify_peer_name' => true, 'peer_name' => $host]]);
    $socket = @stream_socket_client('ssl://' . $host . ':' . $port, $errno, $error, 10, STREAM_CLIENT_CONNECT, $context);
    if ($socket === false) throw new RuntimeException('mail_connection_failed');
    stream_set_timeout($socket, 10);
    return [
        'read' => static fn(): string => (string) fgets($socket, 1024),
        'write' => static function (string $data) use ($socket): void { if (fwrite($socket, $data) !== strlen($data)) throw new RuntimeException('mail_write_failed'); },
        'close' => static function () use ($socket): void { fclose($socket); },
    ];
}

/** False when the private configuration leaves email off; throws on a half-done setup. */
function delir_mail_enabled(array $config): bool
{
    if (($config['welcome_mail_enabled'] ?? false) !== true) return false;
    foreach (['smtp_host', 'smtp_port', 'smtp_user', 'smtp_password', 'mail_from'] as $key) {
        if (!isset($config[$key]) || $config[$key] === '' || $config[$key] === 'REPLACE_ON_SERVER') throw new RuntimeException('mail_configuration_invalid');
    }
    return true;
}

/** Sends the welcome email when the private configuration enables it. */
function delir_send_welcome(array $config, string $to, ?callable $open = null, array $profile = []): bool
{
    if (!delir_mail_enabled($config)) return false;
    delir_smtp_send($config, $to, delir_welcome_message($config, $to, bin2hex(random_bytes(16)), time(), $profile), $open);
    return true;
}

/** Sends the pilot confirmation (['to', 'name', 'timing']) under the same switch. */
function delir_send_pilot_confirmation(array $config, array $application, ?callable $open = null): bool
{
    if (!delir_mail_enabled($config)) return false;
    $message = delir_pilot_confirmation_message($config, $application, bin2hex(random_bytes(16)), time());
    delir_smtp_send($config, (string) $application['to'], $message, $open);
    return true;
}
