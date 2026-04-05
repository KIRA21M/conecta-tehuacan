/**
 * Centralized mapping of roles to permissions and role hierarchy
 * Used by authorization middleware to validate granular permissions
 */

const ROLES = {
  aspirante: {
    permissions: ["read_jobs", "apply_job", "view_own_applications"],
    hierarchy: 1,
    description: "Job candidate"
  },
  reclutador: {
    permissions: ["read_jobs", "create_job", "update_job", "change_job_status", "manage_candidates"],
    hierarchy: 2,
    description: "Recruiter"
  },
  admin: {
    permissions: ["read_jobs", "create_job", "update_job", "change_job_status", "manage_candidates", "manage_users", "manage_roles", "view_audit"],
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
