/**
 * Company Profiles Service
 * ========================
 * Business logic for company/recruiter profiles
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
    console.error('[COMPANY SERVICE] SQL ERROR:', err);
    throw new AppError('Database error', 500);
  }
}

/**
 * Build WHERE clause for company filtering
 */
function buildCompanyFilters(filters) {
  const { page = 1, limit = 20, q, industry, company_size, verified } = filters;

  const where = ['cp.is_active = 1'];
  const params = [];

  if (q) {
    where.push('MATCH(cp.company_name,cp.description) AGAINST (? IN NATURAL LANGUAGE MODE)');
    params.push(q);
  }

  if (industry) {
    where.push('cp.industry = ?');
    params.push(industry);
  }

  if (company_size) {
    where.push('cp.company_size = ?');
    params.push(company_size);
  }

  if (verified !== undefined) {
    where.push('cp.verified = ?');
    params.push(verified ? 1 : 0);
  }

  return {
    whereSql: where.length ? `WHERE ${where.join(' AND ')}` : '',
    params,
    page: Number(page),
    limit: Number(limit),
  };
}

// ============================================================================
// CREATE COMPANY PROFILE
// ============================================================================

/**
 * Create company profile for a recruiter
 */
exports.createCompanyProfile = async (userId, profileData) => {
  if (!userId || !profileData.company_name) {
    throw new AppError('userId and company_name are required', 400);
  }

  try {
    // Check if user already has a profile
    const [existing] = await safeQuery(
      'SELECT id FROM company_profiles WHERE user_id = ? LIMIT 1',
      [userId]
    );

    if (existing.length) {
      throw new AppError('User already has a company profile', 409);
    }

    // Verify user exists and is recruiter/admin
    const [userRows] = await safeQuery(
      'SELECT id, role FROM users WHERE id = ? AND role IN ("reclutador", "admin") LIMIT 1',
      [userId]
    );

    if (!userRows.length) {
      throw new AppError('User not found or not authorized to create profile', 404);
    }

    const {
      company_name,
      description,
      website,
      phone,
      logo_url,
      banner_url,
      industry,
      company_size,
      founded_year,
      headquarters_location,
    } = profileData;

    const [result] = await safeQuery(
      `INSERT INTO company_profiles 
       (user_id, company_name, description, website, phone, logo_url, banner_url, 
        industry, company_size, founded_year, headquarters_location, verified, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 1, NOW(), NOW())`,
      [
        userId,
        company_name,
        description || null,
        website || null,
        phone || null,
        logo_url || null,
        banner_url || null,
        industry || null,
        company_size || null,
        founded_year || null,
        headquarters_location || null,
      ]
    );

    console.log('[AUDIT] Company profile created:', { profileId: result.insertId, userId });

    return { id: result.insertId };
  } catch (err) {
    if (err instanceof AppError) throw err;
    console.error('[COMPANY SERVICE] createCompanyProfile ERROR:', err);
    throw new AppError('Failed to create company profile', 500);
  }
};

// ============================================================================
// GET COMPANY PROFILE
// ============================================================================

/**
 * Get company profile by ID (public view with reduced data for unauthorized)
 */
exports.getCompanyProfile = async (profileId, requestUserId = null) => {
  try {
    const [rows] = await safeQuery(
      `SELECT cp.*, 
              cs.active_jobs, cs.total_views, cs.total_applications, cs.accepted_applications,
              u.full_name as recruiter_name, u.email as recruiter_email
       FROM company_profiles cp
       LEFT JOIN company_stats cs ON cs.company_profile_id = cp.id
       LEFT JOIN users u ON u.id = cp.user_id
       WHERE cp.id = ? AND cp.is_active = 1 LIMIT 1`,
      [profileId]
    );

    if (!rows.length) {
      throw new AppError('Company profile not found', 404);
    }

    return rows[0];
  } catch (err) {
    if (err instanceof AppError) throw err;
    console.error('[COMPANY SERVICE] getCompanyProfile ERROR:', err);
    throw new AppError('Failed to fetch company profile', 500);
  }
};

