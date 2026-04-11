/**
 * Messages Service
 * =================
 * Business logic for messaging system between candidates and recruiters
 */

const db = require('../config/db');
const { AppError } = require('../utils/errors');

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Safe database query wrapper with error handling
 */
async function safeQuery(sql, params = []) {
  try {
    return await db.query(sql, params);
  } catch (err) {
    console.error('[MESSAGES SERVICE] SQL ERROR:', err);
    throw new AppError('Database error', 500);
  }
}

/**
 * Build WHERE clause for message filtering
 */
function buildMessageFilters(filters) {
  const { recipient_id, sender_id, is_read, page = 1, limit = 20 } = filters;

  const where = ["m.is_deleted = 0"];
  const params = [];

  if (recipient_id) {
    where.push("m.recipient_id = ?");
    params.push(Number(recipient_id));
  }

  if (sender_id) {
    where.push("m.sender_id = ?");
    params.push(Number(sender_id));
  }

  if (is_read !== undefined) {
    where.push("m.is_read = ?");
    params.push(is_read ? 1 : 0);
  }

  return {
    whereSql: where.length ? `WHERE ${where.join(" AND ")}` : "",
    params,
    page: Number(page),
    limit: Number(limit),
  };
}

// ============================================================================
// SEND MESSAGE
// ============================================================================

/**
 * Send a message from sender to recipient
 */
exports.sendMessage = async (senderId, recipientId, content) => {
  if (!senderId || !recipientId || !content) {
    throw new AppError('senderId, recipientId, and content are required', 400);
  }

  if (senderId === recipientId) {
    throw new AppError('Cannot send message to yourself', 400);
  }

  try {
    // Verify both users exist and are active
    const [senderRows] = await safeQuery(
      'SELECT id FROM users WHERE id = ? AND is_active = 1 LIMIT 1',
      [senderId]
    );

    if (!senderRows.length) {
      throw new AppError('Sender not found or inactive', 404);
    }

    const [recipientRows] = await safeQuery(
      'SELECT id FROM users WHERE id = ? AND is_active = 1 LIMIT 1',
      [recipientId]
    );

    if (!recipientRows.length) {
      throw new AppError('Recipient not found or inactive', 404);
    }

    // Insert message
    const [result] = await safeQuery(
      `INSERT INTO messages (sender_id, recipient_id, content, is_read, created_at, updated_at, is_deleted)
       VALUES (?, ?, ?, 0, NOW(), NOW(), 0)`,
      [senderId, recipientId, content]
    );

    console.log('[AUDIT] Message sent:', { messageId: result.insertId, senderId, recipientId });

    // Update message thread
    await updateMessageThread(senderId, recipientId, result.insertId, content);

    return { id: result.insertId };
  } catch (err) {
    if (err instanceof AppError) throw err;
    console.error('[MESSAGES SERVICE] sendMessage ERROR:', err);
    throw new AppError('Failed to send message', 500);
  }
};

// ============================================================================
// GET MESSAGES
// ============================================================================

/**
 * Get messages with filtering and pagination
 */
