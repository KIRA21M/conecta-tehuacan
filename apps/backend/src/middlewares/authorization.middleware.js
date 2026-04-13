/**
 * Authorization middleware for permission and resource ownership validation
 * Provides granular permission checks beyond simple role-based access
 */

const { AppError } = require("../utils/errors");
const { hasPermission, hasMinimumRole, getPermissions } = require("../config/rolePermissions");

/**
 * Middleware: Require specific permission
 * @param {string} permission - Permission name to require
 * @returns {Function} Express middleware
 */
function requirePermission(permission) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("No autorizado", 401, [{ reason: "unauthenticated" }]));
    }

    if (!hasPermission(req.user.role, permission)) {
      return next(new AppError("Acceso denegado", 403, [{ reason: "insufficient_permissions" }]));
    }

    next();
  };
}

/**
 * Middleware: Require minimum role hierarchy level
 * @param {string} minRole - Minimum role required (aspirante < reclutador < admin)
 * @returns {Function} Express middleware
 */
function requireMinimumRole(minRole) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("No autorizado", 401, [{ reason: "unauthenticated" }]));
    }

    if (!hasMinimumRole(req.user.role, minRole)) {
      return next(new AppError("Acceso denegado", 403, [{ reason: "insufficient_role" }]));
    }

    next();
  };
}

/**
 * Middleware: Validate resource ownership or admin access
 * Ensures only the owner of a resource (or admin) can modify it
 * @param {string} resourceOwnerField - Field name in params containing owner ID (default: 'id')
 * @param {string} userRefField - Field in request that contains user ID (default: 'user.id')
 * @returns {Function} Express middleware
 */
function requireOwnership(resourceOwnerField = "userId", userRefField = "user.id") {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("No autorizado", 401, [{ reason: "unauthenticated" }]));
    }

    // Admin bypass ownership check
    if (req.user.role === "admin") {
      return next();
    }

    // Extract owner ID from params or body
    const ownerId = req.params[resourceOwnerField] || req.body[resourceOwnerField];

    if (ownerId === undefined || ownerId === null) {
      return next(new AppError("Recurso inválido", 400, [{ reason: "missing_resource_owner" }]));
    }

    // Compare IDs as strings to handle type variations
    if (String(req.user.id) !== String(ownerId)) {
      return next(new AppError("No tienes acceso a este recurso", 403, [{ reason: "ownership_required" }]));
    }

    next();
  };
}

module.exports = {
  requirePermission,
  requireMinimumRole,
  requireOwnership
};
