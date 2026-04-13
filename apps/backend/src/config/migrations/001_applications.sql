-- Migration 001: Create applications and favorites tables for job candidatures
-- Created at: 2026-04-11

-- Drop existing tables if rolling back
-- DROP TABLE IF EXISTS applications;
-- DROP TABLE IF EXISTS favorites;

-- ============================================================================
-- Table: applications
-- Purpose: Store job applications/candidatures from candidates
-- ============================================================================
CREATE TABLE IF NOT EXISTS applications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  job_id INT NOT NULL,
  candidate_id INT NOT NULL,
  status ENUM('pending', 'accepted', 'rejected', 'withdrawn') DEFAULT 'pending' NOT NULL,
  cover_letter MEDIUMTEXT,
  reviewed_by INT,
  reviewed_at TIMESTAMP NULL,
  rejection_reason VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  is_active TINYINT(1) DEFAULT 1 NOT NULL,
  
  -- Foreign Key: job_id references jobs table
  CONSTRAINT fk_applications_job_id 
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE ON UPDATE CASCADE,
  
  -- Foreign Key: candidate_id references users table (aspirante role)
  CONSTRAINT fk_applications_candidate_id 
    FOREIGN KEY (candidate_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  
  -- Foreign Key: reviewed_by references users table (reclutador/admin)
  CONSTRAINT fk_applications_reviewed_by 
    FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
  
  -- Indices for fast queries
  UNIQUE KEY uk_applications_unique 
    (job_id, candidate_id),
  INDEX idx_applications_candidate_id 
    (candidate_id),
  INDEX idx_applications_status 
    (status),
  INDEX idx_applications_created_at 
    (created_at DESC),
  INDEX idx_applications_job_status 
    (job_id, status),
  
  -- Composite index for dashboard queries
  INDEX idx_applications_job_created 
    (job_id, created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table: favorites
-- Purpose: Store favorite/bookmarked jobs for candidates
-- ============================================================================
CREATE TABLE IF NOT EXISTS favorites (
  id INT PRIMARY KEY AUTO_INCREMENT,
  job_id INT NOT NULL,
  candidate_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  
  -- Foreign Key: job_id references jobs table
  CONSTRAINT fk_favorites_job_id 
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE ON UPDATE CASCADE,
  
  -- Foreign Key: candidate_id references users table (aspirante role)
  CONSTRAINT fk_favorites_candidate_id 
    FOREIGN KEY (candidate_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  
  -- Indices
  UNIQUE KEY uk_favorites_unique 
    (job_id, candidate_id),
  INDEX idx_favorites_candidate_id 
    (candidate_id),
  INDEX idx_favorites_created_at 
    (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Audit Log Table: application_notes
-- Purpose: Store internal notes on applications (audit trail)
-- ============================================================================
CREATE TABLE IF NOT EXISTS application_notes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  application_id INT NOT NULL,
  created_by INT NOT NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  
  -- Foreign Key: application_id references applications table
  CONSTRAINT fk_application_notes_application_id 
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE ON UPDATE CASCADE,
  
  -- Foreign Key: created_by references users table (reclutador/admin)
  CONSTRAINT fk_application_notes_created_by 
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  
  -- Indices
  INDEX idx_application_notes_application_id 
    (application_id),
  INDEX idx_application_notes_created_at 
    (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Triggers
-- ============================================================================

-- Trigger: Update application updated_at on status change
DELIMITER $$
DROP TRIGGER IF EXISTS trg_applications_update_timestamp$$
CREATE TRIGGER trg_applications_update_timestamp
BEFORE UPDATE ON applications
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END$$
DELIMITER ;

-- Trigger: Update favorites updated_at
DELIMITER $$
DROP TRIGGER IF EXISTS trg_favorites_update_timestamp$$
CREATE TRIGGER trg_favorites_update_timestamp
BEFORE UPDATE ON favorites
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END$$
DELIMITER ;