/**
 * Get company profile by user ID
 */
exports.getCompanyProfileByUserId = async (userId) => {
  try {
    const [rows] = await safeQuery(
      `SELECT cp.*, 
              cs.active_jobs, cs.total_views, cs.total_applications, cs.accepted_applications,
              u.full_name as recruiter_name, u.email as recruiter_email
       FROM company_profiles cp
       LEFT JOIN company_stats cs ON cs.company_profile_id = cp.id
       LEFT JOIN users u ON u.id = cp.user_id
       WHERE cp.user_id = ? AND cp.is_active = 1 LIMIT 1`,
      [userId]
    );

    if (!rows.length) {
      throw new AppError('Company profile not found', 404);
    }

    return rows[0];
  } catch (err) {
    if (err instanceof AppError) throw err;
    console.error('[COMPANY SERVICE] getCompanyProfileByUserId ERROR:', err);
    throw new AppError('Failed to fetch company profile', 500);
  }
};

// ============================================================================
// UPDATE COMPANY PROFILE
// ============================================================================

/**
 * Update company profile
 */
exports.updateCompanyProfile = async (profileId, userId, updateData) => {
  try {
    // Verify ownership
    const profile = await exports.getCompanyProfile(profileId, userId);
    
    if (profile.user_id !== userId) {
      throw new AppError('Unauthorized to update this profile', 403);
    }

    const fields = [];
    const params = [];

    const allowed = [
      'company_name',
      'description',
      'website',
      'phone',
      'logo_url',
      'banner_url',
      'industry',
      'company_size',
      'founded_year',
      'headquarters_location',
    ];

    for (const key of allowed) {
      if (updateData[key] !== undefined) {
        fields.push(`${key} = ?`);
        params.push(updateData[key]);
      }
    }

    if (!fields.length) {
      throw new AppError('Nothing to update', 400);
    }

    params.push(profileId);

    await safeQuery(
      `UPDATE company_profiles SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`,
      params
    );

    console.log('[AUDIT] Company profile updated:', { profileId, userId });

    return { updated: true };
  } catch (err) {
    if (err instanceof AppError) throw err;
    console.error('[COMPANY SERVICE] updateCompanyProfile ERROR:', err);
    throw new AppError('Failed to update company profile', 500);
  }
};

// ============================================================================
// LIST COMPANIES (Public)
// ============================================================================

/**
 * List companies with filtering and pagination
 */
