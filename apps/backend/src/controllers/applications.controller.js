/**
 * Applications Controller
 * =======================
 * Handle HTTP requests for job applications
 */

const { ok } = require('../utils/response');
const { AppError } = require('../utils/errors');
const ApplicationsService = require('../services/applications.service');

// ============================================================================
// CREATE APPLICATION
// ============================================================================

async function createApplication(req, res, next) {
  try {
    const { job_id, cover_letter } = req.body;
    const candidateId = req.user.id;

    const result = await ApplicationsService.createApplication(job_id, candidateId, cover_letter);

    console.info(`[AUDIT] Application created: job_id=${job_id} by candidate=${candidateId}`);

    return ok(res, {
      status: 201,
      message: 'Application submitted successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

// ============================================================================
// LIST APPLICATIONS (for candidate - their own applications)
// ============================================================================

async function listMyApplications(req, res, next) {
  try {
    const candidateId = req.user.id;
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);

    const result = await ApplicationsService.getCandidateApplications(candidateId, {
      ...req.query,
      page,
      limit,
    });

    return ok(res, {
      message: 'Your applications',
      data: result.items,
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
// LIST APPLICATIONS FOR JOB (for recruiter/admin)
// ============================================================================

async function listJobApplications(req, res, next) {
  try {
    const jobId = parseInt(req.params.jobId);
    const recruiterId = req.user.id;

    if (!jobId || isNaN(jobId) || jobId < 1) {
      return next(new AppError('Invalid job ID', 400, [{ reason: 'invalid_job_id' }]));
    }

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);

    const result = await ApplicationsService.getJobApplications(jobId, recruiterId, {
      ...req.query,
      page,
      limit,
    });

    return ok(res, {
      message: 'Job applications',
      data: result.items,
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
// GET APPLICATION DETAILS
// ============================================================================

async function getApplication(req, res, next) {
  try {
    const applicationId = parseInt(req.params.id);

    if (!applicationId || isNaN(applicationId) || applicationId < 1) {
      return next(new AppError('Invalid application ID', 400));
    }

    const application = await ApplicationsService.getApplicationById(applicationId);

    if (!application) {
      return next(new AppError('Application not found', 404));
    }

    // Authorization: only candidate or job owner/recruiter can view
    if (application.candidate_id !== req.user.id) {
      // Check if user is job owner
      await ApplicationsService.ensureApplicationJobOwner(applicationId, req.user.id).catch(() => {
        throw new AppError('Unauthorized to view this application', 403);
      });
    }

    return ok(res, {
      message: 'Application details',
      data: application,
    });
  } catch (error) {
    next(error);
  }
}

// ============================================================================
// UPDATE APPLICATION STATUS
// ============================================================================

async function updateApplicationStatus(req, res, next) {
  try {
    const applicationId = parseInt(req.params.id);
    const { status, rejection_reason } = req.body;
    const reviewerId = req.user.id;

    if (!applicationId || isNaN(applicationId) || applicationId < 1) {
      return next(new AppError('Invalid application ID', 400));
    }

    // Verify recruiter owns the job
    await ApplicationsService.ensureApplicationJobOwner(applicationId, reviewerId);

    const result = await ApplicationsService.updateApplicationStatus(
      applicationId,
      status,
      reviewerId,
      rejection_reason
    );

    console.info(`[AUDIT] Application status updated: app_id=${applicationId} status=${status} by recruiter=${reviewerId}`);

    return ok(res, {
      message: `Application ${status}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

// ============================================================================
// DELETE APPLICATION (withdraw)
// ============================================================================

async function deleteApplication(req, res, next) {
  try {
    const applicationId = parseInt(req.params.id);
    const candidateId = req.user.id;

    if (!applicationId || isNaN(applicationId) || applicationId < 1) {
      return next(new AppError('Invalid application ID', 400));
    }

    const result = await ApplicationsService.deleteApplication(applicationId, candidateId);

    console.info(`[AUDIT] Application withdrawn: app_id=${applicationId} by candidate=${candidateId}`);

    return ok(res, {
      message: 'Application withdrawn',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

// ============================================================================
// GET APPLICATION STATISTICS
// ============================================================================

async function getApplicationStats(req, res, next) {
  try {
    const jobId = parseInt(req.params.jobId);
    const recruiterId = req.user.id;

    if (!jobId || isNaN(jobId) || jobId < 1) {
      return next(new AppError('Invalid job ID', 400));
    }

    // Verify recruiter owns the job
    const [rows] = await require('../config/db').query(
      'SELECT id FROM job_posts WHERE id = ? AND recruiter_user_id = ? LIMIT 1',
      [jobId, recruiterId]
    );

    if (!rows.length) {
      return next(new AppError('Job not found or unauthorized', 404));
    }

    const stats = await ApplicationsService.getApplicationStats(jobId);

    return ok(res, {
      message: 'Application statistics',
      data: stats,
    });
  } catch (error) {
    next(error);
  }
}

// ============================================================================
// ADD APPLICATION NOTE
// ============================================================================

async function addApplicationNote(req, res, next) {
  try {
    const applicationId = parseInt(req.params.id);
    const { note } = req.body;
    const createdBy = req.user.id;

    if (!applicationId || isNaN(applicationId) || applicationId < 1) {
      return next(new AppError('Invalid application ID', 400));
    }

    // Verify recruiter owns the job
    await ApplicationsService.ensureApplicationJobOwner(applicationId, createdBy);

    const result = await ApplicationsService.addApplicationNote(applicationId, createdBy, note);

    console.info(`[AUDIT] Note added to application: app_id=${applicationId} by user=${createdBy}`);

    return ok(res, {
      status: 201,
      message: 'Note added',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

// ============================================================================
// GET APPLICATION NOTES
// ============================================================================

async function getApplicationNotes(req, res, next) {
  try {
    const applicationId = parseInt(req.params.id);

    if (!applicationId || isNaN(applicationId) || applicationId < 1) {
      return next(new AppError('Invalid application ID', 400));
    }

    const notes = await ApplicationsService.getApplicationNotes(applicationId);

    return ok(res, {
      message: 'Application notes',
      data: notes,
    });
  } catch (error) {
    next(error);
  }
}

// ============================================================================
// FAVORITES
// ============================================================================

async function addFavorite(req, res, next) {
  try {
    const { job_id } = req.body;
    const candidateId = req.user.id;

    const result = await ApplicationsService.addFavorite(job_id, candidateId);

    console.info(`[AUDIT] Job bookmarked: job_id=${job_id} by candidate=${candidateId}`);

    return ok(res, {
      status: 201,
      message: 'Added to favorites',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

async function removeFavorite(req, res, next) {
  try {
    const favoriteId = parseInt(req.params.id);
    const candidateId = req.user.id;

    if (!favoriteId || isNaN(favoriteId) || favoriteId < 1) {
      return next(new AppError('Invalid favorite ID', 400));
    }

    const result = await ApplicationsService.removeFavorite(favoriteId, candidateId);

    return ok(res, {
      message: 'Removed from favorites',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

async function listFavorites(req, res, next) {
  try {
    const candidateId = req.user.id;
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);

    const result = await ApplicationsService.getCandidateFavorites(candidateId, {
      page,
      limit,
    });

    return ok(res, {
      message: 'Your bookmarks',
      data: result.items,
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
// EXPORTS
// ============================================================================

module.exports = {
  // Applications
  createApplication,
  listMyApplications,
  listJobApplications,
  getApplication,
  updateApplicationStatus,
  deleteApplication,
  getApplicationStats,

  // Notes
  addApplicationNote,
  getApplicationNotes,

  // Favorites
  addFavorite,
  removeFavorite,
  listFavorites,
};
