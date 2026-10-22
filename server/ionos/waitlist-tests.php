<?php
declare(strict_types=1);
require __DIR__ . '/waitlist.php';
require __DIR__ . '/interest-metrics.php';
require __DIR__ . '/maintenance.php';
$checks = 0;
function interest_check(bool $condition, string $label): void {
    global $checks;
    if (!$condition) throw new RuntimeException('FAIL: ' . $label);
    $checks++;
}
$fields = ['email' => 'DEMO@example.test', 'practice' => 'independent', 'timing' => '', 'source' => 'delir-product-interest', 'noticeVersion' => 'product-interest-2026-10-12'];
$raw = json_encode($fields, JSON_THROW_ON_ERROR);
interest_check(delir_validate_interest($raw)['email'] === 'demo@example.test', 'normalize and allow absent timing');
foreach ([['email', 'invalid'], ['email', str_repeat('x', 255) . '@example.test'], ['practice', 'administrator'], ['timing', 'tomorrow'], ['noticeVersion', 'other'], ['source', 'other'], ['email', "demo\0@example.test"], ['practice', ['array']]] as [$key, $value]) {
    interest_check(delir_validate_interest(json_encode(array_replace($fields, [$key => $value]))) === null, 'reject ' . $key);
}
interest_check(delir_validate_interest('{broken') === null, 'reject malformed JSON');
interest_check(delir_validate_interest(json_encode($fields + ['name' => 'unused'])) === null, 'reject extra personal fields');
interest_check(delir_validate_interest(json_encode(array_diff_key($fields, ['practice' => true]))) === null, 'require qualification');
$config = ['enabled' => true, 'waitlist_enabled' => true, 'origins' => ['https://delir.it'], 'rate_secret' => str_repeat('a', 64)];
$server = ['REQUEST_METHOD' => 'POST', 'HTTPS' => 'on', 'HTTP_ORIGIN' => 'https://delir.it', 'HTTP_SEC_FETCH_SITE' => 'same-origin', 'CONTENT_TYPE' => 'application/json', 'REMOTE_ADDR' => '192.0.2.1'];
$neverConnect = static function (): PDO { throw new RuntimeException('database must not be touched'); };
$neverRead = static function (): string { throw new RuntimeException('body must not be read'); };
foreach ([['REQUEST_METHOD', 'GET', 405], ['HTTPS', '', 403], ['HTTP_ORIGIN', 'https://attacker.test', 403], ['HTTP_SEC_FETCH_SITE', 'cross-site', 403], ['CONTENT_TYPE', 'text/plain', 415], ['CONTENT_LENGTH', '4097', 413]] as [$key, $value, $status]) {
    interest_check(delir_handle_interest(array_replace($server, [$key => $value]), $config, $neverRead, $neverConnect)['status'] === $status, 'guard ' . $key);
}
interest_check(delir_handle_interest($server, array_replace($config, ['waitlist_enabled' => false]), $neverRead, $neverConnect)['status'] === 503, 'pilot gate does not enable interest');
interest_check(delir_handle_interest($server, array_diff_key($config, ['waitlist_enabled' => true]), $neverRead, $neverConnect)['status'] === 503, 'old installations stay closed');
interest_check(delir_handle_interest($server, $config, static fn() => str_repeat('x', 4097), $neverConnect)['status'] === 413, 'stream size bound');
interest_check(delir_handle_interest($server, $config, static fn() => '{}', $neverConnect)['status'] === 422, 'validate before connection');
try {
    delir_handle_interest($server, $config, static fn() => $raw, $neverConnect);
    interest_check(false, 'connection failure must not accept');
} catch (RuntimeException $error) { interest_check(true, 'failure propagates to public generic response'); }

