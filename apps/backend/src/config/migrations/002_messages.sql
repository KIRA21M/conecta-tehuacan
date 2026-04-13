-- Migration 002: Create messages and message_attachments tables for messaging system
-- Created at: 2026-04-11

-- ============================================================================
-- Table: messages
-- Purpose: Store messages between candidates and recruiters (bidirectional)
-- ============================================================================
CREATE TABLE IF NOT EXISTS messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sender_id INT NOT NULL,
  recipient_id INT NOT NULL,
  content TEXT NOT NULL,
  is_read TINYINT(1) DEFAULT 0 NOT NULL,
  read_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  is_deleted TINYINT(1) DEFAULT 0 NOT NULL,
  
  -- Foreign Key: sender_id references users table
  CONSTRAINT fk_messages_sender_id 
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  
  -- Foreign Key: recipient_id references users table
  CONSTRAINT fk_messages_recipient_id 
    FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  
  -- Indices for fast queries
  INDEX idx_messages_recipient_id 
    (recipient_id),
  INDEX idx_messages_sender_id 
    (sender_id),
  INDEX idx_messages_is_read 
    (is_read),
  INDEX idx_messages_created_at 
    (created_at DESC),
  
  -- Composite indices for thread queries
  INDEX idx_messages_thread 
    (sender_id, recipient_id, created_at DESC),
  INDEX idx_messages_thread_reverse 
    (recipient_id, sender_id, created_at DESC),
  
  -- Composite index for unread count queries
  INDEX idx_messages_recipient_unread 
    (recipient_id, is_read, created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table: message_attachments (Future expansion)
-- Purpose: Store file attachments for messages (resume, portfolio, etc.)
-- ============================================================================
CREATE TABLE IF NOT EXISTS message_attachments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  message_id INT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  file_size INT NOT NULL,
  uploaded_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  
  -- Foreign Key: message_id references messages table
  CONSTRAINT fk_message_attachments_message_id 
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE ON UPDATE CASCADE,
  
  -- Foreign Key: uploaded_by references users table
  CONSTRAINT fk_message_attachments_uploaded_by 
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  
  -- Indices
  INDEX idx_message_attachments_message_id 
    (message_id),
  INDEX idx_message_attachments_created_at 
    (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Table: message_threads (Denormalized view helper for performance)
-- Purpose: Cache last message per thread for fast inbox queries
-- Updated via triggers or application logic
-- ============================================================================
CREATE TABLE IF NOT EXISTS message_threads (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  other_user_id INT NOT NULL,
  last_message_id INT,
  last_message_content MEDIUMTEXT,
  last_message_at TIMESTAMP NULL,
  unread_count INT DEFAULT 0 NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
  
  -- Foreign Key: user_id references users table
  CONSTRAINT fk_message_threads_user_id 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  
  -- Foreign Key: other_user_id references users table
  CONSTRAINT fk_message_threads_other_user_id 
    FOREIGN KEY (other_user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  
  -- Foreign Key: last_message_id references messages table
  CONSTRAINT fk_message_threads_last_message_id 
    FOREIGN KEY (last_message_id) REFERENCES messages(id) ON DELETE SET NULL ON UPDATE CASCADE,
  
  -- Indices
  UNIQUE KEY uk_message_threads_unique 
    (user_id, other_user_id),
  INDEX idx_message_threads_user_id 
    (user_id),
  INDEX idx_message_threads_updated_at 
    (updated_at DESC),
  INDEX idx_message_threads_unread 
    (user_id, unread_count DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Triggers
-- ============================================================================

-- Trigger: Update message updated_at
DELIMITER $$
DROP TRIGGER IF EXISTS trg_messages_update_timestamp$$
CREATE TRIGGER trg_messages_update_timestamp
BEFORE UPDATE ON messages
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END$$
DELIMITER ;

-- Trigger: Mark read_at when message is read
DELIMITER $$
DROP TRIGGER IF EXISTS trg_messages_read_timestamp$$
CREATE TRIGGER trg_messages_read_timestamp
BEFORE UPDATE ON messages
FOR EACH ROW
BEGIN
    IF NEW.is_read = 1 AND OLD.is_read = 0 AND NEW.read_at IS NULL THEN
        SET NEW.read_at = CURRENT_TIMESTAMP;
    END IF;
END$$
DELIMITER ;

-- Trigger: Update message_attachments timestamp
DELIMITER $$
DROP TRIGGER IF EXISTS trg_message_attachments_timestamp$$
CREATE TRIGGER trg_message_attachments_timestamp
BEFORE UPDATE ON message_attachments
FOR EACH ROW
BEGIN
    -- Prevent updates on immutable fields
    IF OLD.id = NEW.id THEN
        SET NEW.created_at = OLD.created_at;
    END IF;
END$$
DELIMITER ;
