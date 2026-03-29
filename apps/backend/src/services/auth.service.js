const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const db = require("../config/db");
const { AppError } = require("../utils/errors");
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require("../utils/jwt");

// ─── helpers ────────────────────────────────────────────────────────────────

async function findUserByEmail(email) {
  const [rows] = await db.query(
    "SELECT id, full_name, email, password_hash, role, is_active, is_verified FROM users WHERE email = ? LIMIT 1",
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

function buildTokens(user) {
  const payload = { id: user.id, role: user.role, email: user.email };
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken({ id: user.id }),
  };
}

// ─── register ───────────────────────────────────────────────────────────────

async function register({ full_name, email, password, role }) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [exists] = await conn.query("SELECT id FROM users WHERE email = ? LIMIT 1", [email]);
    if (exists.length) throw new AppError("El email ya está registrado", 409, [{ reason: "email_taken" }]);

    const password_hash = await bcrypt.hash(password, 12);
    const verification_token = crypto.randomBytes(32).toString("hex");

    const [userResult] = await conn.query(
      "INSERT INTO users (full_name, email, password_hash, role, is_active, is_verified, verification_token) VALUES (?, ?, ?, ?, 1, 0, ?)",
      [full_name, email, password_hash, role, verification_token]
    );
    const userId = userResult.insertId;

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

    // En producción: enviar verification_token por email en lugar de devolverlo
    return {
      message: "Registro exitoso. Verifica tu cuenta antes de iniciar sesión.",
      verification_token, // quitar en producción real; usar email
      user: { id: userId, full_name, email, role },
    };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

// ─── verifyEmail ─────────────────────────────────────────────────────────────

async function verifyEmail(token) {
  if (!token) throw new AppError("Token requerido", 400, [{ reason: "missing_token" }]);

  const [rows] = await db.query(
    "SELECT id FROM users WHERE verification_token = ? AND is_verified = 0 LIMIT 1",
    [token]
  );
  if (!rows.length) throw new AppError("Token inválido o ya utilizado", 400, [{ reason: "invalid_token" }]);

  await db.query(
    "UPDATE users SET is_verified = 1, verification_token = NULL WHERE id = ?",
    [rows[0].id]
  );

  return { message: "Cuenta verificada. Ya puedes iniciar sesión." };
}

// ─── login ───────────────────────────────────────────────────────────────────

async function login({ email, password, allowedRoles = [] }) {
  const user = await findUserByEmail(email);

  // Mensaje genérico para no filtrar si el email existe
  const invalidErr = new AppError("Credenciales inválidas", 401, [{ reason: "invalid_credentials" }]);

  if (!user) throw invalidErr;
  if (!user.is_active) throw new AppError("Cuenta desactivada", 401, [{ reason: "user_inactive" }]);
  if (!user.is_verified) throw new AppError("Cuenta no verificada. Revisa tu correo.", 403, [{ reason: "unverified_account" }]);
  if (allowedRoles.length && !allowedRoles.includes(user.role)) throw invalidErr;

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) throw invalidErr;

  const { accessToken, refreshToken } = buildTokens(user);

  // Guardar refresh token hasheado en DB (rotación segura)
  const tokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await db.query(
    "INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)",
    [user.id, tokenHash, expiresAt]
  );
  await db.query("UPDATE users SET last_login_at = NOW() WHERE id = ?", [user.id]);

  const profile = await getProfileByRole(user.id, user.role);

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role },
    profile,
  };
}

// ─── refreshToken ─────────────────────────────────────────────────────────────

async function refreshToken(token) {
  if (!token) throw new AppError("Refresh token requerido", 401, [{ reason: "missing_token" }]);

  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    throw new AppError("Refresh token inválido o expirado", 401, [{ reason: "invalid_refresh_token" }]);
  }

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const [rows] = await db.query(
    "SELECT id, user_id FROM refresh_tokens WHERE token_hash = ? AND expires_at > NOW() AND revoked = 0 LIMIT 1",
    [tokenHash]
  );
  if (!rows.length) throw new AppError("Refresh token inválido o revocado", 401, [{ reason: "invalid_refresh_token" }]);

  // Rotación: revocar el token actual
  await db.query("UPDATE refresh_tokens SET revoked = 1 WHERE id = ?", [rows[0].id]);

  const [userRows] = await db.query(
    "SELECT id, full_name, email, role, is_active, is_verified FROM users WHERE id = ? LIMIT 1",
    [payload.id]
  );
  const user = userRows[0];
  if (!user || !user.is_active || !user.is_verified) {
    throw new AppError("No autorizado", 401, [{ reason: "invalid_credentials" }]);
  }

  const { accessToken, refreshToken: newRefreshToken } = buildTokens(user);

  const newHash = crypto.createHash("sha256").update(newRefreshToken).digest("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await db.query(
    "INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)",
    [user.id, newHash, expiresAt]
  );

  return { accessToken, refreshToken: newRefreshToken };
}

// ─── logout ──────────────────────────────────────────────────────────────────

async function logout(token) {
  if (!token) return;
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  await db.query("UPDATE refresh_tokens SET revoked = 1 WHERE token_hash = ?", [tokenHash]);
}

// ─── forgot password ─────────────────────────────────────────────────────────

async function forgotPassword(email) {
  const user = await findUserByEmail(email);
  if (!user) {
    // Don't reveal if email exists or not for security
    return { message: "Si el correo existe, se enviará un enlace de recuperación." };
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  await db.query(
    "INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE token_hash = VALUES(token_hash), expires_at = VALUES(expires_at)",
    [user.id, tokenHash, expiresAt]
  );

  // TODO: Send email with reset link
  // For now, just return the token (in production, send email)
  console.log(`Reset token for ${email}: ${resetToken}`);

  return { message: "Si el correo existe, se enviará un enlace de recuperación." };
}

// ─── reset password ──────────────────────────────────────────────────────────

async function resetPassword(token, newPassword) {
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const [rows] = await db.query(
    "SELECT user_id, expires_at FROM password_reset_tokens WHERE token_hash = ? AND expires_at > NOW() AND used = 0 LIMIT 1",
    [tokenHash]
  );

  if (!rows[0]) {
    throw new AppError("Token inválido o expirado", 400);
  }

  const { user_id } = rows[0];

  // Hash new password
  const passwordHash = await bcrypt.hash(newPassword, 12);

  // Update password
  await db.query("UPDATE users SET password_hash = ? WHERE id = ?", [passwordHash, user_id]);

  // Mark token as used
  await db.query("UPDATE password_reset_tokens SET used = 1 WHERE token_hash = ?", [tokenHash]);

  return { message: "Contraseña cambiada exitosamente" };
}

module.exports = { register, verifyEmail, login, refreshToken, logout, forgotPassword, resetPassword };
