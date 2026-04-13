/**
 * Company Profile Controller
 * ==========================
 * Handle HTTP requests for company profiles
 */

const { ok } = require('../utils/response');
const { AppError } = require('../utils/errors');
const CompanyService = require('../services/company.service');

// ============================================================================
// CREATE COMPANY PROFILE
// ============================================================================

async function createCompanyProfile(req, res, next) {
  try {
    const userId = req.user.id;
    const profileData = req.body;

    const result = await CompanyService.createCompanyProfile(userId, profileData);

    console.info(`[AUDIT] Company profile created: profile_id=${result.id} by user=${userId}`);

    return ok(res, {
      status: 201,
      message: 'Company profile created',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

// ============================================================================
// GET MY COMPANY PROFILE
// ============================================================================

async function getMyCompanyProfile(req, res, next) {
  try {
    const userId = req.user.id;

    const profile = await CompanyService.getCompanyProfileByUserId(userId);

    return ok(res, {
      message: 'Your company profile',
      data: profile,
    });
  } catch (error) {
    next(error);
  }
}

// ============================================================================
// GET COMPANY PROFILE (public)
// ============================================================================

async function getCompanyProfile(req, res, next) {
  try {
    const profileId = parseInt(req.params.id);

    if (!profileId || isNaN(profileId) || profileId < 1) {
      return next(new AppError('Invalid company ID', 400));
    }

    const profile = await CompanyService.getCompanyProfile(profileId);

    return ok(res, {
      message: 'Company profile',
      data: profile,
    });
  } catch (error) {
    next(error);
  }
}

// ============================================================================
// UPDATE COMPANY PROFILE
// ============================================================================

async function updateCompanyProfile(req, res, next) {
  try {
    const userId = req.user.id;
    const updateData = req.body;

    // Get user's profile first
    const profile = await CompanyService.getCompanyProfileByUserId(userId);

    const result = await CompanyService.updateCompanyProfile(profile.id, userId, updateData);

    console.info(`[AUDIT] Company profile updated: profile_id=${profile.id} by user=${userId}`);

    return ok(res, {
      message: 'Company profile updated',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

// ============================================================================
// LIST COMPANIES (public)
// ============================================================================

async function listCompanies(req, res, next) {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);

    const result = await CompanyService.listCompanies({
      ...req.query,
      page,
      limit,
    });

    return ok(res, {
      message: 'Companies',
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
// GET FEATURED COMPANIES
// ============================================================================

async function getFeaturedCompanies(req, res, next) {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);

    const companies = await CompanyService.getFeaturedCompanies(limit);

    return ok(res, {
      message: 'Featured companies',
      data: companies,
    });
  } catch (error) {
    next(error);
  }
}

// ============================================================================
// GET COMPANY STATISTICS
// ============================================================================

async function getCompanyStats(req, res, next) {
  try {
    const userId = req.user.id;

    // Get user's profile
    const profile = await CompanyService.getCompanyProfileByUserId(userId);

    const stats = await CompanyService.getCompanyStats(profile.id);

    return ok(res, {
      message: 'Company statistics',
      data: stats,
    });
  } catch (error) {
    next(error);
  }
}

// ============================================================================
// COMPANY CONTACTS
// ============================================================================

async function addCompanyContact(req, res, next) {
  try {
    const userId = req.user.id;
    const contactData = req.body;

    // Get user's profile
    const profile = await CompanyService.getCompanyProfileByUserId(userId);

    const result = await CompanyService.addCompanyContact(profile.id, contactData);

    console.info(`[AUDIT] Company contact added: profile_id=${profile.id} by user=${userId}`);

    return ok(res, {
      status: 201,
      message: 'Contact added',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

async function getCompanyContacts(req, res, next) {
  try {
    const userId = req.user.id;

    // Get user's profile
    const profile = await CompanyService.getCompanyProfileByUserId(userId);

    const contacts = await CompanyService.getCompanyContacts(profile.id);

    return ok(res, {
      message: 'Company contacts',
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
}

// ============================================================================
// COMPANY SOCIAL LINKS
// ============================================================================

async function addSocialLink(req, res, next) {
  try {
    const userId = req.user.id;
    const { platform, url } = req.body;

    // Get user's profile
    const profile = await CompanyService.getCompanyProfileByUserId(userId);

    const result = await CompanyService.addSocialLink(profile.id, platform, url);

    console.info(`[AUDIT] Social link added: profile_id=${profile.id} platform=${platform} by user=${userId}`);

    return ok(res, {
      status: 201,
      message: 'Social link added',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

async function getSocialLinks(req, res, next) {
  try {
    const userId = req.user.id;

    // Get user's profile
    const profile = await CompanyService.getCompanyProfileByUserId(userId);

    const links = await CompanyService.getCompanySocialLinks(profile.id);

    return ok(res, {
      message: 'Social links',
      data: links,
    });
  } catch (error) {
    next(error);
  }
}

async function removeSocialLink(req, res, next) {
  try {
    const userId = req.user.id;
    const linkId = parseInt(req.params.linkId);

    if (!linkId || isNaN(linkId) || linkId < 1) {
      return next(new AppError('Invalid link ID', 400));
    }

    // Get user's profile
    const profile = await CompanyService.getCompanyProfileByUserId(userId);

    const result = await CompanyService.removeSocialLink(linkId, profile.id);

    console.info(`[AUDIT] Social link removed: link_id=${linkId} by user=${userId}`);

    return ok(res, {
      message: 'Social link removed',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

// ============================================================================
// DEACTIVATE COMPANY PROFILE
// ============================================================================

async function deactivateCompanyProfile(req, res, next) {
  try {
    const userId = req.user.id;

    // Get user's profile
    const profile = await CompanyService.getCompanyProfileByUserId(userId);

    const result = await CompanyService.deactivateCompanyProfile(profile.id, userId);

    console.info(`[AUDIT] Company profile deactivated: profile_id=${profile.id} by user=${userId}`);

    return ok(res, {
      message: 'Company profile deactivated',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  // Profile
  createCompanyProfile,
  getMyCompanyProfile,
  getCompanyProfile,
  updateCompanyProfile,
  listCompanies,
  getFeaturedCompanies,
  deactivateCompanyProfile,

  // Statistics
  getCompanyStats,

  // Contacts
  addCompanyContact,
  getCompanyContacts,

  // Social Links
  addSocialLink,
  getSocialLinks,
  removeSocialLink,
};
