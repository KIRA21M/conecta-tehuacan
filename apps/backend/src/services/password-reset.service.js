const crypto = require("crypto");
const db = require("../config/db");
const { AppError } = require("../utils/errors");

let tableEnsured = false;

function generateResetToken() {
  return crypto.randomBytes(32).toString("hex");
}

function hashResetToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

async function ensurePasswordResetsTable() {
  if (tableEnsured) return;

  await db.query(`
    CREATE TABLE IF NOT EXISTS password_resets (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      user_id BIGINT UNSIGNED NOT NULL,
      reset_token_hash CHAR(64) NOT NULL,
      email VARCHAR(255) NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME NOT NULL,
      used_at DATETIME NULL,
      PRIMARY KEY (id),
      UNIQUE KEY uniq_reset_token_hash (reset_token_hash),
      KEY idx_user_email (user_id, email),
      KEY idx_expires_at (expires_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  tableEnsured = true;
}

async function createResetToken({ userId, email }) {
  await ensurePasswordResetsTable();

  const resetToken = generateResetToken();
  const resetTokenHash = hashResetToken(resetToken);
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

  await db.query(
    `INSERT INTO password_resets
      (user_id, reset_token_hash, email, expires_at)
     VALUES (?, ?, ?, ?)`,
    [userId, resetTokenHash, email, expiresAt]
  );

  return resetToken;
}

async function validateResetToken({ token }) {
  await ensurePasswordResetsTable();

  const [rows] = await db.query(
    `SELECT user_id, email
     FROM password_resets
     WHERE reset_token_hash = ?
       AND expires_at > NOW()
       AND used_at IS NULL
     LIMIT 1`,
    [hashResetToken(token)]
  );

  if (!rows.length) {
    throw new AppError("Token inválido o expirado", 400, [{ reason: "invalid_reset_token" }]);
  }

  return { userId: rows[0].user_id, email: rows[0].email };
}

async function markTokenAsUsed({ token }) {
  await ensurePasswordResetsTable();

  const [result] = await db.query(
    `UPDATE password_resets
     SET used_at = NOW()
     WHERE reset_token_hash = ?
       AND used_at IS NULL`,
    [hashResetToken(token)]
  );

  return result.affectedRows > 0;
}

async function cleanupExpiredTokens() {
  await ensurePasswordResetsTable();

  await db.query(
    `DELETE FROM password_resets
     WHERE expires_at < NOW()`
  );
}

module.exports = {
  createResetToken,
  validateResetToken,
  markTokenAsUsed,
  cleanupExpiredTokens,
};