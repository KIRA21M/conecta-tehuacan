/**
 * Messages Routes
 * ===============
 * Routes for messaging system between candidates and recruiters
 */

const express = require('express');
const { authRequired } = require('../middlewares/auth.middleware');
const { handleValidationErrors } = require('../validators/messages.validators');
const { 
  sendMessageLimiter, 
  searchLimiter 
} = require('../middlewares/rateLimiter.middleware');
const { sanitizeNumericParams, detectXSS } = require('../middlewares/security.middleware');
const {
  createMessageValidator,
  listThreadsValidator,
  getThreadValidator,
  markMessageReadValidator,
  markThreadReadValidator,
  deleteMessageValidator,
  deleteThreadValidator,
  searchMessagesValidator,
  bulkMarkReadValidator,
  reportMessageValidator,
} = require('../validators/messages.validators');

const {
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
} = require('../controllers/messages.controller');

const router = express.Router();

// ============================================================================
// INBOX & THREADS
// ============================================================================

/**
 * GET /api/messages
 * Get user's inbox (list all conversations/threads)
 * Auth: Required (all roles)
 */
router.get('/', authRequired, listThreadsValidator, handleValidationErrors, getInbox);

/**
 * GET /api/messages/threads/:userId
 * Get conversation with specific user
 * Auth: Required (all roles)
 */
router.get(
  '/threads/:userId',
  authRequired,
  getThreadValidator,
  handleValidationErrors,
  getThread
);

// ============================================================================
// SEND MESSAGE
// ============================================================================

/**
 * POST /api/messages
 * Send message to another user
 * Auth: Required (all roles)
 * Rate Limit: 100/hour (dev), 50/hour (prod)
 */
router.post(
  '/',
  authRequired,
  sendMessageLimiter,
  createMessageValidator,
  handleValidationErrors,
  detectXSS,
  sendMessage
);

// ============================================================================
// READ/MARK READ OPERATIONS
// ============================================================================

/**
 * PATCH /api/messages/:id/read
 * Mark single message as read
 * Auth: Required (all roles)
 */
router.patch(
  '/:id/read',
  authRequired,
  markMessageReadValidator,
  handleValidationErrors,
  markMessageRead
);

/**
 * PATCH /api/messages/threads/:userId/read
 * Mark entire conversation as read
 * Auth: Required (all roles)
 */
router.patch(
  '/threads/:userId/read',
  authRequired,
  markThreadReadValidator,
  handleValidationErrors,
  markThreadRead
);

/**
 * POST /api/messages/bulk-read
 * Mark multiple messages as read
 * Auth: Required (all roles)
 */
router.post(
  '/bulk-read',
  authRequired,
  bulkMarkReadValidator,
  handleValidationErrors,
  bulkMarkRead
);

// ============================================================================
// DELETE OPERATIONS
// ============================================================================

/**
 * DELETE /api/messages/:id
 * Delete single message (soft delete)
 * Auth: Required (all roles - sender only)
 */
router.delete(
  '/:id',
  authRequired,
  deleteMessageValidator,
  handleValidationErrors,
  deleteMessage
);

/**
 * DELETE /api/messages/threads/:userId
 * Delete entire conversation with user
 * Auth: Required (all roles)
 */
router.delete(
  '/threads/:userId',
  authRequired,
  deleteThreadValidator,
  handleValidationErrors,
  deleteThread
);

// ============================================================================
// SEARCH & STATISTICS
// ============================================================================

/**
 * GET /api/messages/search
 * Search messages by content
 * Auth: Required (all roles)
 * Rate Limit: 200/10min (dev), 100/10min (prod)
 */
router.get(
  '/search',
  authRequired,
  searchLimiter,
  sanitizeNumericParams,
  searchMessagesValidator,
  handleValidationErrors,
  searchMessages
);

/**
 * GET /api/messages/stats
 * Get user's message statistics
 * Auth: Required (all roles)
 */
router.get(
  '/stats',
  authRequired,
  getMessageStats
);

module.exports = router;
