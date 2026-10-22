<?php
declare(strict_types=1);
// Serve build-time HTML; no database, credentials, visitor data or AI calls.
$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$routes = ['/' => 'home', '/pilot' => 'pilot', '/security-data' => 'security-data', '/comparison-sources' => 'comparison-sources', '/privacy' => 'privacy', '/waitlist' => 'waitlist', '/demo' => 'demo', '/v2' => 'v2'];
$language = ($_GET['lang'] ?? '') === 'en' ? 'en' : 'it';
$name = $routes[$path] ?? '404';
$file = __DIR__ . '/seo/' . $name . '.' . $language . '.html';
if (!is_file($file)) {
    http_response_code(503);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'Site build unavailable.';
    exit;
}
http_response_code($name === '404' ? 404 : 200);
header('Content-Type: text/html; charset=utf-8');
header('Content-Language: ' . $language);
if ($path === '/v2') header('X-Robots-Tag: noindex, follow');
header('Cache-Control: no-cache');
readfile($file);
