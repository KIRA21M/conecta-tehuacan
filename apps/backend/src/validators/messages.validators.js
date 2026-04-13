/**
 * Messages Validators
 * ====================
 * Validation schemas for messaging system
 * Uses express-validator for input sanitization and validation
 */

const { body, query, param, validationResult } = require('express-validator');

// ============================================================================
// CREATE MESSAGE VALIDATOR
// ============================================================================
exports.createMessageValidator = [
  body('recipient_id')
    .notEmpty()
    .withMessage('recipient_id is required')
    .isInt({ min: 1 })
    .withMessage('recipient_id must be a positive integer'),
  
  body('content')
    .notEmpty()
    .withMessage('content is required')
    .isLength({ min: 1, max: 5000 })
    .withMessage('content must be between 1 and 5000 characters')
    .trim()
    .escape(),
];

// ============================================================================
// LIST INBOX/THREADS VALIDATOR
// ============================================================================
exports.listThreadsValidator = [
  query('page')
    .optional({ checkFalsy: true })
    .isInt({ min: 1 })
    .withMessage('page must be a positive integer'),
  
  query('limit')
    .optional({ checkFalsy: true })
    .isInt({ min: 1, max: 100 })
    .withMessage('limit must be between 1 and 100'),
  
  query('sort_by')
    .optional({ checkFalsy: true })
    .isIn(['created_at', 'updated_at', 'unread_count'])
    .withMessage('sort_by must be one of: created_at, updated_at, unread_count'),
  
  query('sort_order')
    .optional({ checkFalsy: true })
    .toUpperCase()
    .isIn(['ASC', 'DESC'])
    .withMessage('sort_order must be ASC or DESC'),
  
  query('unread_only')
    .optional({ checkFalsy: true })
    .isBoolean()
    .withMessage('unread_only must be a boolean'),
];

// ============================================================================
// GET THREAD VALIDATOR (specific conversation with another user)
// ============================================================================
exports.getThreadValidator = [
  param('userId')
    .notEmpty()
    .withMessage('userId is required')
    .isInt({ min: 1 })
    .withMessage('userId must be a positive integer'),
  
  query('page')
    .optional({ checkFalsy: true })
    .isInt({ min: 1 })
    .withMessage('page must be a positive integer'),
  
  query('limit')
    .optional({ checkFalsy: true })
    .isInt({ min: 1, max: 100 })
    .withMessage('limit must be between 1 and 100'),
];

// ============================================================================
// MARK MESSAGE AS READ VALIDATOR
// ============================================================================
exports.markMessageReadValidator = [
  param('id')
    .notEmpty()
    .withMessage('Message id is required')
    .isInt({ min: 1 })
    .withMessage('Message id must be a positive integer'),
];

// ============================================================================
// MARK THREAD AS READ VALIDATOR
// ============================================================================
exports.markThreadReadValidator = [
  param('userId')
    .notEmpty()
    .withMessage('userId is required')
    .isInt({ min: 1 })
    .withMessage('userId must be a positive integer'),
];

// ============================================================================
// DELETE MESSAGE VALIDATOR
// ============================================================================
exports.deleteMessageValidator = [
  param('id')
    .notEmpty()
    .withMessage('Message id is required')
    .isInt({ min: 1 })
    .withMessage('Message id must be a positive integer'),
];

// ============================================================================
// DELETE THREAD VALIDATOR
// ============================================================================
exports.deleteThreadValidator = [
  param('userId')
    .notEmpty()
    .withMessage('userId is required')
    .isInt({ min: 1 })
    .withMessage('userId must be a positive integer'),
];

// ============================================================================
// SEARCH MESSAGES VALIDATOR
// ============================================================================
exports.searchMessagesValidator = [
  query('q')
    .notEmpty()
    .withMessage('search query is required')
    .isLength({ min: 1, max: 500 })
    .withMessage('search query must be between 1 and 500 characters')
    .trim(),
  
  query('recipient_id')
    .optional({ checkFalsy: true })
    .isInt({ min: 1 })
    .withMessage('recipient_id must be a positive integer'),
  
  query('page')
    .optional({ checkFalsy: true })
    .isInt({ min: 1 })
    .withMessage('page must be a positive integer'),
  
  query('limit')
    .optional({ checkFalsy: true })
    .isInt({ min: 1, max: 100 })
    .withMessage('limit must be between 1 and 100'),
];

// ============================================================================
// BULK MARK MESSAGES READ VALIDATOR
// ============================================================================
exports.bulkMarkReadValidator = [
  body('message_ids')
    .isArray({ min: 1 })
    .withMessage('message_ids must be a non-empty array'),
  
  body('message_ids.*')
    .isInt({ min: 1 })
    .withMessage('each message_id must be a positive integer'),
];

// ============================================================================
// REPORT MESSAGE VALIDATOR
// ============================================================================
exports.reportMessageValidator = [
  param('id')
    .notEmpty()
    .withMessage('Message id is required')
    .isInt({ min: 1 })
    .withMessage('Message id must be a positive integer'),
  
  body('reason')
    .notEmpty()
    .withMessage('reason is required')
    .isIn(['spam', 'harassment', 'inappropriate', 'other'])
    .withMessage('reason must be one of: spam, harassment, inappropriate, other'),
  
  body('description')
    .optional({ checkFalsy: true })
    .isLength({ min: 0, max: 1000 })
    .withMessage('description must be between 0 and 1000 characters')
    .trim()
    .escape(),
];

// ============================================================================
// VALIDATION ERROR HANDLER (middleware)
// ============================================================================
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      message: 'Validation error',
      errors: errors.array().map(err => ({
        field: err.param || err.path,
        reason: err.msg,
        message: err.msg,
      })),
    });
  }
  next();
};
