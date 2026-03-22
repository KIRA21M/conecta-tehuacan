const bcrypt = require("bcryptjs");
const db = require("../config/db");
const { AppError } = require("../utils/errors");
const { signAccessToken, decodeToken } = require("../utils/jwt");
const SessionService = require("./session.service");

async function findUserByEmail(email) {
  const [rows] = await db.query(
    "SELECT id, full_name, email, password_hash, role, is_active FROM users WHERE email = ? LIMIT 1",
    [email]
  );
  return rows[0] || null;
}

async function getProfileByRole(userId, role) {
  if (role === "aspirante") {
    const [rows] = await db.query(
      "SELECT about, headline, location, phone, avatar_url FROM candidate_profiles WHERE user_id = ? LIMIT 1",
      [userId]
    );
    return rows[0] ? { type: "aspirante", ...rows[0] } : null;
  }

  if (role === "reclutador") {
    const [rows] = await db.query(
      "SELECT company_name, company_website, phone, location, about_company FROM recruiter_profiles WHERE user_id = ? LIMIT 1",
      [userId]
    );
    return rows[0] ? { type: "reclutador", ...rows[0] } : null;
  }

  return null;
}

async function register({ full_name, email, password, role }, context = {}) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // 1) Email único
    const [exists] = await conn.query("SELECT id FROM users WHERE email = ? LIMIT 1", [email]);
    if (exists.length) {
      throw new AppError("El email ya está registrado", 409, [{ reason: "email_taken" }]);
    }

    // 2) Hash de contraseña
    const password_hash = await bcrypt.hash(password, 10);

    // 3) Insert usuario
    const [userResult] = await conn.query(
      "INSERT INTO users (full_name, email, password_hash, role, is_active) VALUES (?, ?, ?, ?, 1)",
      [full_name, email, password_hash, role]
    );
    const userId = userResult.insertId;

    // 4) Crear perfil mínimo según rol
    if (role === "aspirante") {
      await conn.query(
        "INSERT INTO candidate_profiles (user_id, about, headline, location, phone, avatar_url) VALUES (?, NULL, NULL, NULL, NULL, NULL)",
        [userId]
      );
    } else if (role === "reclutador") {
      await conn.query(
        "INSERT INTO recruiter_profiles (user_id, company_name, company_website, phone, location, about_company) VALUES (?, NULL, NULL, NULL, NULL, NULL)",
        [userId]
      );
    }

    await conn.commit();

    // 5) Emitir JWT y sesión persistente
    const sessionId = SessionService.generateSessionId();
    const token = signAccessToken({ id: userId, role, email, sid: sessionId });
    const tokenPayload = decodeToken(token);
    await SessionService.createSession({
      userId,
      sessionId,
      token,
      tokenExp: tokenPayload.exp,
      userAgent: context.userAgent,
      ipAddress: context.ipAddress,
    });

    return {
      token,
      user: { id: userId, full_name, email, role },
      profile: await getProfileByRole(userId, role),
    };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

async function login({ email, password, allowedRoles = [] }, context = {}) {
  const user = await findUserByEmail(email);

  // Error genérico para no filtrar si el email existe
  if (!user) {
    throw new AppError("Credenciales inválidas", 401, [{ reason: "invalid_credentials" }]);
  }

  if (!user.is_active) {
    throw new AppError("Usuario desactivado", 401, [{ reason: "user_inactive" }]);
  }

  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    throw new AppError("Credenciales inválidas", 401, [{ reason: "invalid_credentials" }]);
  }

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    throw new AppError("Credenciales inválidas", 401, [{ reason: "invalid_credentials" }]);
  }

  await db.query("UPDATE users SET last_login_at = NOW() WHERE id = ?", [user.id]);

  const sessionId = SessionService.generateSessionId();
  const token = signAccessToken({ id: user.id, role: user.role, email: user.email, sid: sessionId });
  const tokenPayload = decodeToken(token);
  await SessionService.createSession({
    userId: user.id,
    sessionId,
    token,
    tokenExp: tokenPayload.exp,
    userAgent: context.userAgent,
    ipAddress: context.ipAddress,
  });
  const profile = await getProfileByRole(user.id, user.role);

  return {
    token,
    user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role },
    profile,
  };
}

async function logout({ userId, sessionId }) {
  const revoked = await SessionService.revokeSession({ userId, sessionId, reason: "logout" });
  if (!revoked) {
    throw new AppError("Sesión no encontrada o ya inválida", 404, [{ reason: "session_not_found" }]);
  }
}

async function logoutAll({ userId, currentSessionId, keepCurrent = false }) {
  const affected = await SessionService.revokeAllUserSessions({
    userId,
    exceptSessionId: keepCurrent ? currentSessionId : null,
    reason: "logout_all",
  });

  return { revokedSessions: affected };
}

async function getActiveSessions(userId) {
  const sessions = await SessionService.listActiveSessions(userId);
  return { sessions };
}

module.exports = { register, login, logout, logoutAll, getActiveSessions };