exports.getMessages = async (filters) => {
  try {
    const { whereSql, params, page, limit } = buildMessageFilters(filters);
    const offset = (page - 1) * limit;

    const [rows] = await safeQuery(
      `SELECT m.*, 
              sender.full_name as sender_name, sender.email as sender_email,
              recipient.full_name as recipient_name, recipient.email as recipient_email,
              COUNT(*) OVER() as total
       FROM messages m
       LEFT JOIN users sender ON sender.id = m.sender_id
       LEFT JOIN users recipient ON recipient.id = m.recipient_id
       ${whereSql}
       ORDER BY m.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    const total = rows.length ? rows[0].total : 0;

    return {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      items: rows,
    };
  } catch (err) {
    if (err instanceof AppError) throw err;
    console.error('[MESSAGES SERVICE] getMessages ERROR:', err);
    throw new AppError('Failed to fetch messages', 500);
  }
};

// ============================================================================
// GET MESSAGE THREAD (conversation between two users)
// ============================================================================

/**
 * Get conversation thread between two users
 */
exports.getThread = async (userId1, userId2, filters = {}) => {
  try {
    const { page = 1, limit = 50 } = filters;
    const offset = (page - 1) * limit;

    // Get all messages between these two users (bidirectional)
    const [rows] = await safeQuery(
      `SELECT m.*,
              sender.full_name as sender_name, sender.email as sender_email,
              recipient.full_name as recipient_name, recipient.email as recipient_email,
              COUNT(*) OVER() as total
       FROM messages m
       LEFT JOIN users sender ON sender.id = m.sender_id
       LEFT JOIN users recipient ON recipient.id = m.recipient_id
       WHERE m.is_deleted = 0 AND 
             ((m.sender_id = ? AND m.recipient_id = ?) OR (m.sender_id = ? AND m.recipient_id = ?))
       ORDER BY m.created_at ASC
       LIMIT ? OFFSET ?`,
      [userId1, userId2, userId2, userId1, limit, offset]
    );

    const total = rows.length ? rows[0].total : 0;

    return {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      messages: rows,
    };
  } catch (err) {
    if (err instanceof AppError) throw err;
    console.error('[MESSAGES SERVICE] getThread ERROR:', err);
    throw new AppError('Failed to fetch conversation', 500);
  }
};

// ============================================================================
// GET INBOX (user's message threads/conversations)
// ============================================================================

/**
 * Get user's inbox with last message from each conversation
 */
exports.getInbox = async (userId, filters = {}) => {
  try {
    const { page = 1, limit = 20, unread_only = false } = filters;
    const offset = (page - 1) * limit;

    let unreadFilter = '';
    if (unread_only) {
      unreadFilter = 'AND mt.unread_count > 0';
    }

    const [rows] = await safeQuery(
      `SELECT mt.*, 
              other_user.full_name as other_user_name, other_user.email as other_user_email,
              other_user.role as other_user_role,
              COUNT(*) OVER() as total
       FROM message_threads mt
       LEFT JOIN users other_user ON other_user.id = mt.other_user_id
       WHERE mt.user_id = ? ${unreadFilter}
       ORDER BY mt.updated_at DESC
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );

    const total = rows.length ? rows[0].total : 0;

    return {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      threads: rows.map(row => ({
        other_user_id: row.other_user_id,
        other_user_name: row.other_user_name,
        other_user_email: row.other_user_email,
        other_user_role: row.other_user_role,
        last_message: row.last_message_content,
        last_message_at: row.last_message_at,
        unread_count: row.unread_count,
      })),
    };
  } catch (err) {
    if (err instanceof AppError) throw err;
    console.error('[MESSAGES SERVICE] getInbox ERROR:', err);
    throw new AppError('Failed to fetch inbox', 500);
  }
};

// ============================================================================
// MARK MESSAGE AS READ
// ============================================================================

/**
 * Mark a single message as read
 */
exports.markMessageRead = async (messageId, userId) => {
  try {
    // Verify user is recipient
    const [rows] = await safeQuery(
      'SELECT id FROM messages WHERE id = ? AND recipient_id = ? LIMIT 1',
      [messageId, userId]
    );

    if (!rows.length) {
      throw new AppError('Message not found or unauthorized', 404);
    }

    await safeQuery(
      'UPDATE messages SET is_read = 1, read_at = NOW(), updated_at = NOW() WHERE id = ?',
      [messageId]
    );

    // Update thread unread count
    const [msg] = await safeQuery(
      'SELECT sender_id FROM messages WHERE id = ? LIMIT 1',
      [messageId]
    );

    if (msg.length) {
      await updateThreadUnreadCount(userId, msg[0].sender_id);
    }

    return { marked_read: true };
  } catch (err) {
    if (err instanceof AppError) throw err;
    console.error('[MESSAGES SERVICE] markMessageRead ERROR:', err);
    throw new AppError('Failed to mark message as read', 500);
  }
};

