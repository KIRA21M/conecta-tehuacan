const { ok } = require("../utils/response");
const AuthService = require("../services/auth.service");

async function register(req, res) {
  const data = await AuthService.register(req.body);
  return ok(res, { status: 201, message: "Registro exitoso", data });
}

// Aspirante
async function loginCandidate(req, res) {
  const { email, password } = req.body;
  const data = await AuthService.login({
    email,
    password,
    allowedRoles: ["aspirante"],
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
  });
  return ok(res, { message: "Login admin exitoso", data });
}

module.exports = { register, loginCandidate, loginAdmin };