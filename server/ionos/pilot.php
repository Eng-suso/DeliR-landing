<?php
declare(strict_types=1);

function delir_result(int $status, string $error, int $retryAfter = 0): array
{
    return ['status' => $status, 'body' => ['accepted' => false, 'error' => $error], 'retry_after' => $retryAfter];
}

function delir_validate_pilot(string $raw): ?array
{
    try { $data = json_decode($raw, true, 16, JSON_THROW_ON_ERROR); }
    catch (JsonException $error) { return null; }
    $keys = ['name', 'email', 'practice', 'timing', 'projectBrief', 'source'];
    if (!is_array($data) || count($data) !== count($keys) || array_diff($keys, array_keys($data))) return null;
    foreach ($keys as $key) {
        if (!is_string($data[$key])) return null;
        $data[$key] = trim($data[$key]);
        // Reject hidden controls; allow ordinary line breaks in the project brief.
        if (preg_match('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', $data[$key]) !== 0) return null;
    }
    if (mb_strlen($data['name'], 'UTF-8') < 1 || mb_strlen($data['name'], 'UTF-8') > 100) return null;
    if (strlen($data['email']) > 254 || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) return null;
    if (!in_array($data['practice'], ['independent', 'boutique', 'consulting-firm', 'in-house-operations'], true)) return null;
    if (!in_array($data['timing'], ['active', 'next-90-days'], true)) return null;
    if (mb_strlen($data['projectBrief'], 'UTF-8') < 20 || mb_strlen($data['projectBrief'], 'UTF-8') > 600) return null;
    if ($data['source'] !== 'delir-pilot-application') return null;
    $data['email'] = strtolower($data['email']);
    return $data;
}

function delir_handle_pilot(array $server, array $config, callable $readBody, ?callable $connect = null): array
{
    if (($config['enabled'] ?? false) !== true) return delir_result(503, 'temporarily_unavailable');
    if (($server['REQUEST_METHOD'] ?? '') !== 'POST') return delir_result(405, 'method_not_allowed');
    // Do not trust client-controlled forwarded headers.
    if (!in_array(strtolower((string) ($server['HTTPS'] ?? '')), ['on', '1'], true)) return delir_result(403, 'https_required');
    if (!in_array($server['HTTP_ORIGIN'] ?? '', $config['origins'] ?? [], true)) return delir_result(403, 'origin_not_allowed');
    if (isset($server['HTTP_SEC_FETCH_SITE']) && $server['HTTP_SEC_FETCH_SITE'] !== 'same-origin') return delir_result(403, 'origin_not_allowed');
    if (strtolower(trim(explode(';', $server['CONTENT_TYPE'] ?? '')[0])) !== 'application/json') return delir_result(415, 'json_required');
    if (isset($server['CONTENT_LENGTH']) && (!ctype_digit((string) $server['CONTENT_LENGTH']) || (int) $server['CONTENT_LENGTH'] > 8192)) return delir_result(413, 'body_too_large');
    $raw = $readBody();
    if (strlen($raw) > 8192) return delir_result(413, 'body_too_large');
    $data = delir_validate_pilot($raw);
    if ($data === null) return delir_result(422, 'invalid_application');
    if (!is_string($config['rate_secret'] ?? null) || !preg_match('/^[a-f0-9]{64}$/', $config['rate_secret'])) throw new RuntimeException('rate_secret_invalid');
    $ip = $server['REMOTE_ADDR'] ?? '';
    if (!filter_var($ip, FILTER_VALIDATE_IP)) return delir_result(403, 'client_unavailable');
    try { $pdo = $connect ? $connect() : delir_connect_pilot($config); }
    catch (PDOException $error) { throw new RuntimeException('database_connection_failed', 0, $error); }
    try { return delir_store_pilot($pdo, $data, $ip, $config['rate_secret'], time()); }
    catch (PDOException $error) { throw new RuntimeException('database_write_failed', 0, $error); }
}

function delir_connect_pilot(array $config): PDO
{
    if (!preg_match('/^[a-z0-9.-]+$/i', $config['db_host'] ?? '') || !preg_match('/^[a-z0-9_]+$/i', $config['db_name'] ?? '')) throw new RuntimeException('database_configuration_invalid');
    $port = filter_var($config['db_port'] ?? 3306, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1, 'max_range' => 65535]]);
    if ($port === false || empty($config['db_user']) || empty($config['db_password'])) throw new RuntimeException('database_configuration_invalid');
    return new PDO(
        'mysql:host=' . $config['db_host'] . ';port=' . $port . ';dbname=' . $config['db_name'] . ';charset=utf8mb4',
        $config['db_user'], $config['db_password'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_TIMEOUT => 5]
    );
}

function delir_store_pilot(PDO $pdo, array $data, string $ip, string $secret, int $now): array
{
    // Expired identifiers are removed on traffic; also schedule cleanup when idle.
    $cleanup = $pdo->prepare('DELETE FROM pilot_rate_limits WHERE expires_at <= ? LIMIT 1000');
    $cleanup->execute([$now]);
    $expires = (intdiv($now, 900) + 1) * 900;
    // Global row first means concurrent submissions lock in the same order.
    $buckets = [hash_hmac('sha256', 'global', $secret) => 100, hash_hmac('sha256', 'ip:' . $ip, $secret) => 5];
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
        $insert = $pdo->prepare('INSERT INTO pilot_applications (name, email, practice, timing, project_brief, source) VALUES (?, ?, ?, ?, ?, ?)');
        $insert->execute([$data['name'], $data['email'], $data['practice'], $data['timing'], $data['projectBrief'], $data['source']]);
        $pdo->commit();
        return ['status' => 201, 'body' => ['accepted' => true]];
    } catch (Throwable $error) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        throw $error;
    }
}