exports.listCompanies = async (filters = {}) => {
  try {
    const { whereSql, params, page, limit } = buildCompanyFilters(filters);
    const offset = (page - 1) * limit;

    const [rows] = await safeQuery(
      `SELECT cp.id, cp.user_id, cp.company_name, cp.description, cp.website, cp.logo_url,
              cp.industry, cp.company_size, cp.rating, cp.verified, cp.created_at,
              cs.active_jobs, cs.total_applications,
              COUNT(*) OVER() as total
       FROM company_profiles cp
       LEFT JOIN company_stats cs ON cs.company_profile_id = cp.id
       ${whereSql}
       ORDER BY cp.rating DESC, cp.created_at DESC
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
    console.error('[COMPANY SERVICE] listCompanies ERROR:', err);
    throw new AppError('Failed to fetch companies', 500);
  }
};

// ============================================================================
// COMPANY STATISTICS
// ============================================================================

/**
 * Get company statistics
 */
exports.getCompanyStats = async (profileId) => {
  try {
    const [rows] = await safeQuery(
      `SELECT * FROM company_stats WHERE company_profile_id = ? LIMIT 1`,
      [profileId]
    );

    if (!rows.length) {
      // Create default stats if not exists
      await safeQuery(
        'INSERT INTO company_stats (company_profile_id) VALUES (?)',
        [profileId]
      );
      return {
        company_profile_id: profileId,
        active_jobs: 0,
        total_views: 0,
        total_applications: 0,
        accepted_applications: 0,
        rejected_applications: 0,
        pending_applications: 0,
      };
    }

    return rows[0];
  } catch (err) {
    if (err instanceof AppError) throw err;
    console.error('[COMPANY SERVICE] getCompanyStats ERROR:', err);
    throw new AppError('Failed to fetch company statistics', 500);
  }
};

/**
 * Update company statistics (called after job/application operations)
 */
exports.updateCompanyStats = async (profileId) => {
  try {
    // Get current counts
    const [jobRows] = await safeQuery(
      `SELECT COUNT(*) as active_jobs FROM job_posts 
       WHERE recruiter_user_id = (SELECT user_id FROM company_profiles WHERE id = ?) 
       AND is_active = 1`,
      [profileId]
    );

    const [appRows] = await safeQuery(
      `SELECT 
        COUNT(*) as total_applications,
        SUM(CASE WHEN a.status = 'accepted' THEN 1 ELSE 0 END) as accepted_applications,
        SUM(CASE WHEN a.status = 'rejected' THEN 1 ELSE 0 END) as rejected_applications,
        SUM(CASE WHEN a.status = 'pending' THEN 1 ELSE 0 END) as pending_applications
       FROM applications a
       LEFT JOIN job_posts jp ON jp.id = a.job_id
       WHERE jp.recruiter_user_id = (SELECT user_id FROM company_profiles WHERE id = ?)
       AND a.is_active = 1`,
      [profileId]
    );

    const activeJobs = jobRows[0] ? jobRows[0].active_jobs : 0;
    const statsData = appRows[0] || {};

    // Update stats
    await safeQuery(
      `UPDATE company_stats SET 
       active_jobs = ?,
       total_applications = ?,
       accepted_applications = ?,
       rejected_applications = ?,
       pending_applications = ?,
       last_updated = NOW()
       WHERE company_profile_id = ?`,
      [
        activeJobs,
        statsData.total_applications || 0,
        statsData.accepted_applications || 0,
        statsData.rejected_applications || 0,
        statsData.pending_applications || 0,
        profileId,
      ]
    );

    return { updated: true };
  } catch (err) {
    if (err instanceof AppError) throw err;
    console.error('[COMPANY SERVICE] updateCompanyStats ERROR:', err);
    throw new AppError('Failed to update statistics', 500);
  }
};

// ============================================================================
// COMPANY CONTACTS
// ============================================================================

/**
 * Add company contact
 */
exports.addCompanyContact = async (profileId, contactData) => {
  try {
    // Verify profile exists
    const profile = await exports.getCompanyProfile(profileId);
    if (!profile) {
      throw new AppError('Company profile not found', 404);
    }

    const { contact_name, contact_email, contact_phone, position, is_primary } = contactData;

    const [result] = await safeQuery(
      `INSERT INTO company_contacts 
       (company_profile_id, contact_name, contact_email, contact_phone, position, is_primary, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [profileId, contact_name, contact_email, contact_phone || null, position || null, is_primary ? 1 : 0]
    );

    return { id: result.insertId };
  } catch (err) {
    if (err instanceof AppError) throw err;
    console.error('[COMPANY SERVICE] addCompanyContact ERROR:', err);
    throw new AppError('Failed to add contact', 500);
  }
};

/**
 * Get company contacts
 */
exports.getCompanyContacts = async (profileId) => {
  try {
    const [rows] = await safeQuery(
      `SELECT * FROM company_contacts WHERE company_profile_id = ? ORDER BY is_primary DESC, created_at ASC`,
      [profileId]
    );

    return rows;
  } catch (err) {
    if (err instanceof AppError) throw err;
    console.error('[COMPANY SERVICE] getCompanyContacts ERROR:', err);
    throw new AppError('Failed to fetch contacts', 500);
  }
};

// ============================================================================
// COMPANY SOCIAL LINKS
// ============================================================================

/**
 * Add social link to company profile
 */
exports.addSocialLink = async (profileId, platform, url) => {
  try {
    const profile = await exports.getCompanyProfile(profileId);
    if (!profile) {
      throw new AppError('Company profile not found', 404);
    }

    const [result] = await safeQuery(
      `INSERT INTO company_social_links (company_profile_id, platform, url, created_at, updated_at)
       VALUES (?, ?, ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE url = ?, updated_at = NOW()`,
      [profileId, platform, url, url]
    );

    return { id: result.insertId };
  } catch (err) {
    if (err instanceof AppError) throw err;
    console.error('[COMPANY SERVICE] addSocialLink ERROR:', err);
    throw new AppError('Failed to add social link', 500);
  }
};

/**
 * Get company social links
 */
exports.getCompanySocialLinks = async (profileId) => {
  try {
    const [rows] = await safeQuery(
      `SELECT * FROM company_social_links WHERE company_profile_id = ? ORDER BY created_at ASC`,
      [profileId]
    );

    return rows;
  } catch (err) {
    if (err instanceof AppError) throw err;
    console.error('[COMPANY SERVICE] getCompanySocialLinks ERROR:', err);
    throw new AppError('Failed to fetch social links', 500);
  }
};

/**
 * Remove social link
 */
exports.removeSocialLink = async (linkId, profileId) => {
  try {
    // Verify ownership
    const [rows] = await safeQuery(
      'SELECT id FROM company_social_links WHERE id = ? AND company_profile_id = ? LIMIT 1',
      [linkId, profileId]
    );

    if (!rows.length) {
      throw new AppError('Social link not found', 404);
    }

    await safeQuery('DELETE FROM company_social_links WHERE id = ?', [linkId]);

    return { deleted: true };
  } catch (err) {
    if (err instanceof AppError) throw err;
    console.error('[COMPANY SERVICE] removeSocialLink ERROR:', err);
    throw new AppError('Failed to remove social link', 500);
  }
};

// ============================================================================
// SEARCH & DISCOVERY
// ============================================================================

/**
 * Get featured companies (highest rated, verified)
 */
exports.getFeaturedCompanies = async (limit = 10) => {
  try {
    const [rows] = await safeQuery(
      `SELECT cp.id, cp.company_name, cp.logo_url, cp.rating, cp.verified,
              cs.active_jobs, cs.total_applications
       FROM company_profiles cp
       LEFT JOIN company_stats cs ON cs.company_profile_id = cp.id
       WHERE cp.is_active = 1 AND cp.verified = 1
       ORDER BY cp.rating DESC, cp.total_jobs_posted DESC
       LIMIT ?`,
      [limit]
    );

    return rows;
  } catch (err) {
    if (err instanceof AppError) throw err;
    console.error('[COMPANY SERVICE] getFeaturedCompanies ERROR:', err);
    throw new AppError('Failed to fetch featured companies', 500);
  }
};

// ============================================================================
// DEACTIVATE/DELETE
// ============================================================================

/**
 * Deactivate company profile
 */
exports.deactivateCompanyProfile = async (profileId, userId) => {
  try {
    const profile = await exports.getCompanyProfile(profileId, userId);

    if (profile.user_id !== userId) {
      throw new AppError('Unauthorized', 403);
    }

    await safeQuery(
      'UPDATE company_profiles SET is_active = 0, updated_at = NOW() WHERE id = ?',
      [profileId]
    );

    console.log('[AUDIT] Company profile deactivated:', { profileId, userId });

    return { deactivated: true };
  } catch (err) {
    if (err instanceof AppError) throw err;
    console.error('[COMPANY SERVICE] deactivateCompanyProfile ERROR:', err);
    throw new AppError('Failed to deactivate profile', 500);
  }
};
