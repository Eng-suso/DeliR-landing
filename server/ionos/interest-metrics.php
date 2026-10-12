<?php
declare(strict_types=1);
// Private CLI, aggregate counts only. No public endpoint and no lead export.
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
function delir_interest_summary(PDO $pdo): array
{
    $query = $pdo->query("SELECT COUNT(*) AS requests,
        COALESCE(SUM(practice IN ('independent', 'consulting-team')), 0) AS consultant_requests,
        COALESCE(SUM(practice IN ('independent', 'consulting-team') AND timing = 'active'), 0) AS consultants_active_engagement,
        COALESCE(SUM(practice IN ('independent', 'consulting-team') AND timing = 'next-90-days'), 0) AS consultants_next_90_days,
        COALESCE(SUM(practice IN ('independent', 'consulting-team') AND timing = 'exploring'), 0) AS consultants_exploring,
        COALESCE(SUM(practice IN ('independent', 'consulting-team') AND timing = ''), 0) AS consultants_timing_unspecified
        FROM product_interest");
    return array_map('intval', $query->fetch(PDO::FETCH_ASSOC));
}
if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) {
    ini_set('display_errors', '0');
    try {
        if (count($argv) !== 1) throw new RuntimeException('invalid_arguments');
        require_once __DIR__ . '/pilot.php';
        $config = require __DIR__ . '/config.php';
        if (!is_array($config)) throw new RuntimeException('unconfigured');
        echo json_encode(delir_interest_summary(delir_connect_pilot($config)), JSON_THROW_ON_ERROR) . "\n";
    } catch (Throwable $error) {
        fwrite(STDERR, "interest_metrics_unavailable\n"); exit(1);
    }
}
