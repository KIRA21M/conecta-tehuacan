/**
 * Company Profile Routes
 * ======================
 * Routes for company/recruiter profiles
 */

const express = require('express');
const { authRequired, requireRole, optionalAuth } = require('../middlewares/auth.middleware');
const { handleValidationErrors } = require('../validators/company.validators');
const { 
  createCompanyProfileLimiter, 
  updateCompanyProfileLimiter,
  searchLimiter 
} = require('../middlewares/rateLimiter.middleware');
const { sanitizeNumericParams, detectXSS } = require('../middlewares/security.middleware');
const {
  createCompanyProfileValidator,
  updateCompanyProfileValidator,
  listCompaniesValidator,
  getCompanyValidator,
  createCompanyContactValidator,
  createCompanySocialLinkValidator,
} = require('../validators/company.validators');

const {
  createCompanyProfile,
  getMyCompanyProfile,
  getCompanyProfile,
  updateCompanyProfile,
  listCompanies,
  getFeaturedCompanies,
  getCompanyStats,
  deactivateCompanyProfile,
  addCompanyContact,
  getCompanyContacts,
  addSocialLink,
  getSocialLinks,
  removeSocialLink,
} = require('../controllers/company.controller');

const router = express.Router();

// ============================================================================
// PUBLIC ENDPOINTS (no auth required)
// ============================================================================

/**
 * GET /api/company
 * List all companies (public)
 * Auth: Optional
 * Rate Limit: 200/10min (dev), 100/10min (prod)
 */
router.get('/', searchLimiter, optionalAuth, listCompaniesValidator, handleValidationErrors, listCompanies);

/**
 * GET /api/company/featured
 * Get featured companies (highest rated, verified)
 * Auth: Optional
 */
router.get('/featured', getFeaturedCompanies);

/**
 * GET /api/company/:id
 * Get single company profile (public view)
 * Auth: Optional
 */
router.get('/:id', optionalAuth, sanitizeNumericParams, getCompanyValidator, handleValidationErrors, getCompanyProfile);

// ============================================================================
// RECRUITER PROFILE ROUTES (auth required)
// ============================================================================

/**
 * POST /api/company/profile
 * Create company profile
 * Auth: Required (reclutador/admin)
 * Rate Limit: 5/day (dev), 2/day (prod)
 */
router.post(
  '/profile',
  authRequired,
  requireRole(['reclutador', 'admin']),
  createCompanyProfileLimiter,
  createCompanyProfileValidator,
  handleValidationErrors,
  detectXSS,
  createCompanyProfile
);

/**
 * GET /api/company/profile/me
 * Get authenticated user's company profile
 * Auth: Required (reclutador/admin)
 */
router.get(
  '/profile/me',
  authRequired,
  requireRole(['reclutador', 'admin']),
  getMyCompanyProfile
);

/**
 * PATCH /api/company/profile
 * Update authenticated user's company profile
 * Auth: Required (reclutador/admin)
 * Rate Limit: 20/hour (dev), 5/hour (prod)
 */
router.patch(
  '/profile',
  authRequired,
  requireRole(['reclutador', 'admin']),
  updateCompanyProfileLimiter,
  updateCompanyProfileValidator,
  handleValidationErrors,
  detectXSS,
  updateCompanyProfile
);

/**
 * DELETE /api/company/profile
 * Deactivate company profile
 * Auth: Required (reclutador/admin - owner only)
 */
router.delete(
  '/profile',
  authRequired,
  requireRole(['reclutador', 'admin']),
  deactivateCompanyProfile
);

// ============================================================================
// COMPANY STATISTICS
// ============================================================================

/**
 * GET /api/company/stats
 * Get company statistics (applications, jobs, etc.)
 * Auth: Required (reclutador/admin - owner only)
 */
router.get(
  '/stats',
  authRequired,
  requireRole(['reclutador', 'admin']),
  getCompanyStats
);

// ============================================================================
// COMPANY CONTACTS
// ============================================================================

/**
 * POST /api/company/contacts
 * Add new contact to company profile
 * Auth: Required (reclutador/admin - owner only)
 */
router.post(
  '/contacts',
  authRequired,
  requireRole(['reclutador', 'admin']),
  createCompanyContactValidator,
  handleValidationErrors,
  addCompanyContact
);

/**
 * GET /api/company/contacts
 * Get all contacts for company profile
 * Auth: Required (reclutador/admin - owner only)
 */
router.get(
  '/contacts',
  authRequired,
  requireRole(['reclutador', 'admin']),
  getCompanyContacts
);

// ============================================================================
// COMPANY SOCIAL LINKS
// ============================================================================

/**
 * POST /api/company/social
 * Add social media link to company profile
 * Auth: Required (reclutador/admin - owner only)
 */
router.post(
  '/social',
  authRequired,
  requireRole(['reclutador', 'admin']),
  createCompanySocialLinkValidator,
  handleValidationErrors,
  addSocialLink
);

/**
 * GET /api/company/social
 * Get all social links for company profile
 * Auth: Required (reclutador/admin - owner only)
 */
router.get(
  '/social',
  authRequired,
  requireRole(['reclutador', 'admin']),
  getSocialLinks
);

/**
 * DELETE /api/company/social/:linkId
 * Remove social link from company profile
 * Auth: Required (reclutador/admin - owner only)
 */
router.delete(
  '/social/:linkId',
  authRequired,
  requireRole(['reclutador', 'admin']),
  removeSocialLink
);

module.exports = router;
