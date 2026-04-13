/**
 * Authentication Middleware
 * Validates JWT tokens and ensures users are authenticated for protected routes
 */

const { verifyAccessToken } = require("../utils/jwt");
const { AppError } = require("../utils/errors");

/**
 * Extract Bearer token from Authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} Token string or null if invalid
 */
function _extractBearerToken(authHeader) {
  if (!authHeader || typeof authHeader !== "string") {
    return null;
  }

  const [type, token] = authHeader.split(" ");
  return type === "Bearer" && token ? token : null;
}

/**
 * Middleware: Require valid JWT token
 * Validates token signature and expiration; attaches user to req.user
 */
function authRequired(req, res, next) {
  const token = _extractBearerToken(req.headers.authorization);

  if (!token) {
    return next(new AppError("No autorizado", 401, [{ reason: "missing_token" }]));
  }

  try {
    req.user = verifyAccessToken(token); // { id, role, email }
    next();
  } catch (error) {
    // Differentiate between expired and invalid tokens
    const reason = error.name === "TokenExpiredError" ? "token_expired" : "invalid_token";
    return next(new AppError("No autorizado", 401, [{ reason }]));
  }
}

/**
 * Middleware: Optional authentication
 * Attaches user to req.user if token is valid; does not fail if token missing
 * Useful for routes that have different behavior based on authentication state
 */
function optionalAuth(req, res, next) {
  const token = _extractBearerToken(req.headers.authorization);

  if (!token) {
    return next();
  }

  try {
    req.user = verifyAccessToken(token);
  } catch (error) {
    // Token is invalid but request continues (optional)
    req.user = null;
  }

  next();
}

/**
 * Middleware: Require specific role(s)
 * Used with authRequired to enforce role-based access control
 * @param {...string|string[]} roles - Allowed role names (as individual args or an array)
 */
function requireRole(...roles) {
  // Flatten roles in case an array was passed as the first argument
  const allowedRoles = Array.isArray(roles[0]) ? roles[0] : roles;

  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("No autorizado", 401, [{ reason: "unauthenticated" }]));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError("Acceso denegado", 403, [{ reason: "forbidden" }]));
    }

    next();
  };
}

module.exports = { authRequired, optionalAuth, requireRole };
