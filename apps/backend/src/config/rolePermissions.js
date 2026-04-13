/**
 * Centralized mapping of roles to permissions and role hierarchy
 * Used by authorization middleware to validate granular permissions
 */

const ROLES = {
  aspirante: {
    permissions: [
      // Jobs
      "read_jobs", "apply_job", "view_own_applications",
      // Applications
      "create_application", "view_own_applications", "delete_own_application",
      // Favorites
      "manage_favorites",
      // Messages
      "send_message", "read_messages", "manage_own_messages",
      // Company
      "read_company_profiles", "view_featured_companies"
    ],
    hierarchy: 1,
    description: "Job candidate"
  },
  reclutador: {
    permissions: [
      // Jobs
      "read_jobs", "create_job", "update_job", "change_job_status", "manage_candidates",
      // Applications
      "view_applications", "update_application_status", "add_application_notes", "view_application_stats",
      // Messages
      "send_message", "read_messages", "manage_own_messages",
      // Company
      "create_company_profile", "update_company_profile", "view_company_stats",
      "manage_company_contacts", "manage_company_social_links", "read_company_profiles"
    ],
    hierarchy: 2,
    description: "Recruiter"
  },
  admin: {
    permissions: [
      // Jobs
      "read_jobs", "create_job", "update_job", "change_job_status", "manage_candidates", "delete_job",
      // Applications
      "view_applications", "update_application_status", "add_application_notes", 
      "view_application_stats", "delete_application",
      // Messages
      "send_message", "read_messages", "manage_own_messages", "manage_all_messages",
      // Company
      "create_company_profile", "update_company_profile", "delete_company_profile",
      "view_company_stats", "manage_company_contacts", "manage_company_social_links",
      "read_company_profiles", "manage_all_company_profiles",
      // Admin
      "manage_users", "manage_roles", "view_audit", "manage_system"
    ],
    hierarchy: 3,
    description: "Administrator"
  }
};

/**
 * Get permissions for a role
 * @param {string} role - Role name
 * @returns {string[]} Array of permission strings
 */
function getPermissions(role) {
  return ROLES[role]?.permissions || [];
}

/**
 * Check if user has a specific permission
 * @param {string} role - User role
 * @param {string} permission - Permission to check
 * @returns {boolean}
 */
function hasPermission(role, permission) {
  const permissions = getPermissions(role);
  return permissions.includes(permission);
}

/**
 * Check if a role has minimum hierarchy level
 * @param {string} role - User role
 * @param {string} minRole - Minimum required role
 * @returns {boolean}
 */
function hasMinimumRole(role, minRole) {
  const userHierarchy = ROLES[role]?.hierarchy || 0;
  const minHierarchy = ROLES[minRole]?.hierarchy || 0;
  return userHierarchy >= minHierarchy;
}

module.exports = {
  ROLES,
  getPermissions,
  hasPermission,
  hasMinimumRole
};
