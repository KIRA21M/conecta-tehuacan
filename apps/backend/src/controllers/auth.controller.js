const { ok } = require("../utils/response");
const AuthService = require("../services/auth.service");

async function register(req, res) {
  const data = await AuthService.register(req.body);
  return ok(res, { status: 201, message: data.message, data });
}

async function verifyEmail(req, res) {
  const data = await AuthService.verifyEmail(req.query.token);
  return ok(res, { message: data.message });
}

async function loginCandidate(req, res) {
  const { email, password } = req.body;
  const data = await AuthService.login({ email, password, allowedRoles: ["aspirante"] });
  return ok(res, { message: "Login exitoso", data });
}

async function loginAdmin(req, res) {
  const { email, password } = req.body;
  const data = await AuthService.login({ email, password, allowedRoles: ["reclutador", "admin"] });
  return ok(res, { message: "Login exitoso", data });
}

async function refresh(req, res) {
  const token = req.body.refreshToken || req.cookies?.refreshToken;
  const data = await AuthService.refreshToken(token);
  return ok(res, { message: "Token renovado", data });
}

async function logout(req, res) {
  const token = req.body.refreshToken || req.cookies?.refreshToken;
  await AuthService.logout(token);
  return ok(res, { message: "Sesión cerrada" });
}

module.exports = { register, verifyEmail, loginCandidate, loginAdmin, refresh, logout };
