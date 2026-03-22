const { ok } = require("../utils/response");
const AuthService = require("../services/auth.service");

async function register(req, res) {
  const data = await AuthService.register(req.body, {
    userAgent: req.get("user-agent"),
    ipAddress: req.ip,
  });
  return ok(res, { status: 201, message: "Registro exitoso", data });
}

// Aspirante
async function loginCandidate(req, res) {
  const { email, password } = req.body;
  const data = await AuthService.login({
    email,
    password,
    allowedRoles: ["aspirante"],
  }, {
    userAgent: req.get("user-agent"),
    ipAddress: req.ip,
  });
  return ok(res, { message: "Login exitoso", data });
}

// Reclutador/Admin
async function loginAdmin(req, res) {
  const { email, password } = req.body;
  const data = await AuthService.login({
    email,
    password,
    allowedRoles: ["reclutador", "admin"],
  }, {
    userAgent: req.get("user-agent"),
    ipAddress: req.ip,
  });
  return ok(res, { message: "Login admin exitoso", data });
}

async function logout(req, res) {
  await AuthService.logout({
    userId: req.user.id,
    sessionId: req.user.sid,
  });
  return ok(res, { message: "Logout exitoso" });
}

async function logoutAll(req, res) {
  const keepCurrent = Boolean(req.body?.keepCurrent);
  const data = await AuthService.logoutAll({
    userId: req.user.id,
    currentSessionId: req.user.sid,
    keepCurrent,
  });
  return ok(res, { message: "Sesiones cerradas", data });
}

async function listSessions(req, res) {
  const data = await AuthService.getActiveSessions(req.user.id);
  return ok(res, { message: "Sesiones activas", data });
}

module.exports = { register, loginCandidate, loginAdmin, logout, logoutAll, listSessions };