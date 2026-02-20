const bcrypt = require("bcryptjs");
const db = require("../config/db");
const { AppError } = require("../utils/errors");
const { signAccessToken } = require("../utils/jwt");

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

async function register({ full_name, email, password, role }) {
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

    // 5) Emitir JWT (opcional pero útil)
    const token = signAccessToken({ id: userId, role, email });

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

async function login({ email, password, allowedRoles = [] }) {
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

  const token = signAccessToken({ id: user.id, role: user.role, email: user.email });
  const profile = await getProfileByRole(user.id, user.role);

  return {
    token,
    user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role },
    profile,
  };
}

module.exports = { register, login };