/**
 * Mark all messages from a thread as read
 */
exports.markThreadRead = async (userId, otherUserId) => {
  try {
    // Mark all unread messages as read where user is recipient
    await safeQuery(
      `UPDATE messages SET is_read = 1, read_at = NOW(), updated_at = NOW()
       WHERE recipient_id = ? AND sender_id = ? AND is_read = 0 AND is_deleted = 0`,
      [userId, otherUserId]
    );

    // Reset unread count for thread
    await updateThreadUnreadCount(userId, otherUserId);

    return { marked_all_read: true };
  } catch (err) {
    if (err instanceof AppError) throw err;
    console.error('[MESSAGES SERVICE] markThreadRead ERROR:', err);
    throw new AppError('Failed to mark thread as read', 500);
  }
};

// ============================================================================
// DELETE MESSAGE
// ============================================================================

/**
 * Soft delete a message (only sender can delete)
 */
exports.deleteMessage = async (messageId, userId) => {
  try {
    // Verify user is sender
    const [rows] = await safeQuery(
      'SELECT id FROM messages WHERE id = ? AND sender_id = ? LIMIT 1',
      [messageId, userId]
    );

    if (!rows.length) {
      throw new AppError('Message not found or unauthorized', 404);
    }

    await safeQuery(
      'UPDATE messages SET is_deleted = 1, updated_at = NOW() WHERE id = ?',
      [messageId]
    );

    console.log('[AUDIT] Message deleted:', { messageId, userId });

    return { deleted: true };
  } catch (err) {
    if (err instanceof AppError) throw err;
    console.error('[MESSAGES SERVICE] deleteMessage ERROR:', err);
    throw new AppError('Failed to delete message', 500);
  }
};

/**
 * Delete entire thread (soft delete all messages)
 */
exports.deleteThread = async (userId, otherUserId) => {
  try {
    await safeQuery(
      `UPDATE messages SET is_deleted = 1, updated_at = NOW()
       WHERE is_deleted = 0 AND 
             ((sender_id = ? AND recipient_id = ?) OR (sender_id = ? AND recipient_id = ?))`,
      [userId, otherUserId, otherUserId, userId]
    );

    // Clear thread
    await safeQuery(
      'DELETE FROM message_threads WHERE user_id = ? AND other_user_id = ?',
      [userId, otherUserId]
    );

    console.log('[AUDIT] Thread deleted:', { userId, otherUserId });

    return { deleted: true };
  } catch (err) {
    if (err instanceof AppError) throw err;
    console.error('[MESSAGES SERVICE] deleteThread ERROR:', err);
    throw new AppError('Failed to delete thread', 500);
  }
};

// ============================================================================
// INTERNAL HELPERS
// ============================================================================

/**
 * Update message thread after new message
 * Maintains denormalized view for fast inbox queries
 */
async function updateMessageThread(senderId, recipientId, messageId, content) {
  try {
    // Update/create thread for sender
    await safeQuery(
      `INSERT INTO message_threads (user_id, other_user_id, last_message_id, last_message_content, last_message_at, unread_count, updated_at)
       VALUES (?, ?, ?, ?, NOW(), 0, NOW())
       ON DUPLICATE KEY UPDATE
       last_message_id = ?, last_message_content = ?, last_message_at = NOW(), updated_at = NOW()`,
      [senderId, recipientId, messageId, content, messageId, content]
    );

    // Update thread for recipient (increment unread count)
    const [existing] = await safeQuery(
      'SELECT unread_count FROM message_threads WHERE user_id = ? AND other_user_id = ? LIMIT 1',
      [recipientId, senderId]
    );

    const newUnreadCount = existing.length ? existing[0].unread_count + 1 : 1;

    await safeQuery(
      `INSERT INTO message_threads (user_id, other_user_id, last_message_id, last_message_content, last_message_at, unread_count, updated_at)
       VALUES (?, ?, ?, ?, NOW(), ?, NOW())
       ON DUPLICATE KEY UPDATE
       last_message_id = ?, last_message_content = ?, last_message_at = NOW(), unread_count = ?, updated_at = NOW()`,
      [recipientId, senderId, messageId, content, newUnreadCount, messageId, content, newUnreadCount]
    );
  } catch (err) {
    console.error('[MESSAGES SERVICE] updateMessageThread ERROR:', err);
    // Don't throw - this is just a performance optimization
  }
}