// Welcome email: accepted notice versions, message, SMTP dialogue, configuration gate.
interest_check(delir_validate_interest(json_encode(array_replace($fields, ['noticeVersion' => 'product-interest-2026-10-22'])))['noticeVersion'] === 'product-interest-2026-10-22', 'accept the notice announcing the welcome email');
$mailConfig = ['welcome_mail_enabled' => true, 'smtp_host' => 'smtp.example.test', 'smtp_port' => 465, 'smtp_user' => 'contact@delir.it', 'smtp_password' => 'secret-pass', 'mail_from' => 'contact@delir.it'];
$message = delir_welcome_message($mailConfig, 'demo@example.test', 'abc123', 1900000000, ['practice' => 'in-house', 'timing' => 'active']);
[$head, $encoded] = explode("\r\n\r\n", $message, 2);
$text = base64_decode(str_replace("\r\n", '', $encoded), true);
interest_check(str_contains($head, "To: <demo@example.test>") && str_contains($head, 'From: DeliR <contact@delir.it>'), 'welcome headers');
interest_check(str_contains($head, 'Subject: =?UTF-8?B?') && str_contains($head, 'Content-Type: text/plain; charset=UTF-8'), 'encoded subject and plain text');
interest_check(is_string($text) && str_contains($text, DELIR_DEMO_URL . "\r\n") && str_contains($text, DELIR_DEMO_URL . '?lang=en'), 'demo page link in both languages');
interest_check(!str_contains($text, '.mp4'), 'the email links the demo page, not the video file');
interest_check(str_contains($text, 'Per un team Operations') && str_contains($text, 'For an Operations team'), 'worded for the declared practice');
interest_check(str_contains($text, 'Hai indicato un incarico già attivo') && str_contains($text, 'You mentioned an active engagement'), 'worded for the declared timing');
$plain = base64_decode(str_replace("\r\n", '', explode("\r\n\r\n", delir_welcome_message($mailConfig, 'demo@example.test', 'x', 0), 2)[1]), true);
interest_check(str_contains($plain, 'Guarda come DeliR passa') && str_contains($plain, 'Hai un progetto reale'), 'generic wording without a profile');
$pilotMail = delir_pilot_confirmation_message($mailConfig, ['to' => 'lead@example.test', 'name' => "Anna\r\n  Rossi", 'timing' => 'next-90-days'], 'p1', 1900000000);
[$pilotHead, $pilotEncoded] = explode("\r\n\r\n", $pilotMail, 2);
$pilotText = base64_decode(str_replace("\r\n", '', $pilotEncoded), true);
interest_check(str_contains($pilotHead, 'To: <lead@example.test>') && str_contains($pilotText, 'Ciao Anna Rossi,') && str_contains($pilotText, 'Hi Anna Rossi,'), 'pilot confirmation greets the applicant by name on one line');
interest_check(str_contains($pilotText, 'ho ricevuto la tua candidatura al pilot') && str_contains($pilotText, 'incarico nei prossimi 90 giorni') && str_contains($pilotText, DELIR_DEMO_URL), 'pilot confirmation content');
interest_check(str_contains($text, 'Non ti sei iscritto tu?') && str_contains($text, 'Didn’t sign up?'), 'opt-out line in both languages');
interest_check(!preg_match('/<img|https?:\/\/[^\s]*\?(utm|t)=/i', $text), 'no tracking in the email');
foreach (array_filter(explode("\r\n", $encoded)) as $line) interest_check(strlen($line) <= 76 && $line[0] !== '.', 'body lines are short and need no dot-stuffing');
try { delir_welcome_message($mailConfig, "demo@example.test\r\nBcc: other@example.test", 'x', 0); interest_check(false, 'header injection must fail'); }
catch (RuntimeException $error) { interest_check($error->getMessage() === 'mail_address_invalid', 'reject header injection'); }
$scripted = static function (array $replies, array &$written): callable {
    return static function () use ($replies, &$written): array {
        $queue = $replies;
        return [
            'read' => static function () use (&$queue): string { return (string) array_shift($queue); },
            'write' => static function (string $data) use (&$written): void { $written[] = $data; },
            'close' => static function () use (&$written): void { $written[] = 'CLOSED'; },
        ];
    };
};
$written = [];
delir_smtp_send($mailConfig, 'demo@example.test', $message, $scripted(["220 ready\r\n", "250-smtp\r\n", "250 AUTH LOGIN\r\n", "334 VXNlcm5hbWU6\r\n", "334 UGFzc3dvcmQ6\r\n", "235 ok\r\n", "250 ok\r\n", "250 ok\r\n", "354 go\r\n", "250 queued\r\n"], $written));
interest_check($written[0] === "EHLO delir.it\r\n" && $written[2] === base64_encode('contact@delir.it') . "\r\n", 'SMTP greeting and login');
interest_check($written[4] === "MAIL FROM:<contact@delir.it>\r\n" && $written[5] === "RCPT TO:<demo@example.test>\r\n", 'SMTP envelope');
interest_check(str_ends_with($written[7], "\r\n.\r\n") && end($written) === 'CLOSED', 'message terminated and connection closed');
$written = [];
try {
    delir_smtp_send($mailConfig, 'demo@example.test', $message, $scripted(["220 ready\r\n", "250 ok\r\n", "334 x\r\n", "334 x\r\n", "535 auth failed\r\n"], $written));
    interest_check(false, 'rejected login must fail');
} catch (RuntimeException $error) { interest_check($error->getMessage() === 'mail_rejected_auth' && end($written) === 'CLOSED', 'rejected login names the step and closes');
$written = [];
try {
    delir_smtp_send($mailConfig, 'demo@example.test', $message, $scripted(["220 ready\r\n", "250 ok\r\n", "334 x\r\n", "334 x\r\n", "235 ok\r\n", "250 ok\r\n", "550 relay denied\r\n"], $written));
    interest_check(false, 'rejected recipient must fail');
} catch (RuntimeException $error) { interest_check($error->getMessage() === 'mail_rejected_recipient', 'rejected recipient names the step'); } }
$neverOpen = static function (): array { throw new RuntimeException('SMTP must not be opened'); };
interest_check(delir_send_welcome(array_replace($mailConfig, ['welcome_mail_enabled' => false]), 'demo@example.test', $neverOpen) === false, 'welcome email is off unless enabled');
interest_check(delir_send_welcome(array_diff_key($mailConfig, ['welcome_mail_enabled' => true]), 'demo@example.test', $neverOpen) === false, 'old configurations send nothing');
try { delir_send_welcome(array_replace($mailConfig, ['smtp_password' => 'REPLACE_ON_SERVER']), 'demo@example.test', $neverOpen); interest_check(false, 'placeholder must fail'); }
catch (RuntimeException $error) { interest_check($error->getMessage() === 'mail_configuration_invalid', 'placeholder credentials are refused before connecting');
interest_check(delir_send_pilot_confirmation(array_replace($mailConfig, ['welcome_mail_enabled' => false]), ['to' => 'lead@example.test', 'name' => 'Anna', 'timing' => 'active'], $neverOpen) === false, 'pilot confirmation follows the same switch');
$written = [];
interest_check(delir_send_pilot_confirmation($mailConfig, ['to' => 'lead@example.test', 'name' => 'Anna', 'timing' => 'active'], $scripted(["220 ready\r\n", "250 ok\r\n", "334 x\r\n", "334 x\r\n", "235 ok\r\n", "250 ok\r\n", "250 ok\r\n", "354 go\r\n", "250 queued\r\n"], $written)) && $written[5] === "RCPT TO:<lead@example.test>\r\n", 'pilot confirmation goes to the applicant'); }

