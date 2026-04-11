/**
 * Applications Routes
 * ===================
 * Routes for job applications, candidatures, and favorites
 */

const express = require('express');
const { authRequired, requireRole } = require('../middlewares/auth.middleware');
const { handleValidationErrors } = require('../validators/applications.validators');
const { 
  createApplicationLimiter, 
  updateApplicationStatusLimiter,
  searchLimiter 
} = require('../middlewares/rateLimiter.middleware');
const { sanitizeNumericParams, detectXSS } = require('../middlewares/security.middleware');
const {
  createApplicationValidator,
  updateApplicationStatusValidator,
  listApplicationsValidator,
  applicationIdValidator,
  createFavoriteValidator,
  listFavoritesValidator,
  addApplicationNoteValidator,
} = require('../validators/applications.validators');

const {
  createApplication,
  listMyApplications,
  listJobApplications,
  getApplication,
  updateApplicationStatus,
  deleteApplication,
  getApplicationStats,
  addApplicationNote,
  getApplicationNotes,
  addFavorite,
  removeFavorite,
  listFavorites,
} = require('../controllers/applications.controller');

const router = express.Router();

// ============================================================================
// APPLICATIONS - CANDIDATE ROUTES
// ============================================================================

/**
 * POST /api/applications
 * Create new application for a job
 * Auth: Required (aspirante)
 * Rate Limit: 50/hour (dev), 20/hour (prod)
 */
router.post('/', authRequired, requireRole(['aspirante']), createApplicationLimiter, createApplicationValidator, handleValidationErrors, detectXSS, createApplication);

/**
 * GET /api/applications
 * List all applications of authenticated candidate
 * Auth: Required (aspirante)
 * Rate Limit: 200/10min (dev), 100/10min (prod) - search limiter
 */
router.get('/', authRequired, requireRole(['aspirante']), searchLimiter, listApplicationsValidator, handleValidationErrors, listMyApplications);

/**
 * GET /api/applications/:id
 * Get single application details
 * Auth: Required (candidate or recruiter)
 */
router.get(
  '/:id',
  authRequired,
  sanitizeNumericParams,
  applicationIdValidator,
  handleValidationErrors,
  getApplication
);

/**
 * DELETE /api/applications/:id
 * Withdraw application
 * Auth: Required (aspirante - only owner)
 */
router.delete(
  '/:id',
  authRequired,
  requireRole(['aspirante']),
  applicationIdValidator,
  handleValidationErrors,
  deleteApplication
);

// ============================================================================
// APPLICATIONS - RECRUITER/ADMIN ROUTES
// ============================================================================

/**
 * GET /api/applications/job/:jobId
 * List all applications for a specific job
 * Auth: Required (reclutador/admin - only job owner)
 */
router.get(
  '/job/:jobId',
  authRequired,
  requireRole(['reclutador', 'admin']),
  listApplicationsValidator,
  handleValidationErrors,
  listJobApplications
);

/**
 * PATCH /api/applications/:id/status
 * Update application status (accept/reject)
 * Auth: Required (reclutador/admin - only job owner)
 * Rate Limit: 100/hour (dev), 30/hour (prod)
 */
router.patch(
  '/:id/status',
  authRequired,
  requireRole(['reclutador', 'admin']),
  updateApplicationStatusLimiter,
  sanitizeNumericParams,
  updateApplicationStatusValidator,
  handleValidationErrors,
  updateApplicationStatus
);

/**
 * GET /api/applications/job/:jobId/stats
 * Get application statistics for a job
 * Auth: Required (reclutador/admin - only job owner)
 */
router.get(
  '/job/:jobId/stats',
  authRequired,
  requireRole(['reclutador', 'admin']),
  getApplicationStats
);

/**
 * POST /api/applications/:id/notes
 * Add internal note to application
 * Auth: Required (reclutador/admin - only job owner)
 */
router.post(
  '/:id/notes',
  authRequired,
  requireRole(['reclutador', 'admin']),
  addApplicationNoteValidator,
  handleValidationErrors,
  addApplicationNote
);

/**
 * GET /api/applications/:id/notes
 * Get application notes
 * Auth: Required (reclutador/admin - only job owner)
 */
router.get(
  '/:id/notes',
  authRequired,
  requireRole(['reclutador', 'admin']),
  applicationIdValidator,
  handleValidationErrors,
  getApplicationNotes
);

// ============================================================================
// FAVORITES
// ============================================================================

/**
 * POST /api/applications/favorites
 * Add job to favorites
 * Auth: Required (aspirante)
 */
router.post(
  '/favorites',
  authRequired,
  requireRole(['aspirante']),
  createFavoriteValidator,
  handleValidationErrors,
  addFavorite
);

/**
 * GET /api/applications/favorites
 * List favorite jobs
 * Auth: Required (aspirante)
 */
router.get(
  '/favorites',
  authRequired,
  requireRole(['aspirante']),
  listFavoritesValidator,
  handleValidationErrors,
  listFavorites
);

/**
 * DELETE /api/applications/favorites/:id
 * Remove job from favorites
 * Auth: Required (aspirante - only owner)
 */
router.delete(
  '/favorites/:id',
  authRequired,
  requireRole(['aspirante']),
  applicationIdValidator,
  handleValidationErrors,
  removeFavorite
);

module.exports = router;
