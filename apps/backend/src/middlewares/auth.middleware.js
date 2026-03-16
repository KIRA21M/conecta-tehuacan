const { verifyAccessToken } = require("../utils/jwt");
const { AppError } = require("../utils/errors");

function authRequired(req, res, next) {
  const header = req.headers.authorization || "";
  const [type, token] = header.split(" ");

  if (type !== "Bearer" || !token) {
    return next(new AppError("No autorizado", 401, [{ reason: "missing_token" }]));
  }

  try {
    req.user = verifyAccessToken(token); // { id, role, email }
    next();
  } catch {
    next(new AppError("No autorizado", 401, [{ reason: "invalid_token" }]));
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError("Acceso denegado", 403, [{ reason: "forbidden" }]));
    }
    next();
  };
}

module.exports = { authRequired, requireRole };
