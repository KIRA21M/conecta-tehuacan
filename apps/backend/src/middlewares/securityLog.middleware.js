/**
 * Security Logging Middleware
 * Tracks authentication attempts, authorization denials, and sensitive operations for audit trail
 */

/**
 * Log security-relevant events with structured format
 * Useful for auditing unauthorized access attempts and tracking user actions
 */
function securityLogger(req, res, next) {
  const startTime = Date.now();

  // Capture response finish to log after response is sent
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const isError = res.statusCode >= 400;
    const isUnauthorized = res.statusCode === 401 || res.statusCode === 403;
    const isProtectedRoute = req.path.startsWith("/api/jobs") || req.path.startsWith("/api/users") || req.path.startsWith("/api/admin");

    // Log security-relevant events
    if (isError && isProtectedRoute) {
      const logEntry = {
        timestamp: new Date().toISOString(),
        event: "security_event",
        method: req.method,
        path: req.path,
        status: res.statusCode,
        userId: req.user?.id || null,
        userRole: req.user?.role || null,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.headers["user-agent"] || "unknown",
        duration: `${duration}ms`,
        reason: res.statusCode === 401 ? "authentication_failed" : "authorization_denied"
      };

      // Determine log level based on status
      if (res.statusCode === 401) {
        console.warn("[SECURITY] Authentication attempt:", JSON.stringify(logEntry));
      } else if (res.statusCode === 403) {
        console.warn("[SECURITY] Authorization denied:", JSON.stringify(logEntry));
      }
    }

    // Log sensitive operations (POST, PATCH, DELETE on protected routes)
    if (["POST", "PATCH", "DELETE"].includes(req.method) && isProtectedRoute && res.statusCode < 400) {
      const auditEntry = {
        timestamp: new Date().toISOString(),
        event: "resource_operation",
        method: req.method,
        path: req.path,
        status: res.statusCode,
        userId: req.user?.id || null,
        userRole: req.user?.role || null,
        ip: req.ip || req.connection.remoteAddress,
        duration: `${duration}ms`
      };

      console.info("[AUDIT] Operation performed:", JSON.stringify(auditEntry));
    }
  });

  next();
}

module.exports = securityLogger;
