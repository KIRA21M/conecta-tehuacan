const rateLimit = require("express-rate-limit");

const isDev = process.env.NODE_ENV !== "production";

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 100 : 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, message: "Demasiados intentos. Intenta en 15 minutos.", errors: [] },
  skipSuccessfulRequests: true,
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: isDev ? 100 : 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, message: "Demasiados registros desde esta IP.", errors: [] },
});

/**
 * Rate limiter para crear aplicaciones
 * Límite: 50 por hora (dev), 20 por hora (prod)
 * Previene spam de aplicaciones
 */
const createApplicationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: isDev ? 50 : 20,
  keyGenerator: (req, res) => {
    // Usar user_id del token para limitar por usuario, no por IP
    return req.user?.id || req.ip;
  },
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, message: "Has alcanzado el límite de aplicaciones por hora.", errors: [] },
  skip: (req, res) => req.user?.role === 'admin', // Admins no limitados
});

/**
 * Rate limiter para enviar mensajes
 * Límite: 100 por hora (dev), 50 por hora (prod)
 * Previene spam de mensajes
 */
const sendMessageLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: isDev ? 100 : 50,
  keyGenerator: (req, res) => req.user?.id || req.ip,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, message: "Has alcanzado el límite de mensajes por hora.", errors: [] },
  skip: (req, res) => req.user?.role === 'admin',
});

/**
 * Rate limiter para crear perfil de empresa
 * Límite: 5 por día (dev), 2 por día (prod)
 * Previene creación masiva de perfiles fake
 */
const createCompanyProfileLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 1 día
  max: isDev ? 5 : 2,
  keyGenerator: (req, res) => req.user?.id || req.ip,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, message: "Solo puedes crear un perfil de empresa por día.", errors: [] },
  skip: (req, res) => req.user?.role === 'admin',
});

/**
 * Rate limiter para actualizar perfil de empresa
 * Límite: 20 por hora (dev), 5 por hora (prod)
 * Previene modificaciones masivas
 */
const updateCompanyProfileLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: isDev ? 20 : 5,
  keyGenerator: (req, res) => req.user?.id || req.ip,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, message: "Demasiadas actualizaciones. Intenta después.", errors: [] },
  skip: (req, res) => req.user?.role === 'admin',
});

/**
 * Rate limiter para actualizar estado de aplicación
 * Límite: 100 por hora (dev), 30 por hora (prod)
 * Reclutadores necesitan actualizar múltiples aplicaciones
 */
const updateApplicationStatusLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: isDev ? 100 : 30,
  keyGenerator: (req, res) => req.user?.id || req.ip,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, message: "Demasiadas actualizaciones de estado. Intenta después.", errors: [] },
  skip: (req, res) => req.user?.role === 'admin',
});

/**
 * Rate limiter general para búsqueda (GET requests)
 * Límite: 200 por 10 minutos (dev), 100 por 10 minutos (prod)
 * Previene escaneo y scraping
 */
const searchLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutos
  max: isDev ? 200 : 100,
  keyGenerator: (req, res) => req.ip, // Por IP para búsquedas públicas
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, message: "Demasiadas búsquedas. Intenta después.", errors: [] },
});

module.exports = {
  loginLimiter,
  registerLimiter,
  createApplicationLimiter,
  sendMessageLimiter,
  createCompanyProfileLimiter,
  updateCompanyProfileLimiter,
  updateApplicationStatusLimiter,
  searchLimiter,
};
