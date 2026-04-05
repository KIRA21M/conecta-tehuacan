-- ============================================================
--  Conecta Tehuacán — Schema inicial
--  Se ejecuta automáticamente en el primer arranque de MySQL
-- ============================================================

SET NAMES utf8mb4;
SET time_zone = 'America/Mexico_City';

-- ─── Usuarios ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id                  INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  full_name           VARCHAR(180)    NOT NULL,
  email               VARCHAR(255)    NOT NULL,
  password_hash       VARCHAR(255)    NOT NULL,
  role                ENUM('aspirante','reclutador','admin') NOT NULL DEFAULT 'aspirante',
  is_active           TINYINT(1)      NOT NULL DEFAULT 1,
  is_verified         TINYINT(1)      NOT NULL DEFAULT 0,
  verification_token  VARCHAR(64)     NULL,
  last_login_at       DATETIME        NULL,
  created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_email (email),
  INDEX idx_role (role),
  INDEX idx_verification_token (verification_token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── Perfiles aspirantes ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS candidate_profiles (
  id          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  user_id     INT UNSIGNED  NOT NULL,
  headline    VARCHAR(255)  NULL,
  about       TEXT          NULL,
  location    VARCHAR(255)  NULL,
  phone       VARCHAR(30)   NULL,
  avatar_url  VARCHAR(500)  NULL,
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_user_id (user_id),
  CONSTRAINT fk_cp_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── Perfiles reclutadores ───────────────────────────────────
CREATE TABLE IF NOT EXISTS recruiter_profiles (
  id               INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  user_id          INT UNSIGNED  NOT NULL,
  company_name     VARCHAR(255)  NULL,
  company_website  VARCHAR(500)  NULL,
  phone            VARCHAR(30)   NULL,
  location         VARCHAR(255)  NULL,
  about_company    TEXT          NULL,
  created_at       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_user_id (user_id),
  CONSTRAINT fk_rp_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── Categorías de vacantes ──────────────────────────────────
CREATE TABLE IF NOT EXISTS job_categories (
  id         INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  name       VARCHAR(100)  NOT NULL,
  created_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO job_categories (name) VALUES
  ('Tecnología'),('Administración'),('Ventas'),('Manufactura'),
  ('Salud'),('Educación'),('Logística'),('Atención al cliente'),
  ('Recursos Humanos'),('Otro');

-- ─── Vacantes (job_posts) ────────────────────────────────────
CREATE TABLE IF NOT EXISTS job_posts (
  id                INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  recruiter_user_id INT UNSIGNED    NOT NULL,
  category_id       INT UNSIGNED    NULL,
  title             VARCHAR(180)    NOT NULL,
  company_name      VARCHAR(200)    NOT NULL,
  location          VARCHAR(160)    NOT NULL,
  work_mode         ENUM('presencial','hibrido','remoto') NOT NULL DEFAULT 'presencial',
  employment_type   ENUM('tiempo_completo','medio_tiempo','temporal','practicas','freelance') NOT NULL DEFAULT 'tiempo_completo',
  salary_min        DECIMAL(10,2)   NULL,
  salary_max        DECIMAL(10,2)   NULL,
  currency          VARCHAR(10)     NOT NULL DEFAULT 'MXN',
  description       TEXT            NOT NULL,
  requirements      TEXT            NULL,
  is_active         TINYINT(1)      NOT NULL DEFAULT 1,
  published_at      DATETIME        NULL,
  created_at        DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_recruiter (recruiter_user_id),
  INDEX idx_category (category_id),
  INDEX idx_active_published (is_active, published_at),
  FULLTEXT idx_search (title, company_name, location, description, requirements),
  CONSTRAINT fk_jp_recruiter FOREIGN KEY (recruiter_user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_jp_category  FOREIGN KEY (category_id)       REFERENCES job_categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── Refresh tokens ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  user_id     INT UNSIGNED  NOT NULL,
  token_hash  VARCHAR(64)   NOT NULL,
  expires_at  DATETIME      NOT NULL,
  revoked     TINYINT(1)    NOT NULL DEFAULT 0,
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_token_hash (token_hash),
  INDEX idx_user_id (user_id),
  CONSTRAINT fk_rt_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── Password reset tokens ───────────────────────────────────
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  user_id     INT UNSIGNED  NOT NULL,
  token_hash  VARCHAR(64)   NOT NULL,
  expires_at  DATETIME      NOT NULL,
  used        TINYINT(1)    NOT NULL DEFAULT 0,
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_token_hash (token_hash),
  INDEX idx_user_id (user_id),
  CONSTRAINT fk_prt_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── Admin de prueba (contraseña: Admin1234!) ────────────────
INSERT IGNORE INTO users (full_name, email, password_hash, role, is_active, is_verified)
VALUES (
  'Administrador',
  'admin@conectatehuacan.mx',
  '$2b$12$GEtBqFXj1qTUmOboZrQJC.46cygpnUGDpDK73qLJjgye0uPOZzpsm',
  'admin',
  1,
  1
);
