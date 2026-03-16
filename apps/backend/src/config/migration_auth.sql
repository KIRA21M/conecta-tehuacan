-- Migración: sistema de verificación de cuenta y refresh tokens
-- Ejecutar una sola vez sobre la base de datos existente

-- 1. Columnas en users
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS is_verified       TINYINT(1)   NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS verification_token VARCHAR(64)  NULL,
  ADD COLUMN IF NOT EXISTS last_login_at      DATETIME     NULL;

-- 2. Tabla de refresh tokens (rotación segura)
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id         INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  user_id    INT UNSIGNED    NOT NULL,
  token_hash VARCHAR(64)     NOT NULL,
  expires_at DATETIME        NOT NULL,
  revoked    TINYINT(1)      NOT NULL DEFAULT 0,
  created_at DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_token_hash (token_hash),
  INDEX idx_user_id (user_id),
  CONSTRAINT fk_rt_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