/**
 * Recalculate unread count for a thread
 */
async function updateThreadUnreadCount(userId, otherUserId) {
  try {
    const [rows] = await safeQuery(
      `SELECT COUNT(*) as unread_count FROM messages
       WHERE recipient_id = ? AND sender_id = ? AND is_read = 0 AND is_deleted = 0`,
      [userId, otherUserId]
    );

    const unreadCount = rows[0] ? rows[0].unread_count : 0;

    await safeQuery(
      `UPDATE message_threads SET unread_count = ?, updated_at = NOW()
       WHERE user_id = ? AND other_user_id = ?`,
      [unreadCount, userId, otherUserId]
    );
  } catch (err) {
    console.error('[MESSAGES SERVICE] updateThreadUnreadCount ERROR:', err);
  }
}

// ============================================================================
// SEARCH
// ============================================================================

/**
 * Search messages by content
 */
exports.searchMessages = async (userId, query, filters = {}) => {
  try {
    const { recipient_id, page = 1, limit = 20 } = filters;
    const offset = (page - 1) * limit;

    let recipientFilter = '';
    const params = [userId, `%${query}%`, userId];

    if (recipient_id) {
      recipientFilter = 'AND ((sender_id = ? AND recipient_id = ?) OR (sender_id = ? AND recipient_id = ?))';
      params.push(userId, recipient_id, recipient_id, userId);
    }

    const [rows] = await safeQuery(
      `SELECT m.*, 
              sender.full_name as sender_name,
              recipient.full_name as recipient_name,
              COUNT(*) OVER() as total
       FROM messages m
       LEFT JOIN users sender ON sender.id = m.sender_id
       LEFT JOIN users recipient ON recipient.id = m.recipient_id
       WHERE m.is_deleted = 0 AND 
             (m.sender_id = ? OR m.recipient_id = ?) AND
             m.content LIKE ? ${recipientFilter}
       ORDER BY m.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    const total = rows.length ? rows[0].total : 0;

    return {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      results: rows,
    };
  } catch (err) {
    if (err instanceof AppError) throw err;
    console.error('[MESSAGES SERVICE] searchMessages ERROR:', err);
    throw new AppError('Failed to search messages', 500);
  }
};

// ============================================================================
// STATISTICS
// ============================================================================

/**
 * Get message statistics for a user
 */
exports.getUserMessageStats = async (userId) => {
  try {
    const [rows] = await safeQuery(
      `SELECT 
        COUNT(*) as total_messages,
        SUM(CASE WHEN recipient_id = ? AND is_read = 0 THEN 1 ELSE 0 END) as unread_count,
        COUNT(DISTINCT sender_id) as conversations_count
       FROM messages
       WHERE (sender_id = ? OR recipient_id = ?) AND is_deleted = 0`,
      [userId, userId, userId]
    );

    return rows[0] || {
      total_messages: 0,
      unread_count: 0,
      conversations_count: 0,
    };
  } catch (err) {
    if (err instanceof AppError) throw err;
    console.error('[MESSAGES SERVICE] getUserMessageStats ERROR:', err);
    throw new AppError('Failed to fetch statistics', 500);
  }
};
