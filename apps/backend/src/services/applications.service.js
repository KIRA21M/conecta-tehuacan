/**
 * Applications Service
 * ====================
 * Business logic for job applications and candidatures
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
    console.error('[APPLICATIONS SERVICE] SQL ERROR:', err);
    throw new AppError('Database error', 500);
  }
}

/**
 * Build WHERE clause and parameters for filtering applications
 */
function buildApplicationFilters(filters) {
  const { job_id, candidate_id, status, reviewed_by, page = 1, limit = 10 } = filters;

  const where = ['a.is_active = 1'];
  const params = [];

  if (job_id) {
    where.push('a.job_id = ?');
    params.push(Number(job_id));
  }

  if (candidate_id) {
    where.push('a.candidate_id = ?');
    params.push(Number(candidate_id));
  }

  if (status) {
    where.push('a.status = ?');
    params.push(status);
  }

  if (reviewed_by) {
    where.push('a.reviewed_by = ?');
    params.push(Number(reviewed_by));
  }

  return {
    whereSql: where.length ? `WHERE ${where.join(' AND ')}` : '',
    params,
    page: Number(page),
    limit: Number(limit),
  };
}

// ============================================================================
// CREATE APPLICATION
// ============================================================================

/**
 * Create a new job application for a candidate
 * @param {number} jobId - Job post ID
 * @param {number} candidateId - Candidate user ID
 * @param {string} coverLetter - Optional cover letter
 */
exports.createApplication = async (jobId, candidateId, coverLetter = null) => {
  if (!jobId || !candidateId) {
    throw new AppError('jobId and candidateId are required', 400);
  }

  try {
    // Check if job exists and is active
    const [jobRows] = await safeQuery(
      'SELECT id FROM job_posts WHERE id = ? AND is_active = 1 LIMIT 1',
      [jobId]
    );

    if (!jobRows.length) {
      throw new AppError('Job not found or inactive', 404);
    }

    // Check if candidate already applied
    const [existingApp] = await safeQuery(
      'SELECT id FROM applications WHERE job_id = ? AND candidate_id = ? AND is_active = 1 LIMIT 1',
      [jobId, candidateId]
    );

    if (existingApp.length) {
      throw new AppError('Already applied to this job', 409, [{ reason: 'duplicate_application' }]);
    }

    // Create application
    const [result] = await safeQuery(
      `INSERT INTO applications (job_id, candidate_id, cover_letter, status, created_at, updated_at, is_active)
       VALUES (?, ?, ?, 'pending', NOW(), NOW(), 1)`,
      [jobId, candidateId, coverLetter]
    );

    console.log('[AUDIT] Application created:', { applicationId: result.insertId, jobId, candidateId });

    return { id: result.insertId, status: 'pending' };
  } catch (err) {
    if (err instanceof AppError) throw err;
    console.error('[APPLICATIONS SERVICE] createApplication ERROR:', err);
    throw new AppError('Failed to create application', 500);
  }
};

// ============================================================================
// GET APPLICATIONS
// ============================================================================

/**
 * Get applications with filtering and pagination
 */
