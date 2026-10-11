<?php
declare(strict_types=1);
require __DIR__ . '/pilot.php';

$checks = 0;
function check(bool $condition, string $label): void {
    global $checks;
    if (!$condition) throw new RuntimeException('FAIL: ' . $label);
    $checks++;
}
$fields = ['name' => 'Demo User', 'email' => 'DEMO@example.test', 'practice' => 'independent', 'timing' => 'active', 'projectBrief' => 'Review an example procurement process.', 'source' => 'delir-pilot-application'];
$raw = json_encode($fields, JSON_THROW_ON_ERROR);
check(delir_validate_pilot($raw)['email'] === 'demo@example.test', 'normalize email');
foreach ([['name', str_repeat('a', 101)], ['email', 'bad'], ['practice', 'administrator'], ['timing', 'other'], ['projectBrief', 'short'], ['projectBrief', str_repeat('a', 601)], ['name', "hidden\0control"], ['source', 'other'], ['name', ['array']]] as [$key, $value]) {
    check(delir_validate_pilot(json_encode(array_replace($fields, [$key => $value]))) === null, 'invalid ' . $key);
}
check(delir_validate_pilot('{broken') === null, 'malformed JSON');
check(delir_validate_pilot(json_encode($fields + ['unknown' => 'value'])) === null, 'unexpected field');
check(delir_validate_pilot(json_encode(array_diff_key($fields, ['name' => true]))) === null, 'missing field');
check(delir_validate_pilot(json_encode(array_replace($fields, ['name' => 'Éléonore', 'projectBrief' => str_repeat('è', 600)]))) !== null, 'UTF-8 boundaries');
$config = ['enabled' => true, 'origins' => ['https://delir.it'], 'rate_secret' => str_repeat('a', 64)];
$server = ['REQUEST_METHOD' => 'POST', 'HTTPS' => 'on', 'HTTP_ORIGIN' => 'https://delir.it', 'HTTP_SEC_FETCH_SITE' => 'same-origin', 'CONTENT_TYPE' => 'application/json', 'REMOTE_ADDR' => '192.0.2.1'];
$neverConnect = static function (): PDO { throw new RuntimeException('database must not be touched'); };
$neverRead = static function (): string { throw new RuntimeException('body must not be read'); };
foreach ([['REQUEST_METHOD', 'GET', 405], ['HTTPS', '', 403], ['HTTP_ORIGIN', 'https://attacker.test', 403], ['HTTP_SEC_FETCH_SITE', 'cross-site', 403], ['CONTENT_TYPE', 'text/plain', 415], ['CONTENT_LENGTH', '8193', 413]] as [$key, $value, $status]) {
    check(delir_handle_pilot(array_replace($server, [$key => $value]), $config, $neverRead, $neverConnect)['status'] === $status, 'request guard ' . $key);
}
check(delir_handle_pilot($server, array_replace($config, ['enabled' => false]), $neverRead, $neverConnect)['status'] === 503, 'closed by default');
check(delir_handle_pilot($server, $config, static fn() => str_repeat('x', 8193), $neverConnect)['status'] === 413, 'stream size bound');
check(delir_handle_pilot($server, $config, static fn() => '{}', $neverConnect)['status'] === 422, 'invalid before connection');
check(delir_handle_pilot(array_replace($server, ['REMOTE_ADDR' => 'invalid']), $config, static fn() => $raw, $neverConnect)['status'] === 403, 'invalid peer');
try {
    delir_handle_pilot($server, $config, static fn() => $raw, $neverConnect);
    check(false, 'database failure must not accept');
} catch (RuntimeException $error) { check(true, 'connection failure propagates to generic endpoint handler'); }

