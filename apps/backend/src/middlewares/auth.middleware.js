const { verifyAccessToken } = require("../utils/jwt");
const { AppError } = require("../utils/errors");

function authRequired(req, res, next) {
  const header = req.headers.authorization || "";
  const [type, token] = header.split(" ");

  if (type !== "Bearer" || !token) {
    throw new AppError("No autorizado", 401, [{ reason: "missing_token" }]);
  }

  try {
    req.user = verifyAccessToken(token); // { id, role, email }
    next();
  } catch {
    throw new AppError("No autorizado", 401, [{ reason: "invalid_token" }]);
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new AppError("No autorizado", 403, [{ reason: "forbidden" }]);
    }
    next();
  };
}

module.exports = { authRequired, requireRole };