exports.getApplications = async (filters) => {
  try {
    const { whereSql, params, page, limit } = buildApplicationFilters(filters);
    const offset = (page - 1) * limit;

    const [rows] = await safeQuery(
      `SELECT a.*, u.full_name as candidate_name, u.email as candidate_email, 
              jp.title as job_title, jp.company_name,
              COUNT(*) OVER() as total
       FROM applications a
       LEFT JOIN users u ON u.id = a.candidate_id
       LEFT JOIN job_posts jp ON jp.id = a.job_id
       ${whereSql}
       ORDER BY a.created_at DESC
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
    console.error('[APPLICATIONS SERVICE] getApplications ERROR:', err);
    throw new AppError('Failed to fetch applications', 500);
  }
};

// ============================================================================
// GET APPLICATION BY ID
// ============================================================================

/**
 * Get single application with full details
 */
exports.getApplicationById = async (applicationId) => {
  try {
    const [rows] = await safeQuery(
      `SELECT a.*, u.full_name as candidate_name, u.email as candidate_email,
              jp.title as job_title, jp.company_name, jp.location,
              rr.full_name as reviewer_name
       FROM applications a
       LEFT JOIN users u ON u.id = a.candidate_id
       LEFT JOIN job_posts jp ON jp.id = a.job_id
       LEFT JOIN users rr ON rr.id = a.reviewed_by
       WHERE a.id = ? LIMIT 1`,
      [applicationId]
    );

    return rows[0] || null;
  } catch (err) {
    if (err instanceof AppError) throw err;
    console.error('[APPLICATIONS SERVICE] getApplicationById ERROR:', err);
    throw new AppError('Failed to fetch application', 500);
  }
};

// ============================================================================
// UPDATE APPLICATION STATUS
// ============================================================================

/**
 * Update application status (accept/reject/etc)
 * @param {number} applicationId - Application ID
 * @param {string} newStatus - New status
 * @param {number} reviewerId - User ID of reviewer
 * @param {string} rejectionReason - Optional reason for rejection
 */
exports.updateApplicationStatus = async (applicationId, newStatus, reviewerId, rejectionReason = null) => {
  if (!['pending', 'accepted', 'rejected', 'withdrawn'].includes(newStatus)) {
    throw new AppError('Invalid status', 400);
  }

  try {
    // Get current application
    const current = await exports.getApplicationById(applicationId);
    if (!current) {
      throw new AppError('Application not found', 404);
    }

    // Update status
    await safeQuery(
      `UPDATE applications 
       SET status = ?, reviewed_by = ?, reviewed_at = NOW(), rejection_reason = ?, updated_at = NOW()
       WHERE id = ?`,
      [newStatus, reviewerId, rejectionReason, applicationId]
    );

    console.log('[AUDIT] Application status updated:', { applicationId, oldStatus: current.status, newStatus, reviewerId });

    return { id: applicationId, status: newStatus };
  } catch (err) {
    if (err instanceof AppError) throw err;
    console.error('[APPLICATIONS SERVICE] updateApplicationStatus ERROR:', err);
    throw new AppError('Failed to update application status', 500);
  }
};

// ============================================================================
// DELETE APPLICATION
// ============================================================================

/**
 * Soft delete application (withdraw)
 */
exports.deleteApplication = async (applicationId, userId) => {
  try {
    const app = await exports.getApplicationById(applicationId);
    if (!app) {
      throw new AppError('Application not found', 404);
    }

    // Only candidate or admin can withdraw
    if (app.candidate_id !== userId) {
      throw new AppError('Unauthorized to delete this application', 403);
    }

    // Soft delete
    await safeQuery(
      'UPDATE applications SET is_active = 0, status = "withdrawn", updated_at = NOW() WHERE id = ?',
      [applicationId]
    );

    console.log('[AUDIT] Application withdrawn:', { applicationId, candidateId: userId });

    return { deleted: true };
  } catch (err) {
    if (err instanceof AppError) throw err;
    console.error('[APPLICATIONS SERVICE] deleteApplication ERROR:', err);
    throw new AppError('Failed to delete application', 500);
  }
};

// ============================================================================
// APPLICATION STATISTICS
// ============================================================================

/**
 * Get statistics for a job's applications
 */
exports.getApplicationStats = async (jobId) => {
  try {
    const [rows] = await safeQuery(
      `SELECT 
        COUNT(*) as total_applications,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) as accepted,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected,
        SUM(CASE WHEN status = 'withdrawn' THEN 1 ELSE 0 END) as withdrawn
       FROM applications
       WHERE job_id = ? AND is_active = 1`,
      [jobId]
    );

    const stats = rows[0] || {
      total_applications: 0,
      pending: 0,
      accepted: 0,
      rejected: 0,
      withdrawn: 0,
    };

    stats.acceptance_rate = stats.total_applications > 0
      ? ((stats.accepted / stats.total_applications) * 100).toFixed(2)
      : 0;

    return stats;
  } catch (err) {
    if (err instanceof AppError) throw err;
    console.error('[APPLICATIONS SERVICE] getApplicationStats ERROR:', err);
    throw new AppError('Failed to fetch statistics', 500);
  }
};

// ============================================================================
// CANDIDATES' APPLICATIONS
// ============================================================================

/**
 * Get all applications for a candidate
 */
exports.getCandidateApplications = async (candidateId, filters = {}) => {
  try {
    filters.candidate_id = candidateId;
    return await exports.getApplications(filters);
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError('Failed to fetch candidate applications', 500);
  }
};

// ============================================================================
// JOB APPLICATIONS (for recruiters)
// ============================================================================

/**
 * Get all applications for a specific job (recruiter view)
 */
exports.getJobApplications = async (jobId, recruiterId, filters = {}) => {
  try {
    // Verify job belongs to recruiter
    const [jobRows] = await safeQuery(
      'SELECT id FROM job_posts WHERE id = ? AND recruiter_user_id = ? LIMIT 1',
      [jobId, recruiterId]
    );

    if (!jobRows.length) {
      throw new AppError('Job not found or unauthorized', 404);
    }

    filters.job_id = jobId;
    return await exports.getApplications(filters);
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError('Failed to fetch job applications', 500);
  }
};

// ============================================================================
// FAVORITE JOBS
// ============================================================================

/**
 * Add job to favorites
 */
exports.addFavorite = async (jobId, candidateId) => {
  try {
    // Check if job exists
    const [jobRows] = await safeQuery(
      'SELECT id FROM job_posts WHERE id = ? AND is_active = 1 LIMIT 1',
      [jobId]
    );

    if (!jobRows.length) {
      throw new AppError('Job not found', 404);
    }

    // Check if already favorited
    const [existingFav] = await safeQuery(
      'SELECT id FROM favorites WHERE job_id = ? AND candidate_id = ? LIMIT 1',
      [jobId, candidateId]
    );

    if (existingFav.length) {
      throw new AppError('Already in favorites', 409);
    }

    const [result] = await safeQuery(
      'INSERT INTO favorites (job_id, candidate_id, created_at, updated_at) VALUES (?, ?, NOW(), NOW())',
      [jobId, candidateId]
    );

    return { id: result.insertId };
  } catch (err) {
    if (err instanceof AppError) throw err;
    console.error('[APPLICATIONS SERVICE] addFavorite ERROR:', err);
    throw new AppError('Failed to add to favorites', 500);
  }
};

/**
 * Remove job from favorites
 */
exports.removeFavorite = async (favoriteId, candidateId) => {
  try {
    // Verify ownership
    const [rows] = await safeQuery(
      'SELECT id FROM favorites WHERE id = ? AND candidate_id = ? LIMIT 1',
      [favoriteId, candidateId]
    );

    if (!rows.length) {
      throw new AppError('Favorite not found or unauthorized', 404);
    }

    await safeQuery('DELETE FROM favorites WHERE id = ?', [favoriteId]);
    return { deleted: true };
  } catch (err) {
    if (err instanceof AppError) throw err;
    console.error('[APPLICATIONS SERVICE] removeFavorite ERROR:', err);
    throw new AppError('Failed to remove favorite', 500);
  }
};

/**
 * Get candidate's favorite jobs
 */
exports.getCandidateFavorites = async (candidateId, filters = {}) => {
  try {
    const { page = 1, limit = 10 } = filters;
    const offset = (page - 1) * limit;

    const [rows] = await safeQuery(
      `SELECT f.id as favorite_id, jp.*, 
              COUNT(*) OVER() as total
       FROM favorites f
       LEFT JOIN job_posts jp ON jp.id = f.job_id
       WHERE f.candidate_id = ? AND jp.is_active = 1
       ORDER BY f.created_at DESC
       LIMIT ? OFFSET ?`,
      [candidateId, limit, offset]
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
    console.error('[APPLICATIONS SERVICE] getCandidateFavorites ERROR:', err);
    throw new AppError('Failed to fetch favorites', 500);
  }
};

// ============================================================================
// APPLICATION NOTES (audit trail)
// ============================================================================

/**
 * Add a note to an application
 */
exports.addApplicationNote = async (applicationId, createdBy, note) => {
  try {
    const app = await exports.getApplicationById(applicationId);
    if (!app) {
      throw new AppError('Application not found', 404);
    }

    const [result] = await safeQuery(
      'INSERT INTO application_notes (application_id, created_by, note, created_at) VALUES (?, ?, ?, NOW())',
      [applicationId, createdBy, note]
    );

    return { id: result.insertId };
  } catch (err) {
    if (err instanceof AppError) throw err;
    console.error('[APPLICATIONS SERVICE] addApplicationNote ERROR:', err);
    throw new AppError('Failed to add note', 500);
  }
};

/**
 * Get application notes
 */
exports.getApplicationNotes = async (applicationId) => {
  try {
    const [rows] = await safeQuery(
      `SELECT an.*, u.full_name as created_by_name
       FROM application_notes an
       LEFT JOIN users u ON u.id = an.created_by
       WHERE an.application_id = ?
       ORDER BY an.created_at DESC`,
      [applicationId]
    );

    return rows;
  } catch (err) {
    if (err instanceof AppError) throw err;
    console.error('[APPLICATIONS SERVICE] getApplicationNotes ERROR:', err);
    throw new AppError('Failed to fetch notes', 500);
  }
};

// ============================================================================
// VALIDATION & AUTHORIZATION
// ============================================================================

/**
 * Verify that a recruiter owns the job for an application
 */
exports.ensureApplicationJobOwner = async (applicationId, recruiterId) => {
  try {
    const [rows] = await safeQuery(
      `SELECT a.id FROM applications a
       LEFT JOIN job_posts jp ON jp.id = a.job_id
       WHERE a.id = ? AND jp.recruiter_user_id = ? LIMIT 1`,
      [applicationId, recruiterId]
    );

    if (!rows.length) {
      throw new AppError('Unauthorized to modify this application', 403);
    }
  } catch (err) {
    if (err instanceof AppError) throw err;
    console.error('[APPLICATIONS SERVICE] ensureApplicationJobOwner ERROR:', err);
    throw new AppError('Authorization check failed', 500);
  }
};
