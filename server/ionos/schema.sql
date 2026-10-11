-- Import once through IONOS phpMyAdmin. Do not put this file in /public.
CREATE TABLE IF NOT EXISTS pilot_applications (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(254) NOT NULL,
    practice ENUM('independent', 'boutique', 'consulting-firm', 'in-house-operations') NOT NULL,
    timing ENUM('active', 'next-90-days') NOT NULL,
    project_brief VARCHAR(600) NOT NULL,
    source VARCHAR(40) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX pilot_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Short-lived HMAC identifiers for abuse protection; no raw IP addresses.
CREATE TABLE IF NOT EXISTS pilot_rate_limits (
    rate_key CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
    hits INT UNSIGNED NOT NULL DEFAULT 0,
    expires_at BIGINT UNSIGNED NOT NULL,
    INDEX rate_expiry (expires_at)
) ENGINE=InnoDB;
