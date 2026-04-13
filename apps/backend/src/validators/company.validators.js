/**
 * Company Profile Validators
 * ==========================
 * Validation schemas for company profiles and recruiter information
 * Uses express-validator for input sanitization and validation
 */

const { body, query, param, validationResult } = require('express-validator');

// ============================================================================
// CREATE COMPANY PROFILE VALIDATOR
// ============================================================================
exports.createCompanyProfileValidator = [
  body('company_name')
    .notEmpty()
    .withMessage('company_name is required')
    .isLength({ min: 3, max: 150 })
    .withMessage('company_name must be between 3 and 150 characters')
    .trim()
    .escape(),
  
  body('description')
    .optional({ checkFalsy: true })
    .isLength({ min: 0, max: 5000 })
    .withMessage('description must be between 0 and 5000 characters')
    .trim()
    .escape(),
  
  body('website')
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage('website must be a valid URL'),
  
  body('phone')
    .optional({ checkFalsy: true })
    .matches(/^[\d\s\-\+\(\)]+$/)
    .withMessage('phone must contain only numbers and phone formatting characters')
    .isLength({ min: 10, max: 20 })
    .withMessage('phone must be between 10 and 20 characters'),
  
  body('logo_url')
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage('logo_url must be a valid URL')
    .custom(url => {
      const validImageFormats = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      const hasValidFormat = validImageFormats.some(format => url.toLowerCase().includes(format));
      if (!hasValidFormat) {
        throw new Error('logo_url must point to a valid image format (jpg, jpeg, png, gif, webp)');
      }
      return true;
    }),
  
  body('banner_url')
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage('banner_url must be a valid URL')
    .custom(url => {
      const validImageFormats = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      const hasValidFormat = validImageFormats.some(format => url.toLowerCase().includes(format));
      if (!hasValidFormat) {
        throw new Error('banner_url must point to a valid image format (jpg, jpeg, png, gif, webp)');
      }
      return true;
    }),
  
  body('industry')
    .optional({ checkFalsy: true })
    .isLength({ min: 2, max: 100 })
    .withMessage('industry must be between 2 and 100 characters')
    .trim()
    .escape(),
  
  body('company_size')
    .optional({ checkFalsy: true })
    .isIn(['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'])
    .withMessage('company_size must be one of: 1-10, 11-50, 51-200, 201-500, 501-1000, 1000+'),
  
  body('founded_year')
    .optional({ checkFalsy: true })
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage(`founded_year must be between 1900 and ${new Date().getFullYear()}`),
  
  body('headquarters_location')
    .optional({ checkFalsy: true })
    .isLength({ min: 2, max: 200 })
    .withMessage('headquarters_location must be between 2 and 200 characters')
    .trim()
    .escape(),
];

// ============================================================================
// UPDATE COMPANY PROFILE VALIDATOR
// ============================================================================
exports.updateCompanyProfileValidator = [
  body('company_name')
    .optional({ checkFalsy: true })
    .isLength({ min: 3, max: 150 })
    .withMessage('company_name must be between 3 and 150 characters')
    .trim()
    .escape(),
  
  body('description')
    .optional({ checkFalsy: true })
    .isLength({ min: 0, max: 5000 })
    .withMessage('description must be between 0 and 5000 characters')
    .trim()
    .escape(),
  
  body('website')
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage('website must be a valid URL'),
  
  body('phone')
    .optional({ checkFalsy: true })
    .matches(/^[\d\s\-\+\(\)]+$/)
    .withMessage('phone must contain only numbers and phone formatting characters')
    .isLength({ min: 10, max: 20 })
    .withMessage('phone must be between 10 and 20 characters'),
  
  body('logo_url')
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage('logo_url must be a valid URL')
    .custom(url => {
      const validImageFormats = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      const hasValidFormat = validImageFormats.some(format => url.toLowerCase().includes(format));
      if (!hasValidFormat) {
        throw new Error('logo_url must point to a valid image format (jpg, jpeg, png, gif, webp)');
      }
      return true;
    }),
  
  body('banner_url')
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage('banner_url must be a valid URL')
    .custom(url => {
      const validImageFormats = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      const hasValidFormat = validImageFormats.some(format => url.toLowerCase().includes(format));
      if (!hasValidFormat) {
        throw new Error('banner_url must point to a valid image format (jpg, jpeg, png, gif, webp)');
      }
      return true;
    }),
  
  body('industry')
    .optional({ checkFalsy: true })
    .isLength({ min: 2, max: 100 })
    .withMessage('industry must be between 2 and 100 characters')
    .trim()
    .escape(),
  
  body('company_size')
    .optional({ checkFalsy: true })
    .isIn(['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'])
    .withMessage('company_size must be one of: 1-10, 11-50, 51-200, 201-500, 501-1000, 1000+'),
  
  body('founded_year')
    .optional({ checkFalsy: true })
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage(`founded_year must be between 1900 and ${new Date().getFullYear()}`),
  
  body('headquarters_location')
    .optional({ checkFalsy: true })
    .isLength({ min: 2, max: 200 })
    .withMessage('headquarters_location must be between 2 and 200 characters')
    .trim()
    .escape(),
];

