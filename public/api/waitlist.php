<?php
declare(strict_types=1);
ini_set('display_errors', '0');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header("Content-Security-Policy: default-src 'none'; frame-ancestors 'none'");
header('Referrer-Policy: no-referrer');
$private = dirname(__DIR__, 2) . '/private/delir';
$stage = 'private_directory_missing';
function delir_interest_private_event(string $private, string $event): void
{
    // Fixed codes only, in the same bounded private log used by pilot maintenance.
    $handle = @fopen($private . '/diagnostic.log', 'c+b');
    if ($handle === false) { error_log('delir_interest_diagnostic_unavailable'); return; }
    try {
        if (!flock($handle, LOCK_EX)) return;
        if ((fstat($handle)['size'] ?? 0) > 65536) ftruncate($handle, 0);
        fseek($handle, 0, SEEK_END);
        fwrite($handle, gmdate('c') . ' interest_' . $event . "\n");
        fflush($handle);
        flock($handle, LOCK_UN);
    } finally { fclose($handle); }
}
try {
    if (!is_dir($private)) throw new RuntimeException('unconfigured');
    $stage = 'private_config_missing';
    if (!is_file($private . '/config.php')) throw new RuntimeException('unconfigured');
    $stage = 'private_waitlist_missing';
    if (!is_file($private . '/waitlist.php')) throw new RuntimeException('unconfigured');
    $stage = 'private_pilot_missing';
    if (!is_file($private . '/pilot.php')) throw new RuntimeException('unconfigured');
    $stage = 'private_library_invalid';
    require $private . '/waitlist.php';
    $stage = 'private_handler_missing';
    if (!function_exists('delir_handle_interest')) throw new RuntimeException('unconfigured');
    $stage = 'private_config_invalid';
    $config = require $private . '/config.php';
    if (!is_array($config)) throw new RuntimeException('unconfigured');
    $stage = 'php_extensions_missing';
    if (($config['waitlist_enabled'] ?? false) === true && !extension_loaded('pdo_mysql')) throw new RuntimeException('unconfigured');
    $stage = 'request_failed';
    $result = delir_handle_interest($_SERVER, $config, static function (): string {
        $stream = fopen('php://input', 'rb');
        if ($stream === false) throw new RuntimeException('input_unavailable');
        try { return (string) stream_get_contents($stream, 4097); }
        finally { fclose($stream); }
    });
    if ($result['status'] === 503) delir_interest_private_event($private, 'capture_disabled');
    http_response_code($result['status']);
    if ($result['status'] === 405) header('Allow: POST');
    if ($result['status'] === 429) header('Retry-After: ' . $result['retry_after']);
    echo json_encode($result['body'], JSON_THROW_ON_ERROR);
} catch (Throwable $error) {
    // No request fields, IP, SQL, configuration values or exception details.
    $known = ['rate_secret_invalid', 'database_configuration_invalid', 'database_connection_failed', 'database_write_failed'];
    $event = $error instanceof RuntimeException && in_array($error->getMessage(), $known, true) ? $error->getMessage() : $stage;
    delir_interest_private_event($private, $event);
    http_response_code(503);
    echo '{"accepted":false,"error":"temporarily_unavailable"}';
}
