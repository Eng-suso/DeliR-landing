<?php
declare(strict_types=1);

ini_set('display_errors', '0');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header("Content-Security-Policy: default-src 'none'; frame-ancestors 'none'");
header('Referrer-Policy: no-referrer');

try {
    // /public/api/pilot.php -> /private/delir, outside the web document root.
    $private = dirname(__DIR__, 2) . '/private/delir';
    if (!is_file($private . '/config.php') || !is_file($private . '/pilot.php')) {
        throw new RuntimeException('unconfigured');
    }
    require $private . '/pilot.php';
    $config = require $private . '/config.php';
    $result = delir_handle_pilot($_SERVER, $config, static function (): string {
        $stream = fopen('php://input', 'rb');
        if ($stream === false) throw new RuntimeException('input_unavailable');
        try { return (string) stream_get_contents($stream, 8193); }
        finally { fclose($stream); }
    });
    http_response_code($result['status']);
    if ($result['status'] === 405) header('Allow: POST');
    if ($result['status'] === 429) header('Retry-After: ' . $result['retry_after']);
    echo json_encode($result['body'], JSON_THROW_ON_ERROR);
} catch (Throwable $error) {
    // Fixed event only. Never log payloads, IP addresses, SQL or exception text.
    error_log('delir_pilot_unavailable');
    http_response_code(503);
    echo '{"accepted":false,"error":"temporarily_unavailable"}';
}