// Run the actual public entrypoint against disposable private files, never IONOS.
$fixture = sys_get_temp_dir() . '/delir-interest-endpoint-' . bin2hex(random_bytes(8));
mkdir($fixture . '/public/api', 0700, true);
mkdir($fixture . '/private/delir', 0700, true);
copy(__DIR__ . '/../../public/api/waitlist.php', $fixture . '/public/api/waitlist.php');
$cases = ['capture_disabled', 'string_gate', 'private_config_missing', 'private_config_invalid',
    'private_waitlist_missing', 'private_pilot_missing', 'private_library_invalid', 'private_handler_missing',
    'php_extensions_missing', 'database_connection_failed', 'request_failed', 'bounded_log'];
foreach ($cases as $case) {
    $configFile = $fixture . '/private/delir/config.php';
    $libraryFile = $fixture . '/private/delir/waitlist.php';
    $pilotFile = $fixture . '/private/delir/pilot.php';
    $logFile = $fixture . '/private/delir/diagnostic.log';
    if (is_file($logFile)) unlink($logFile);
    copy(__DIR__ . '/waitlist.php', $libraryFile);
    copy(__DIR__ . '/pilot.php', $pilotFile);
    file_put_contents($configFile, "<?php return ['waitlist_enabled' => false, 'test_marker' => 'DO_NOT_LOG_RESPONSE'];");
    if ($case === 'string_gate') file_put_contents($configFile, "<?php return ['waitlist_enabled' => 'true'];");
    if ($case === 'private_config_missing') unlink($configFile);
    if ($case === 'private_config_invalid') file_put_contents($configFile, '<?php invalid syntax');
    if ($case === 'private_waitlist_missing') unlink($libraryFile);
    if ($case === 'private_pilot_missing') unlink($pilotFile);
    if ($case === 'private_library_invalid') file_put_contents($libraryFile, '<?php invalid syntax');
    if ($case === 'private_handler_missing') file_put_contents($libraryFile, '<?php // library with an incompatible entrypoint');
    if ($case === 'php_extensions_missing') file_put_contents($configFile, "<?php return ['waitlist_enabled' => true];");
    if (in_array($case, ['database_connection_failed', 'request_failed'], true)) {
        $message = $case === 'request_failed' ? 'DO_NOT_LOG_RESPONSE' : $case;
        file_put_contents($libraryFile, "<?php function delir_handle_interest(...\$args): array { throw new RuntimeException('" . $message . "'); }");
    }
    if ($case === 'bounded_log') file_put_contents($logFile, str_repeat('x', 65537));
    $process = proc_open([PHP_BINARY, '-n', $fixture . '/public/api/waitlist.php'], [1 => ['pipe', 'w'], 2 => ['pipe', 'w']], $pipes);
    if (!is_resource($process)) throw new RuntimeException('test process unavailable');
    $output = stream_get_contents($pipes[1]);
    $stderr = stream_get_contents($pipes[2]);
    fclose($pipes[1]); fclose($pipes[2]);
    interest_check(proc_close($process) === 0, 'entrypoint catches ' . $case);
    interest_check(json_decode($output, true) === ['accepted' => false, 'error' => 'temporarily_unavailable'], 'generic response ' . $case);
    $log = file_get_contents($logFile);
    $event = in_array($case, ['string_gate', 'bounded_log'], true) ? 'capture_disabled' : $case;
    interest_check(str_contains($log, 'interest_' . $event), 'private diagnostic ' . $case);
    interest_check(!str_contains($output . $log . $stderr, 'DO_NOT_LOG_RESPONSE'), 'no values leaked ' . $case);
    interest_check(strlen($log) < 512, 'bounded fixed-code log ' . $case);
}
foreach ([$configFile, $libraryFile, $pilotFile, $logFile, $fixture . '/public/api/waitlist.php'] as $file) if (is_file($file)) unlink($file);
foreach (['/public/api', '/public', '/private/delir', '/private', ''] as $directory) rmdir($fixture . $directory);

