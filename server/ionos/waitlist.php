<?php
declare(strict_types=1);
require_once __DIR__ . '/pilot.php';

function delir_validate_interest(string $raw): ?array
{
    try { $data = json_decode($raw, true, 8, JSON_THROW_ON_ERROR); }
    catch (JsonException $error) { return null; }
    $keys = ['email', 'practice', 'timing', 'source', 'noticeVersion'];
    if (!is_array($data) || count($data) !== count($keys) || array_diff($keys, array_keys($data))) return null;
    foreach ($keys as $key) {
        if (!is_string($data[$key])) return null;
        $data[$key] = trim($data[$key]);
        if (preg_match('/[\x00-\x1F\x7F]/', $data[$key]) !== 0) return null;
    }
    if (strlen($data['email']) > 254 || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) return null;
    if (!in_array($data['practice'], ['independent', 'consulting-team', 'in-house', 'other'], true)) return null;
    if (!in_array($data['timing'], ['', 'active', 'next-90-days', 'exploring'], true)) return null;
    if ($data['source'] !== 'delir-product-interest' || $data['noticeVersion'] !== 'product-interest-2026-10-12') return null;
    $data['email'] = strtolower($data['email']);
    return $data;
}

function delir_handle_interest(array $server, array $config, callable $readBody, ?callable $connect = null): array
{
    // Independent of pilot intake: installing the endpoint must not enable it.
    if (($config['waitlist_enabled'] ?? false) !== true) return delir_result(503, 'temporarily_unavailable');
    if (($server['REQUEST_METHOD'] ?? '') !== 'POST') return delir_result(405, 'method_not_allowed');
    if (!in_array(strtolower((string) ($server['HTTPS'] ?? '')), ['on', '1'], true)) return delir_result(403, 'https_required');
    if (!in_array($server['HTTP_ORIGIN'] ?? '', $config['origins'] ?? [], true)) return delir_result(403, 'origin_not_allowed');
    if (isset($server['HTTP_SEC_FETCH_SITE']) && $server['HTTP_SEC_FETCH_SITE'] !== 'same-origin') return delir_result(403, 'origin_not_allowed');
    if (strtolower(trim(explode(';', $server['CONTENT_TYPE'] ?? '')[0])) !== 'application/json') return delir_result(415, 'json_required');
    if (isset($server['CONTENT_LENGTH']) && (!ctype_digit((string) $server['CONTENT_LENGTH']) || (int) $server['CONTENT_LENGTH'] > 4096)) return delir_result(413, 'body_too_large');
    $raw = $readBody();
    if (strlen($raw) > 4096) return delir_result(413, 'body_too_large');
    $data = delir_validate_interest($raw);
    if ($data === null) return delir_result(422, 'invalid_request');
    if (!is_string($config['rate_secret'] ?? null) || !preg_match('/^[a-f0-9]{64}$/', $config['rate_secret'])) throw new RuntimeException('rate_secret_invalid');
    $ip = $server['REMOTE_ADDR'] ?? '';
    if (!filter_var($ip, FILTER_VALIDATE_IP)) return delir_result(403, 'client_unavailable');
    try { $pdo = $connect ? $connect() : delir_connect_pilot($config); }
    catch (PDOException $error) { throw new RuntimeException('database_connection_failed', 0, $error); }
    try { return delir_store_interest($pdo, $data, $ip, $config['rate_secret'], time()); }
    catch (PDOException $error) { throw new RuntimeException('database_write_failed', 0, $error); }
}

function delir_store_interest(PDO $pdo, array $data, string $ip, string $secret, int $now): array
{
    $cleanup = $pdo->prepare('DELETE FROM pilot_rate_limits WHERE expires_at <= ? LIMIT 1000');
    $cleanup->execute([$now]);
    $expires = (intdiv($now, 900) + 1) * 900;
    $buckets = [
        hash_hmac('sha256', 'interest:global', $secret) => 100,
        hash_hmac('sha256', 'interest:ip:' . $ip, $secret) => 5,
    ];
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
        // Repeat requests do not create extra people or overwrite their intent.
        // The public response is identical: do not expose membership by email.
        $insert = $pdo->prepare('INSERT INTO product_interest (email, practice, timing, source, notice_version, created_at) VALUES (?, ?, ?, ?, ?, UTC_TIMESTAMP()) ON DUPLICATE KEY UPDATE email = email');
        $insert->execute([$data['email'], $data['practice'], $data['timing'], $data['source'], $data['noticeVersion']]);
        $pdo->commit();
        return ['status' => 201, 'body' => ['accepted' => true]];
    } catch (Throwable $error) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        throw $error;
    }
}