// Exercise the actual public entrypoint in a temporary document root, with no
// production config and no extensions: responses stay generic, logs stay private.
$fixture = sys_get_temp_dir() . '/delir-endpoint-test-' . bin2hex(random_bytes(8));
mkdir($fixture . '/public/api', 0700, true);
mkdir($fixture . '/private/delir', 0700, true);
copy(__DIR__ . '/../../public/api/pilot.php', $fixture . '/public/api/pilot.php');
foreach (['capture_disabled', 'private_config_invalid', 'private_library_missing', 'private_config_missing', 'php_extensions_missing'] as $case) {
    $configFile = $fixture . '/private/delir/config.php';
    $libraryFile = $fixture . '/private/delir/pilot.php';
    $logFile = $fixture . '/private/delir/diagnostic.log';
    if (is_file($logFile)) unlink($logFile);
    copy(__DIR__ . '/pilot.php', $libraryFile);
    file_put_contents($configFile, "<?php return ['enabled' => false, 'test_marker' => 'not-a-secret-test-marker'];");
    if ($case === 'private_config_invalid') file_put_contents($configFile, '<?php invalid syntax');
    if ($case === 'private_library_missing') unlink($libraryFile);
    if ($case === 'private_config_missing') unlink($configFile);
    if ($case === 'php_extensions_missing') file_put_contents($configFile, "<?php return ['enabled' => true];");
    $process = proc_open([PHP_BINARY, '-n', $fixture . '/public/api/pilot.php'], [1 => ['pipe', 'w'], 2 => ['pipe', 'w']], $pipes);
    if (!is_resource($process)) throw new RuntimeException('test process unavailable');
    $output = stream_get_contents($pipes[1]);
    $stderr = stream_get_contents($pipes[2]);
    fclose($pipes[1]); fclose($pipes[2]);
    check(proc_close($process) === 0, 'entrypoint catches ' . $case);
    check(json_decode($output, true) === ['accepted' => false, 'error' => 'temporarily_unavailable'], 'generic response ' . $case);
    $log = file_get_contents($logFile);
    check(str_contains($log, $case) && !str_contains($output . $log . $stderr, 'not-a-secret-test-marker'), 'safe private diagnostic ' . $case);
}
foreach ([$configFile, $libraryFile, $logFile, $fixture . '/public/api/pilot.php'] as $file) if (is_file($file)) unlink($file);
foreach (['/public/api', '/public', '/private/delir', '/private', ''] as $directory) rmdir($fixture . $directory);

$dsn = getenv('DELIR_TEST_DSN');
if ($dsn) {
    // Only an isolated disposable test database. Never run against production.
    if (!str_contains($dsn, 'dbname=delir_test')) throw new RuntimeException('disposable database required');
    $pdo = new PDO($dsn, getenv('DELIR_TEST_USER'), getenv('DELIR_TEST_PASSWORD'), [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_EMULATE_PREPARES => false]);
    $pdo->exec(file_get_contents(__DIR__ . '/schema.sql'));
    $pdo->exec('DELETE FROM pilot_applications');
    $pdo->exec('DELETE FROM pilot_rate_limits');
    $data = delir_validate_pilot($raw);
    $data['name'] = "Demo'); DROP TABLE pilot_applications; --";
    $clock = 1900000000;
    for ($i = 0; $i < 5; $i++) check(delir_store_pilot($pdo, $data, '192.0.2.1', $config['rate_secret'], $clock)['body']['accepted'] === true, 'committed application');
    check(delir_store_pilot($pdo, $data, '192.0.2.1', $config['rate_secret'], $clock)['status'] === 429, 'IP quota');
    check((int) $pdo->query('SELECT COUNT(*) FROM pilot_applications')->fetchColumn() === 5, 'blocked submission not saved');
    check($pdo->query('SELECT name FROM pilot_applications LIMIT 1')->fetchColumn() === $data['name'], 'injection stored as literal text');
    check(!str_contains(json_encode($pdo->query('SELECT * FROM pilot_rate_limits')->fetchAll(PDO::FETCH_ASSOC)), '192.0.2.1'), 'no raw IP');
    check(delir_store_pilot($pdo, $data, '192.0.2.1', $config['rate_secret'], $clock + 900)['status'] === 201, 'quota window expires');
    $pdo->exec('DELETE FROM pilot_rate_limits');
    for ($i = 0; $i < 100; $i++) check(delir_store_pilot($pdo, $data, '192.0.2.' . ($i + 1), $config['rate_secret'], $clock)['status'] === 201, 'global quota allows');
    check(delir_store_pilot($pdo, $data, '192.0.2.200', $config['rate_secret'], $clock)['status'] === 429, 'global quota blocks');
    $pdo->exec('DELETE FROM pilot_rate_limits');
    $pdo->exec('DROP TABLE pilot_applications');
    try {
        delir_store_pilot($pdo, $data, '192.0.2.1', $config['rate_secret'], $clock);
        check(false, 'insert failure must not accept');
    } catch (PDOException $error) { check((int) $pdo->query('SELECT COUNT(*) FROM pilot_rate_limits')->fetchColumn() === 0, 'failed save rolls quota back'); }
    $pdo->exec(file_get_contents(__DIR__ . '/schema.sql'));
    echo "MariaDB integration passed.\n";
} elseif (in_array('--require-db', $argv, true)) {
    throw new RuntimeException('DELIR_TEST_DSN required');
} else {
    echo "MariaDB integration not run locally (no disposable database).\n";
}
echo $checks . " PHP checks passed.\n";