$dsn = getenv('DELIR_TEST_DSN');
if ($dsn) {
    if (!preg_match('/(?:^|;)dbname=delir_test(?:;|$)/', $dsn)) throw new RuntimeException('disposable database required');
    $pdo = new PDO($dsn, getenv('DELIR_TEST_USER'), getenv('DELIR_TEST_PASSWORD'), [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_EMULATE_PREPARES => false]);
    $pdo->exec(file_get_contents(__DIR__ . '/schema.sql'));
    $pdo->exec('DELETE FROM product_interest');
    $pdo->exec('DELETE FROM pilot_rate_limits');
    $data = delir_validate_interest($raw);
    $clock = 1900000000;
    $accepted = delir_store_interest($pdo, $data, '192.0.2.1', $config['rate_secret'], $clock);
    interest_check($accepted['body'] === ['accepted' => true], 'committed receipt');
    $duplicate = array_replace($data, ['practice' => 'other', 'timing' => 'active']);
    interest_check(delir_store_interest($pdo, $duplicate, '192.0.2.1', $config['rate_secret'], $clock)['body'] === $accepted['body'], 'duplicates have identical response');
    interest_check((int) $pdo->query('SELECT COUNT(*) FROM product_interest')->fetchColumn() === 1, 'one email is one request');
    interest_check($pdo->query('SELECT practice FROM product_interest')->fetchColumn() === 'independent', 'duplicates do not overwrite intent');
    for ($i = 0; $i < 3; $i++) delir_store_interest($pdo, $data, '192.0.2.1', $config['rate_secret'], $clock);
    interest_check(delir_store_interest($pdo, $data, '192.0.2.1', $config['rate_secret'], $clock)['status'] === 429, 'per-IP quota');
    interest_check(!str_contains(json_encode($pdo->query('SELECT * FROM pilot_rate_limits')->fetchAll(PDO::FETCH_ASSOC)), '192.0.2.1'), 'no raw IP stored');
    interest_check(delir_store_interest($pdo, $data, '192.0.2.1', $config['rate_secret'], $clock + 900)['status'] === 201, 'window expires');
    $pdo->exec('DELETE FROM pilot_rate_limits');
    for ($i = 0; $i < 100; $i++) {
        interest_check(delir_store_interest($pdo, $data, '192.0.2.' . ($i + 1), $config['rate_secret'], $clock)['status'] === 201, 'global quota allows');
    }
    interest_check(delir_store_interest($pdo, $data, '192.0.2.200', $config['rate_secret'], $clock)['status'] === 429, 'global quota blocks');
    $summary = delir_interest_summary($pdo);
    interest_check($summary['requests'] === 1 && $summary['consultant_requests'] === 1 && $summary['consultants_timing_unspecified'] === 1, 'summary is deduplicated');
    interest_check(!str_contains(json_encode($summary), 'example.test'), 'summary contains no personal data');
    $pdo->exec('DELETE FROM pilot_rate_limits');
    $pdo->exec('DROP TABLE product_interest');
    try {
        delir_store_interest($pdo, $data, '192.0.2.1', $config['rate_secret'], $clock);
        interest_check(false, 'failed insert must not accept');
    } catch (PDOException $error) {
        interest_check((int) $pdo->query('SELECT COUNT(*) FROM pilot_rate_limits')->fetchColumn() === 0, 'failed writes roll back quota');
    }
    $pdo->exec(file_get_contents(__DIR__ . '/schema.sql'));
    delir_store_interest($pdo, $data, '192.0.2.1', $config['rate_secret'], $clock);
    $pdo->exec("UPDATE product_interest SET created_at = DATE_SUB(UTC_TIMESTAMP(), INTERVAL 13 MONTH)");
    interest_check(delir_cleanup_interest($pdo, false) === 1, 'retention dry run counts');
    interest_check((int) $pdo->query('SELECT COUNT(*) FROM product_interest')->fetchColumn() === 1, 'dry run preserves requests');
    interest_check(delir_cleanup_interest($pdo, true) === 1, 'twelve-month retention removes expired requests');
    // Only a new address shown the welcome notice gets the email; duplicates stay silent.
    $pdo->exec('DELETE FROM product_interest');
    $pdo->exec('DELETE FROM pilot_rate_limits');
    $welcomeRaw = json_encode(array_replace($fields, ['email' => 'welcome@example.test', 'noticeVersion' => 'product-interest-2026-10-22']));
    $connect = static fn(): PDO => $pdo;
    $first = delir_handle_interest($server, $config, static fn() => $welcomeRaw, $connect);
    interest_check($first['body'] === ['accepted' => true] && ($first['welcome_to'] ?? null) === 'welcome@example.test', 'new address gets the welcome email');
    interest_check(($first['welcome_profile'] ?? null) === ['practice' => 'independent', 'timing' => ''], 'welcome email knows the declared practice and timing');
    $again = delir_handle_interest($server, $config, static fn() => $welcomeRaw, $connect);
    interest_check($again['body'] === $first['body'] && !isset($again['welcome_to']), 'duplicate gets the same answer and no email');
    $oldNotice = delir_handle_interest($server, $config, static fn() => json_encode(array_replace($fields, ['email' => 'old@example.test'])), $connect);
    interest_check(!isset($oldNotice['welcome_to']), 'no email to people shown the earlier notice');
    echo "MariaDB product-interest integration passed.\n";
} elseif (in_array('--require-db', $argv, true)) {
    throw new RuntimeException('DELIR_TEST_DSN required');
} else { echo "MariaDB integration not run locally (no disposable database).\n"; }
echo $checks . " product-interest PHP checks passed.\n";