// ============================================================================
// LIST COMPANIES VALIDATOR (public endpoint)
// ============================================================================
exports.listCompaniesValidator = [
  query('page')
    .optional({ checkFalsy: true })
    .isInt({ min: 1 })
    .withMessage('page must be a positive integer'),
  
  query('limit')
    .optional({ checkFalsy: true })
    .isInt({ min: 1, max: 100 })
    .withMessage('limit must be between 1 and 100'),
  
  query('q')
    .optional({ checkFalsy: true })
    .isLength({ min: 1, max: 255 })
    .withMessage('search query must be between 1 and 255 characters')
    .trim(),
  
  query('industry')
    .optional({ checkFalsy: true })
    .isLength({ min: 2, max: 100 })
    .withMessage('industry must be between 2 and 100 characters')
    .trim(),
  
  query('company_size')
    .optional({ checkFalsy: true })
    .isIn(['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'])
    .withMessage('company_size must be one of: 1-10, 11-50, 51-200, 201-500, 501-1000, 1000+'),
  
  query('verified')
    .optional({ checkFalsy: true })
    .isBoolean()
    .withMessage('verified must be a boolean'),
  
  query('sort_by')
    .optional({ checkFalsy: true })
    .isIn(['rating', 'created_at', 'jobs_posted', 'name'])
    .withMessage('sort_by must be one of: rating, created_at, jobs_posted, name'),
  
  query('sort_order')
    .optional({ checkFalsy: true })
    .toUpperCase()
    .isIn(['ASC', 'DESC'])
    .withMessage('sort_order must be ASC or DESC'),
];

// ============================================================================
// GET COMPANY PROFILE VALIDATOR (single company detail)
// ============================================================================
exports.getCompanyValidator = [
  param('id')
    .notEmpty()
    .withMessage('Company id is required')
    .isInt({ min: 1 })
    .withMessage('Company id must be a positive integer'),
];

// ============================================================================
// COMPANY CONTACT VALIDATOR
// ============================================================================
exports.createCompanyContactValidator = [
  body('contact_name')
    .notEmpty()
    .withMessage('contact_name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('contact_name must be between 2 and 100 characters')
    .trim()
    .escape(),
  
  body('contact_email')
    .notEmpty()
    .withMessage('contact_email is required')
    .isEmail()
    .withMessage('contact_email must be a valid email'),
  
  body('contact_phone')
    .optional({ checkFalsy: true })
    .matches(/^[\d\s\-\+\(\)]+$/)
    .withMessage('contact_phone must contain only numbers and phone formatting characters')
    .isLength({ min: 10, max: 20 })
    .withMessage('contact_phone must be between 10 and 20 characters'),
  
  body('position')
    .optional({ checkFalsy: true })
    .isLength({ min: 2, max: 100 })
    .withMessage('position must be between 2 and 100 characters')
    .trim()
    .escape(),
  
  body('is_primary')
    .optional({ checkFalsy: true })
    .isBoolean()
    .withMessage('is_primary must be a boolean'),
];

// ============================================================================
// COMPANY SOCIAL LINKS VALIDATOR
// ============================================================================
exports.createCompanySocialLinkValidator = [
  body('platform')
    .notEmpty()
    .withMessage('platform is required')
    .isIn(['linkedin', 'facebook', 'twitter', 'instagram', 'github', 'website', 'youtube', 'other'])
    .withMessage('platform must be one of: linkedin, facebook, twitter, instagram, github, website, youtube, other'),
  
  body('url')
    .notEmpty()
    .withMessage('url is required')
    .isURL()
    .withMessage('url must be a valid URL'),
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
