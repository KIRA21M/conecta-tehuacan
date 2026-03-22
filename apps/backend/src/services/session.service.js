const crypto = require("crypto");
const db = require("../config/db");
const { AppError } = require("../utils/errors");

let tableEnsured = false;

function generateSessionId() {
  if (typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return crypto.randomBytes(16).toString("hex");
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function fromUnixToMySqlDate(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000);
  return date.toISOString().slice(0, 19).replace("T", " ");
}

async function ensureSessionsTable() {
  if (tableEnsured) return;

  await db.query(`
    CREATE TABLE IF NOT EXISTS user_sessions (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      session_id VARCHAR(64) NOT NULL,
      user_id BIGINT UNSIGNED NOT NULL,
      token_hash CHAR(64) NOT NULL,
      user_agent VARCHAR(255) NULL,
      ip_address VARCHAR(45) NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      last_activity_at DATETIME NULL,
      expires_at DATETIME NOT NULL,
      revoked_at DATETIME NULL,
      revoked_reason VARCHAR(50) NULL,
      PRIMARY KEY (id),
      UNIQUE KEY uniq_session_id (session_id),
      KEY idx_user_active (user_id, revoked_at, expires_at),
      KEY idx_session_lookup (user_id, session_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  tableEnsured = true;
}

async function enforceConcurrentLimit(userId, maxSessions) {
  if (!maxSessions || maxSessions <= 0) return;

  const [rows] = await db.query(
    `SELECT id
     FROM user_sessions
     WHERE user_id = ?
       AND revoked_at IS NULL
       AND expires_at > NOW()
     ORDER BY created_at ASC`,
    [userId]
  );

  const sessionsToRevoke = rows.length - (maxSessions - 1);
  if (sessionsToRevoke <= 0) return;

  const ids = rows.slice(0, sessionsToRevoke).map((row) => row.id);
  const placeholders = ids.map(() => "?").join(",");

  await db.query(
    `UPDATE user_sessions
     SET revoked_at = NOW(), revoked_reason = 'concurrency_limit'
     WHERE id IN (${placeholders})`,
    ids
  );
}

async function createSession({ userId, sessionId, token, tokenExp, userAgent, ipAddress }) {
  await ensureSessionsTable();

  const maxSessions = Number(process.env.MAX_CONCURRENT_SESSIONS || 5);
  await enforceConcurrentLimit(userId, maxSessions);

  await db.query(
    `INSERT INTO user_sessions
      (session_id, user_id, token_hash, user_agent, ip_address, expires_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      sessionId,
      userId,
      hashToken(token),
      userAgent || null,
      ipAddress || null,
      fromUnixToMySqlDate(tokenExp),
    ]
  );
}

async function validateSession({ userId, sessionId, token }) {
  await ensureSessionsTable();

  const [rows] = await db.query(
    `SELECT id
     FROM user_sessions
     WHERE user_id = ?
       AND session_id = ?
       AND token_hash = ?
       AND revoked_at IS NULL
       AND expires_at > NOW()
     LIMIT 1`,
    [userId, sessionId, hashToken(token)]
  );

  if (!rows.length) {
    throw new AppError("No autorizado", 401, [{ reason: "session_invalid" }]);
  }

  await db.query(
    `UPDATE user_sessions
     SET last_activity_at = NOW()
     WHERE id = ?`,
    [rows[0].id]
  );
}

async function revokeSession({ userId, sessionId, reason = "logout" }) {
  await ensureSessionsTable();

  const [result] = await db.query(
    `UPDATE user_sessions
     SET revoked_at = NOW(), revoked_reason = ?
     WHERE user_id = ?
       AND session_id = ?
       AND revoked_at IS NULL`,
    [reason, userId, sessionId]
  );

  return result.affectedRows > 0;
}

async function revokeAllUserSessions({ userId, exceptSessionId = null, reason = "logout_all" }) {
  await ensureSessionsTable();

  if (exceptSessionId) {
    const [result] = await db.query(
      `UPDATE user_sessions
       SET revoked_at = NOW(), revoked_reason = ?
       WHERE user_id = ?
         AND revoked_at IS NULL
         AND session_id <> ?`,
      [reason, userId, exceptSessionId]
    );
    return result.affectedRows;
  }

  const [result] = await db.query(
    `UPDATE user_sessions
     SET revoked_at = NOW(), revoked_reason = ?
     WHERE user_id = ?
       AND revoked_at IS NULL`,
    [reason, userId]
  );
  return result.affectedRows;
}

async function listActiveSessions(userId) {
  await ensureSessionsTable();

  const [rows] = await db.query(
    `SELECT session_id, user_agent, ip_address, created_at, last_activity_at, expires_at
     FROM user_sessions
     WHERE user_id = ?
       AND revoked_at IS NULL
       AND expires_at > NOW()
     ORDER BY created_at DESC`,
    [userId]
  );

  return rows;
}

module.exports = {
  generateSessionId,
  createSession,
  validateSession,
  revokeSession,
  revokeAllUserSessions,
  listActiveSessions,
};