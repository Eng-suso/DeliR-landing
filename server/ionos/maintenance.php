<?php
declare(strict_types=1);

// Install in /private/delir only. Never expose maintenance through a public URL.
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }

function delir_cleanup_rates(PDO $pdo, int $now, bool $apply): int
{
    if (!$apply) {
        $query = $pdo->prepare('SELECT COUNT(*) FROM pilot_rate_limits WHERE expires_at <= ?');
        $query->execute([$now]);
        return (int) $query->fetchColumn();
    }
    $query = $pdo->prepare('DELETE FROM pilot_rate_limits WHERE expires_at <= ?');
    $query->execute([$now]);
    return $query->rowCount();
}

function delir_cleanup_diagnostics(string $file, int $now, bool $apply): int
{
    if (!is_file($file)) return 0;
    $handle = fopen($file, 'r+b');
    if ($handle === false) throw new RuntimeException('maintenance_failed');
    try {
        if (!flock($handle, LOCK_EX)) throw new RuntimeException('maintenance_failed');
        if ((fstat($handle)['size'] ?? 0) > 70000) throw new RuntimeException('maintenance_failed');
        $keep = []; $removed = 0;
        while (($line = fgets($handle)) !== false) {
            // Retain only the timestamp/fixed-code format produced by the entrypoint.
            $valid = preg_match('/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+00:00) ([a-z_]+)\r?\n?$/', $line, $matches) === 1;
            $stamp = $valid ? strtotime($matches[1]) : false;
            if ($stamp !== false && $stamp > $now - 7 * 86400 && $stamp <= $now) $keep[] = $line;
            else $removed++;
        }
        if ($apply && $removed > 0) {
            $content = implode('', $keep);
            rewind($handle);
            if ($content !== '' && fwrite($handle, $content) !== strlen($content)) throw new RuntimeException('maintenance_failed');
            if (!ftruncate($handle, strlen($content)) || !fflush($handle)) throw new RuntimeException('maintenance_failed');
        }
        flock($handle, LOCK_UN);
        return $removed;
    } finally { fclose($handle); }
}

if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) {
    if (count($argv) !== 2 || !in_array($argv[1], ['--dry-run', '--apply'], true)) {
        fwrite(STDERR, "Usage: php maintenance.php --dry-run|--apply\n"); exit(2);
    }
    ini_set('display_errors', '0');
    try {
        require __DIR__ . '/pilot.php';
        $config = require __DIR__ . '/config.php';
        if (!is_array($config)) throw new RuntimeException('maintenance_failed');
        $now = time(); $apply = $argv[1] === '--apply';
        $rates = delir_cleanup_rates(delir_connect_pilot($config), $now, $apply);
        $logs = delir_cleanup_diagnostics(__DIR__ . '/diagnostic.log', $now, $apply);
        // Counts only. No leads are selected, modified, exported or deleted.
        echo json_encode(['mode' => $argv[1], 'expired_counters' => $rates, 'diagnostic_lines' => $logs], JSON_THROW_ON_ERROR) . "\n";
    } catch (Throwable $error) {
        fwrite(STDERR, "maintenance_failed\n"); exit(1);
    }
}
