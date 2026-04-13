/**
 * Centralized Error Handler Middleware
 * Catches all errors and responds with appropriate status and sanitized messages
 * In production, details are hidden to prevent information disclosure
 */

const { fail } = require("../utils/response");

module.exports = (err, req, res, next) => {
  const status = err.status || 500;
  let message = err.message || "Internal Server Error";
  let errors = err.errors || [];

  // SECURITY: In production, sanitize error details to prevent information disclosure
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    // Hide implementation details in production
    if (status === 500) {
      message = "Error interno del servidor";
      errors = []; // Don't expose internal errors
    } else if (status === 401 || status === 403) {
      // Keep auth error messages generic
      message = message || "Acceso denegado";
    }
    // For other errors, use the message but sanitize errors array
    errors = errors.filter(e => e.reason) // Keep only reason, remove details
      .map(e => ({ reason: e.reason }));
  } else {
    // In development, log full error for debugging
    console.error("[ERROR]", err.stack);
  }

  return fail(res, {
    status,
    message,
    errors
  });
};