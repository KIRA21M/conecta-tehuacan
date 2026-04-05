CREATE TABLE IF NOT EXISTS user_sessions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  session_id VARCHAR(64) NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  token_hash CHAR(64) NOT NULL,
  user_agent VARCHAR(255) NULL,
  ip_address VARCHAR(45) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_activity_at DATETIME NULL,
  expires_at DATETIME NOT NULL,
  revoked_at DATETIME NULL,
  revoked_reason VARCHAR(50) NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_session_id (session_id),
  KEY idx_user_active (user_id, revoked_at, expires_at),
  KEY idx_session_lookup (user_id, session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
