<?php
declare(strict_types=1);
ini_set('display_errors', '0');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header("Content-Security-Policy: default-src 'none'; frame-ancestors 'none'");
header('Referrer-Policy: no-referrer');
$private = dirname(__DIR__, 2) . '/private/delir';
try {
    if (!is_file($private . '/config.php') || !is_file($private . '/waitlist.php') || !is_file($private . '/pilot.php')) throw new RuntimeException('unconfigured');
    require $private . '/waitlist.php';
    $config = require $private . '/config.php';
    if (!is_array($config)) throw new RuntimeException('unconfigured');
    if (($config['waitlist_enabled'] ?? false) === true && !extension_loaded('pdo_mysql')) throw new RuntimeException('unconfigured');
    $result = delir_handle_interest($_SERVER, $config, static function (): string {
        $stream = fopen('php://input', 'rb');
        if ($stream === false) throw new RuntimeException('input_unavailable');
        try { return (string) stream_get_contents($stream, 4097); }
        finally { fclose($stream); }
    });
    http_response_code($result['status']);
    if ($result['status'] === 405) header('Allow: POST');
    if ($result['status'] === 429) header('Retry-After: ' . $result['retry_after']);
    echo json_encode($result['body'], JSON_THROW_ON_ERROR);
} catch (Throwable $error) {
    // A fixed server code only; no request fields, IP, SQL or exception detail.
    error_log('delir_interest_unavailable');
    http_response_code(503);
    echo '{"accepted":false,"error":"temporarily_unavailable"}';
}
