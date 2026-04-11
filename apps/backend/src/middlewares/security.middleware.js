/**
 * Security Middleware
 * Proporciona protecciones adicionales contra ataques comunes
 */

/**
 * Middleware para detectar y loguear intentos de SQL injection
 * Detecta patrones comunes de SQL injection en query strings
 */
const detectSQLInjection = (req, res, next) => {
  const sqlInjectionPatterns = [
    /(\bunion\b.*\bselect\b)|(\bor\b\s*'?1'?\s*=\s*'?1'?)|(\bdrop\b.*\btable\b)|(--$|;$|\/\*.*\*\/)/gi,
    /('|")\s*(or|and)\s*('|")?1('|")?.*=.*('|")?1('|")?/gi,
    /xp_|sp_|exec|execute|script|javascript|onerror|onload/gi,
  ];

  const checkString = (str) => {
    if (typeof str !== 'string') return false;
    return sqlInjectionPatterns.some((pattern) => pattern.test(str));
  };

  // Verificar query string
  for (const key in req.query) {
    if (checkString(req.query[key])) {
      console.warn(
        `[SECURITY] Possible SQL injection attempt in query: ${key}=${req.query[key]}`,
        `IP: ${req.ip}`
      );
      return res.status(400).json({
        ok: false,
        message: 'Invalid input detected',
        errors: [],
      });
    }
  }

  // Verificar URL params
  for (const key in req.params) {
    if (checkString(req.params[key])) {
      console.warn(
        `[SECURITY] Possible SQL injection attempt in params: ${key}=${req.params[key]}`,
        `IP: ${req.ip}`
      );
      return res.status(400).json({
        ok: false,
        message: 'Invalid input detected',
        errors: [],
      });
    }
  }

  next();
};

/**
 * Middleware para detectar intentos de XSS
 * Detecta scripts, event handlers, y payloads comunes
 */
const detectXSS = (req, res, next) => {
  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi, // onerror=, onclick=, etc
    /<iframe[^>]*>/gi,
    /<embed[^>]*>/gi,
    /<object[^>]*>/gi,
    /eval\s*\(/gi,
    /expression\s*\(/gi,
  ];

  const checkString = (str) => {
    if (typeof str !== 'string') return false;
    return xssPatterns.some((pattern) => pattern.test(str));
  };

  // Verificar body
  if (req.body) {
    for (const key in req.body) {
      if (checkString(req.body[key])) {
        console.warn(
          `[SECURITY] Possible XSS attempt in body: ${key}`,
          `IP: ${req.ip}`
        );
        return res.status(400).json({
          ok: false,
          message: 'Invalid input detected',
          errors: [],
        });
      }
    }
  }

  next();
};

/**
 * Middleware para loguear intentos de acceso no autorizado
 * Registra todos los 403 Forbidden para análisis
 */
const logUnauthorizedAttempts = (err, req, res, next) => {
  if (err.status === 403 || err.statusCode === 403) {
    console.warn(
      `[SECURITY] Unauthorized access attempt: ${req.method} ${req.path}`,
      `User: ${req.user?.id || 'anonymous'}`,
      `IP: ${req.ip}`,
      `Reason: ${err.message}`
    );
  }
  next(err);
};

/**
 * Middleware para validar que los headers no contengan ataques
 */
const validateHeaders = (req, res, next) => {
  const suspiciousHeaders = ['x-forwarded-for', 'x-original-url', 'x-rewrite-url'];
  
  for (const header of suspiciousHeaders) {
    const value = req.get(header);
    if (value && /script|eval|javascript/i.test(value)) {
      console.warn(
        `[SECURITY] Suspicious header detected: ${header}`,
        `IP: ${req.ip}`
      );
      return res.status(400).json({
        ok: false,
        message: 'Invalid headers',
        errors: [],
      });
    }
  }

  next();
};

/**
 * Middleware para establecer headers de seguridad adicionales
 * (Helmet ya lo hace, esto es redundante pero explícito)
 */
const setSecurityHeaders = (req, res, next) => {
  // Prevenir MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Prevenir clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Habilitar XSS filter del navegador
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Content Security Policy básico
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
  );

  next();
};

/**
 * Middleware para sanitizar input de números (ID parameters)
 * Valida que IDs sean números válidos
 */
const sanitizeNumericParams = (req, res, next) => {
  const numericPatterns = /^\d+$/;
  
  for (const key in req.params) {
    const value = req.params[key];
    
    // Si parece ser un ID (termina en 'id' o 'Id'), debe ser numérico
    if ((key.toLowerCase().includes('id') || key.match(/^\d+$/)) && value) {
      if (!numericPatterns.test(value)) {
        console.warn(
          `[SECURITY] Invalid numeric parameter: ${key}=${value}`,
          `IP: ${req.ip}`
        );
        return res.status(400).json({
          ok: false,
          message: 'Invalid parameter format',
          errors: [{ param: key, msg: 'Must be a valid number' }],
        });
      }
    }
  }

  next();
};

/**
 * Middleware para validar Content-Type
 * Solo acepta JSON para endpoints que lo requieren
 */
const validateContentType = (req, res, next) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.get('Content-Type');
    
    if (contentType && !contentType.includes('application/json')) {
      console.warn(
        `[SECURITY] Invalid Content-Type: ${contentType}`,
        `Endpoint: ${req.method} ${req.path}`,
        `IP: ${req.ip}`
      );
      return res.status(415).json({
        ok: false,
        message: 'Content-Type must be application/json',
        errors: [],
      });
    }
  }

  next();
};

module.exports = {
  detectSQLInjection,
  detectXSS,
  logUnauthorizedAttempts,
  validateHeaders,
  setSecurityHeaders,
  sanitizeNumericParams,
  validateContentType,
};
