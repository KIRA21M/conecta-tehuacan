/**
 * Applications Validators
 * ========================
 * Validation schemas for job applications, candidatures, and favorites
 * Uses express-validator for input sanitization and validation
 */

const { body, query, param, validationResult } = require('express-validator');

// ============================================================================
// CREATE APPLICATION VALIDATOR
// ============================================================================
exports.createApplicationValidator = [
  body('job_id')
    .notEmpty()
    .withMessage('job_id is required')
    .isInt({ min: 1 })
    .withMessage('job_id must be a positive integer'),
  
  body('cover_letter')
    .optional({ checkFalsy: true })
    .isLength({ min: 0, max: 5000 })
    .withMessage('cover_letter must be between 0 and 5000 characters')
    .trim()
    .escape(),
];

// ============================================================================
// UPDATE APPLICATION STATUS VALIDATOR
// ============================================================================
exports.updateApplicationStatusValidator = [
  param('id')
    .notEmpty()
    .withMessage('Application id is required')
    .isInt({ min: 1 })
    .withMessage('Application id must be a positive integer'),
  
  body('status')
    .notEmpty()
    .withMessage('status is required')
    .isIn(['pending', 'accepted', 'rejected', 'withdrawn'])
    .withMessage('status must be one of: pending, accepted, rejected, withdrawn'),
  
  body('rejection_reason')
    .optional({ checkFalsy: true })
    .isLength({ min: 0, max: 500 })
    .withMessage('rejection_reason must be between 0 and 500 characters')
    .trim()
    .escape(),
];

// ============================================================================
// LIST APPLICATIONS VALIDATOR
// ============================================================================
exports.listApplicationsValidator = [
  query('job_id')
    .optional({ checkFalsy: true })
    .isInt({ min: 1 })
    .withMessage('job_id must be a positive integer'),
  
  query('candidate_id')
    .optional({ checkFalsy: true })
    .isInt({ min: 1 })
    .withMessage('candidate_id must be a positive integer'),
  
  query('status')
    .optional({ checkFalsy: true })
    .isIn(['pending', 'accepted', 'rejected', 'withdrawn'])
    .withMessage('status must be one of: pending, accepted, rejected, withdrawn'),
  
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
    .isIn(['created_at', 'updated_at', 'status'])
    .withMessage('sort_by must be one of: created_at, updated_at, status'),
  
  query('sort_order')
    .optional({ checkFalsy: true })
    .toUpperCase()
    .isIn(['ASC', 'DESC'])
    .withMessage('sort_order must be ASC or DESC'),
];

// ============================================================================
// APPLICATION ID VALIDATOR (for single resource endpoints)
// ============================================================================
exports.applicationIdValidator = [
  param('id')
    .notEmpty()
    .withMessage('Application id is required')
    .isInt({ min: 1 })
    .withMessage('Application id must be a positive integer'),
];

// ============================================================================
// CREATE FAVORITE VALIDATOR
// ============================================================================
exports.createFavoriteValidator = [
  body('job_id')
    .notEmpty()
    .withMessage('job_id is required')
    .isInt({ min: 1 })
    .withMessage('job_id must be a positive integer'),
];

// ============================================================================
// LIST FAVORITES VALIDATOR
// ============================================================================
exports.listFavoritesValidator = [
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
    .isIn(['created_at', 'job_title'])
    .withMessage('sort_by must be one of: created_at, job_title'),
  
  query('sort_order')
    .optional({ checkFalsy: true })
    .toUpperCase()
    .isIn(['ASC', 'DESC'])
    .withMessage('sort_order must be ASC or DESC'),
];

// ============================================================================
// ADD APPLICATION NOTE VALIDATOR
// ============================================================================
exports.addApplicationNoteValidator = [
  param('id')
    .notEmpty()
    .withMessage('Application id is required')
    .isInt({ min: 1 })
    .withMessage('Application id must be a positive integer'),
  
  body('note')
    .notEmpty()
    .withMessage('note is required')
    .isLength({ min: 1, max: 2000 })
    .withMessage('note must be between 1 and 2000 characters')
    .trim()
    .escape(),
];

// ============================================================================
// BULK UPDATE APPLICATIONS VALIDATOR
// ============================================================================
exports.bulkUpdateApplicationsValidator = [
  body('application_ids')
    .isArray({ min: 1 })
    .withMessage('application_ids must be a non-empty array'),
  
  body('application_ids.*')
    .isInt({ min: 1 })
    .withMessage('each application_id must be a positive integer'),
  
  body('status')
    .notEmpty()
    .withMessage('status is required')
    .isIn(['pending', 'accepted', 'rejected', 'withdrawn'])
    .withMessage('status must be one of: pending, accepted, rejected, withdrawn'),
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
