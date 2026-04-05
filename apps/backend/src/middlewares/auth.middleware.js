const { verifyAccessToken } = require("../utils/jwt");
const { AppError } = require("../utils/errors");
const SessionService = require("../services/session.service");

async function authRequired(req, res, next) {
  const header = req.headers.authorization || "";
  const [type, token] = header.split(" ");

  if (type !== "Bearer" || !token) {
    throw new AppError("No autorizado", 401, [{ reason: "missing_token" }]);
  }

  try {
    const payload = verifyAccessToken(token); // { id, role, email, sid }
    if (!payload.sid) {
      throw new AppError("No autorizado", 401, [{ reason: "missing_session_id" }]);
    }

    await SessionService.validateSession({
      userId: payload.id,
      sessionId: payload.sid,
      token,
    });

    req.user = payload;
    next();
  } catch (error) {
    next(error.status ? error : new AppError("No autorizado", 401, [{ reason: "invalid_token" }]));
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