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
    echo "MariaDB product-interest integration passed.\n";
} elseif (in_array('--require-db', $argv, true)) {
    throw new RuntimeException('DELIR_TEST_DSN required');
} else { echo "MariaDB integration not run locally (no disposable database).\n"; }
echo $checks . " product-interest PHP checks passed.\n";
