/**
 * Messages Controller
 * ===================
 * Handle HTTP requests for messaging system
 */

const { ok } = require('../utils/response');
const { AppError } = require('../utils/errors');
const MessagesService = require('../services/messages.service');

// ============================================================================
// SEND MESSAGE
// ============================================================================

async function sendMessage(req, res, next) {
  try {
    const { recipient_id, content } = req.body;
    const senderId = req.user.id;

    const result = await MessagesService.sendMessage(senderId, recipient_id, content);

    console.info(`[AUDIT] Message sent: from=${senderId} to=${recipient_id}`);

    return ok(res, {
      status: 201,
      message: 'Message sent',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

// ============================================================================
// GET INBOX (list threads)
// ============================================================================

async function getInbox(req, res, next) {
  try {
    const userId = req.user.id;
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const unread_only = req.query.unread_only === 'true';

    const result = await MessagesService.getInbox(userId, {
      page,
      limit,
      unread_only,
    });

    return ok(res, {
      message: 'Your conversations',
      data: result.threads,
      meta: {
        page,
        limit,
        total: result.total,
        pages: result.pages,
      },
    });
  } catch (error) {
    next(error);
  }
}

// ============================================================================
// GET THREAD (conversation with specific user)
// ============================================================================

async function getThread(req, res, next) {
  try {
    const userId = req.user.id;
    const otherUserId = parseInt(req.params.userId);

    if (!otherUserId || isNaN(otherUserId) || otherUserId < 1) {
      return next(new AppError('Invalid user ID', 400));
    }

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);

    const result = await MessagesService.getThread(userId, otherUserId, {
      page,
      limit,
    });

    return ok(res, {
      message: 'Conversation',
      data: result.messages,
      meta: {
        page,
        limit,
        total: result.total,
        pages: result.pages,
      },
    });
  } catch (error) {
    next(error);
  }
}

// ============================================================================
// MARK MESSAGE AS READ
// ============================================================================

async function markMessageRead(req, res, next) {
  try {
    const messageId = parseInt(req.params.id);
    const userId = req.user.id;

    if (!messageId || isNaN(messageId) || messageId < 1) {
      return next(new AppError('Invalid message ID', 400));
    }

    const result = await MessagesService.markMessageRead(messageId, userId);

    return ok(res, {
      message: 'Message marked as read',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

// ============================================================================
// MARK THREAD AS READ
// ============================================================================

async function markThreadRead(req, res, next) {
  try {
    const userId = req.user.id;
    const otherUserId = parseInt(req.params.userId);

    if (!otherUserId || isNaN(otherUserId) || otherUserId < 1) {
      return next(new AppError('Invalid user ID', 400));
    }

    const result = await MessagesService.markThreadRead(userId, otherUserId);

    return ok(res, {
      message: 'Thread marked as read',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

// ============================================================================
// DELETE MESSAGE
// ============================================================================

async function deleteMessage(req, res, next) {
  try {
    const messageId = parseInt(req.params.id);
    const userId = req.user.id;

    if (!messageId || isNaN(messageId) || messageId < 1) {
      return next(new AppError('Invalid message ID', 400));
    }

    const result = await MessagesService.deleteMessage(messageId, userId);

    console.info(`[AUDIT] Message deleted: msg_id=${messageId} by user=${userId}`);

    return ok(res, {
      message: 'Message deleted',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

// ============================================================================
// DELETE THREAD
// ============================================================================

async function deleteThread(req, res, next) {
  try {
    const userId = req.user.id;
    const otherUserId = parseInt(req.params.userId);

    if (!otherUserId || isNaN(otherUserId) || otherUserId < 1) {
      return next(new AppError('Invalid user ID', 400));
    }

    const result = await MessagesService.deleteThread(userId, otherUserId);

    console.info(`[AUDIT] Thread deleted: user_ids=${userId},${otherUserId}`);

    return ok(res, {
      message: 'Conversation deleted',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

// ============================================================================
// SEARCH MESSAGES
// ============================================================================

async function searchMessages(req, res, next) {
  try {
    const userId = req.user.id;
    const { q, recipient_id } = req.query;

    if (!q) {
      return next(new AppError('Search query is required', 400));
    }

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);

    const result = await MessagesService.searchMessages(userId, q, {
      recipient_id: recipient_id ? parseInt(recipient_id) : undefined,
      page,
      limit,
    });

    return ok(res, {
      message: 'Search results',
      data: result.results,
      meta: {
        page,
        limit,
        total: result.total,
        pages: result.pages,
      },
    });
  } catch (error) {
    next(error);
  }
}

// ============================================================================
// GET MESSAGE STATISTICS
// ============================================================================

async function getMessageStats(req, res, next) {
  try {
    const userId = req.user.id;

    const stats = await MessagesService.getUserMessageStats(userId);

    return ok(res, {
      message: 'Message statistics',
      data: stats,
    });
  } catch (error) {
    next(error);
  }
}

// ============================================================================
// BULK MARK MESSAGES READ
// ============================================================================

async function bulkMarkRead(req, res, next) {
  try {
    const { message_ids } = req.body;
    const userId = req.user.id;

    if (!message_ids || !Array.isArray(message_ids) || message_ids.length === 0) {
      return next(new AppError('message_ids array is required', 400));
    }

    // Mark each message as read
    const promises = message_ids.map(msgId =>
      MessagesService.markMessageRead(msgId, userId).catch(() => null)
    );

    await Promise.all(promises);

    return ok(res, {
      message: 'Messages marked as read',
      data: { count: message_ids.length },
    });
  } catch (error) {
    next(error);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  sendMessage,
  getInbox,
  getThread,
  markMessageRead,
  markThreadRead,
  deleteMessage,
  deleteThread,
  searchMessages,
  getMessageStats,
  bulkMarkRead,
};
