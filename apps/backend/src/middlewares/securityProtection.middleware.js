/**
 * Security Protection Middleware
 * Provides input sanitization, XSS prevention, and injection attack mitigation
 */

const { AppError } = require("../utils/errors");

// Content-Type validation
const ALLOWED_CONTENT_TYPES = ["application/json"];

// XSS and injection pattern detection
const SUSPICIOUS_PATTERNS = [
  /<\s*script/i,           // <script tags
  /\bon\w+\s*=/i,          // onclick, onerror, etc.
  /javascript:/i,          // javascript: protocol
  /(%3C|%3E)/i,            // URL-encoded < or >
  /(%22|%27)/i,            // URL-encoded quotes (may indicate encoding bypass)
  /union\s+select/i,       // SQL injection - UNION SELECT
  /;\s*drop/i,             // SQL injection - DROP
  /;\s*delete/i,           // SQL injection - DELETE
  /;\s*update/i            // SQL injection - UPDATE
];

/**
 * Validate Content-Type header
 * Only allow application/json for non-GET requests
 */
function validateContentType(req) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    const contentType = req.headers["content-type"] || "";
    
    if (!contentType) {
      throw new AppError("Content-Type requerido", 411, [{ reason: "missing_content_type" }]);
    }

    const isAllowed = ALLOWED_CONTENT_TYPES.some(type => contentType.includes(type));
    if (!isAllowed) {
      throw new AppError("Tipo de contenido no permitido", 415, [{ reason: "unsupported_media_type" }]);
    }
  }
}

/**
 * Validate request path against path traversal attacks
 */
function validatePath(req) {
  const path = req.originalUrl;
  
  // Detect path traversal attempts
  if (path.includes("..") || /[\u0000]/.test(path)) {
    throw new AppError("Ruta inválida", 400, [{ reason: "invalid_path" }]);
  }
}

/**
 * Recursively sanitize a value: trim strings, detect null bytes, check for suspicious patterns
 */
function sanitizeValue(value, fieldName = "input") {
  // Handle arrays
  if (Array.isArray(value)) {
    return value.map((item, idx) => sanitizeValue(item, `${fieldName}[${idx}]`));
  }

  // Handle objects
  if (value && typeof value === "object") {
    const sanitized = {};
    Object.keys(value).forEach(key => {
      sanitized[key] = sanitizeValue(value[key], `${fieldName}.${key}`);
    });
    return sanitized;
  }

  // Handle strings
  if (typeof value === "string") {
    // Check for null bytes
    if (/[\u0000]/.test(value)) {
      throw new AppError("Entrada inválida: caracteres nulos detectados", 400, [
        { reason: "invalid_characters", field: fieldName }
      ]);
    }

    // Trim whitespace
    const trimmed = value.trim();

    // Check for suspicious patterns
    for (const pattern of SUSPICIOUS_PATTERNS) {
      if (pattern.test(trimmed)) {
        throw new AppError("Entrada inválida: patrón sospechoso detectado", 400, [
          { reason: "suspicious_input", field: fieldName }
        ]);
      }
    }

    return trimmed;
  }

  // Return other types as-is (numbers, booleans, etc.)
  return value;
}

/**
 * Main security protection middleware
 */
function securityProtection(req, res, next) {
  try {
    validateContentType(req);
    validatePath(req);
    
    // Sanitize request body, query, and params
    if (req.body && Object.keys(req.body).length > 0) {
      req.body = sanitizeValue(req.body, "body");
    }
    
    if (req.query && Object.keys(req.query).length > 0) {
      req.query = sanitizeValue(req.query, "query");
    }
    
    if (req.params && Object.keys(req.params).length > 0) {
      req.params = sanitizeValue(req.params, "params");
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = securityProtection;
