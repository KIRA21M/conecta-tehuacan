-- Migration 003: Create company_profiles table for recruiter/company information
-- Created at: 2026-04-11

-- ============================================================================
-- Table: company_profiles
-- Purpose: Store company/recruiter profile information
-- One-to-One relationship with users table (user.id = user who is reclutador/admin)
-- ============================================================================
CREATE TABLE IF NOT EXISTS company_profiles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  company_name VARCHAR(150) NOT NULL,
  description MEDIUMTEXT,
  website VARCHAR(500),
  phone VARCHAR(20),
  logo_url VARCHAR(500),
  banner_url VARCHAR(500),
  industry VARCHAR(100),
  company_size VARCHAR(50),
  founded_year YEAR,
  headquarters_location VARCHAR(200),
  verified TINYINT(1) DEFAULT 0 NOT NULL,
  verified_at TIMESTAMP NULL,
  verification_document_url VARCHAR(500),
  total_jobs_posted INT DEFAULT 0 NOT NULL,
  total_applications INT DEFAULT 0 NOT NULL,
  response_rate DECIMAL(5, 2),
  average_response_time INT,
  rating DECIMAL(3, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  is_active TINYINT(1) DEFAULT 1 NOT NULL,
  
  -- Foreign Key: user_id references users table
  -- Ensures user has reclutador or admin role
  CONSTRAINT fk_company_profiles_user_id 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  
  -- Indices
  UNIQUE KEY uk_company_profiles_user_id 
    (user_id),
  INDEX idx_company_profiles_verified 
    (verified),
  INDEX idx_company_profiles_active 
    (is_active),
  INDEX idx_company_profiles_created_at 
    (created_at DESC),
  INDEX idx_company_profiles_rating 
    (rating DESC),
  
  -- Search indices
  FULLTEXT KEY ft_company_profiles_name 
    (company_name),
  FULLTEXT KEY ft_company_profiles_description 
    (description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table: company_contacts (Multiple contacts per company)
-- Purpose: Store multiple contact persons for a company
-- ============================================================================
CREATE TABLE IF NOT EXISTS company_contacts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  company_profile_id INT NOT NULL,
  contact_name VARCHAR(100) NOT NULL,
  contact_email VARCHAR(100) NOT NULL,
  contact_phone VARCHAR(20),
  position VARCHAR(100),
  is_primary TINYINT(1) DEFAULT 0 NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  
  -- Foreign Key: company_profile_id references company_profiles table
  CONSTRAINT fk_company_contacts_company_profile_id 
    FOREIGN KEY (company_profile_id) REFERENCES company_profiles(id) ON DELETE CASCADE ON UPDATE CASCADE,
  
  -- Indices
  INDEX idx_company_contacts_company_profile_id 
    (company_profile_id),
  INDEX idx_company_contacts_is_primary 
    (is_primary),
  INDEX idx_company_contacts_email 
    (contact_email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table: company_stats (Materialized view for analytics)
-- Purpose: Store denormalized statistics for fast dashboard queries
-- Updated via application logic after job/application operations
-- ============================================================================
CREATE TABLE IF NOT EXISTS company_stats (
  id INT PRIMARY KEY AUTO_INCREMENT,
  company_profile_id INT NOT NULL,
  active_jobs INT DEFAULT 0 NOT NULL,
  total_views INT DEFAULT 0 NOT NULL,
  total_applications INT DEFAULT 0 NOT NULL,
  accepted_applications INT DEFAULT 0 NOT NULL,
  rejected_applications INT DEFAULT 0 NOT NULL,
  pending_applications INT DEFAULT 0 NOT NULL,
  avg_time_to_hire INT,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  
  -- Foreign Key: company_profile_id references company_profiles table
  CONSTRAINT fk_company_stats_company_profile_id 
    FOREIGN KEY (company_profile_id) REFERENCES company_profiles(id) ON DELETE CASCADE ON UPDATE CASCADE,
  
  -- Indices
  UNIQUE KEY uk_company_stats_company_profile_id 
    (company_profile_id),
  INDEX idx_company_stats_last_updated 
    (last_updated DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table: company_social_links (Social media and external links)
-- Purpose: Store social media profiles and external links
-- ============================================================================
CREATE TABLE IF NOT EXISTS company_social_links (
  id INT PRIMARY KEY AUTO_INCREMENT,
  company_profile_id INT NOT NULL,
  platform VARCHAR(50) NOT NULL,
  url VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  
  -- Foreign Key: company_profile_id references company_profiles table
  CONSTRAINT fk_company_social_links_company_profile_id 
    FOREIGN KEY (company_profile_id) REFERENCES company_profiles(id) ON DELETE CASCADE ON UPDATE CASCADE,
  
  -- Indices
  INDEX idx_company_social_links_company_profile_id 
    (company_profile_id),
  UNIQUE KEY uk_company_social_links_unique 
    (company_profile_id, platform)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Triggers
-- ============================================================================

-- Trigger: Update company_profiles updated_at
DELIMITER $$
DROP TRIGGER IF EXISTS trg_company_profiles_update_timestamp$$
CREATE TRIGGER trg_company_profiles_update_timestamp
BEFORE UPDATE ON company_profiles
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END$$
DELIMITER ;

-- Trigger: Update company_contacts updated_at
DELIMITER $$
DROP TRIGGER IF EXISTS trg_company_contacts_update_timestamp$$
CREATE TRIGGER trg_company_contacts_update_timestamp
BEFORE UPDATE ON company_contacts
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END$$
DELIMITER ;

-- Trigger: Update company_social_links updated_at
DELIMITER $$
DROP TRIGGER IF EXISTS trg_company_social_links_update_timestamp$$
CREATE TRIGGER trg_company_social_links_update_timestamp
BEFORE UPDATE ON company_social_links
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END$$
DELIMITER ;

-- Trigger: Create default company stats on profile creation
DELIMITER $$
DROP TRIGGER IF EXISTS trg_company_profiles_create_stats$$
CREATE TRIGGER trg_company_profiles_create_stats
AFTER INSERT ON company_profiles
FOR EACH ROW
BEGIN
    INSERT INTO company_stats (company_profile_id) VALUES (NEW.id);
END$$
DELIMITER ;

-- Trigger: Delete company stats on profile deletion
DELIMITER $$
DROP TRIGGER IF EXISTS trg_company_profiles_delete_stats$$
CREATE TRIGGER trg_company_profiles_delete_stats
BEFORE DELETE ON company_profiles
FOR EACH ROW
BEGIN
    DELETE FROM company_stats WHERE company_profile_id = OLD.id;
END$$
DELIMITER ;
