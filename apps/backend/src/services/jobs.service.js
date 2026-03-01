const db = require("../config/db");
const { AppError } = require("../utils/errors");

/* ---------------- UTILIDADES ---------------- */

function validatePayload(payload, partial = false) {
  const required = ["title","company_name","location","work_mode","employment_type","description"];

  if (!partial) {
    for (const f of required) {
      if (!payload[f] || typeof payload[f] !== "string") {
        throw new AppError(`Campo inválido: ${f}`, 400);
      }
    }
  }

  const numeric = ["salary_min","salary_max","category_id"];
  for (const f of numeric) {
    if (payload[f] !== undefined && payload[f] !== null && isNaN(payload[f])) {
      throw new AppError(`Campo numérico inválido: ${f}`, 400);
    }
  }
}

function buildFilters(filters) {
  const {
    q, category_id, work_mode, employment_type,
    min, max
  } = filters;

  const where = ["jp.is_active = 1"];
  const params = [];

  if (category_id) {
    where.push("jp.category_id = ?");
    params.push(Number(category_id));
  }

  if (work_mode) {
    where.push("jp.work_mode = ?");
    params.push(work_mode);
  }

  if (employment_type) {
    where.push("jp.employment_type = ?");
    params.push(employment_type);
  }

  /* salario corregido */
  if (min != null) {
    where.push("(jp.salary_max IS NULL OR jp.salary_max >= ?)");
    params.push(Number(min));
  }

  if (max != null) {
    where.push("(jp.salary_min IS NULL OR jp.salary_min <= ?)");
    params.push(Number(max));
  }

  if (q) {
    where.push(`MATCH(jp.title,jp.company_name,jp.location,jp.description,jp.requirements)
                AGAINST (? IN NATURAL LANGUAGE MODE)`);
    params.push(q);
  }

  return {
    whereSql: where.length ? `WHERE ${where.join(" AND ")}` : "",
    params
  };
}

async function safeQuery(sql, params=[]) {
  try {
    return await db.query(sql, params);
  } catch (err) {
    console.error("SQL ERROR:", err);
    throw new AppError("Database error", 500);
  }
}

/* ---------------- CRUD ---------------- */

async function createJob(recruiterUserId, payload) {
  validatePayload(payload);

  const {
    title, company_name, location, category_id = null,
    work_mode, employment_type,
    salary_min = null, salary_max = null,
    description, requirements = null
  } = payload;

  const [r] = await safeQuery(
    `INSERT INTO job_posts
     (recruiter_user_id, category_id, title, company_name, location, work_mode, employment_type,
      salary_min, salary_max, description, requirements, is_active, published_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW())`,
    [
      recruiterUserId, category_id, title, company_name, location, work_mode,
      employment_type, salary_min, salary_max, description, requirements
    ]
  );

  return { id: r.insertId };
}

async function getJobById(id) {
  const [rows] = await safeQuery(
    `SELECT jp.*, jc.name AS category_name
     FROM job_posts jp
     LEFT JOIN job_categories jc ON jc.id = jp.category_id
     WHERE jp.id = ? AND jp.is_active = 1
     LIMIT 1`,
    [id]
  );

  return rows[0] || null;
}

async function listJobs(filters) {
  const { page = 1, limit = 10 } = filters;
  const offset = (Number(page) - 1) * Number(limit);

  const { whereSql, params } = buildFilters(filters);

  const [rows] = await safeQuery(
    `SELECT jp.id, jp.title, jp.company_name, jp.location, jp.work_mode,
            jp.employment_type, jp.salary_min, jp.salary_max, jp.currency,
            jp.published_at,
            jc.name AS category_name,
            COUNT(*) OVER() AS total
     FROM job_posts jp
     LEFT JOIN job_categories jc ON jc.id = jp.category_id
     ${whereSql}
     ORDER BY jp.published_at DESC
     LIMIT ? OFFSET ?`,
    [...params, Number(limit), Number(offset)]
  );

  return {
    page: Number(page),
    limit: Number(limit),
    total: rows.length ? rows[0].total : 0,
    items: rows
  };
}

/* ---------------- AUTH ---------------- */

async function ensureJobOwner(jobId, recruiterUserId) {
  const [rows] = await safeQuery(
    "SELECT id FROM job_posts WHERE id = ? AND recruiter_user_id = ? LIMIT 1",
    [jobId, recruiterUserId]
  );

  if (!rows.length)
    throw new AppError("No autorizado", 403, [{ reason: "not_owner" }]);
}

/* ---------------- UPDATE ---------------- */

async function updateJob(jobId, recruiterUserId, payload) {
  validatePayload(payload, true);

  await ensureJobOwner(jobId, recruiterUserId);

  const fields = [];
  const params = [];

  const allowed = [
    "title","company_name","location","category_id",
    "work_mode","employment_type",
    "salary_min","salary_max",
    "description","requirements"
  ];

  for (const k of allowed) {
    if (payload[k] !== undefined) {
      fields.push(`${k} = ?`);
      params.push(payload[k]);
    }
  }

  if (!fields.length)
    throw new AppError("Nada que actualizar", 400);

  params.push(jobId);

  await safeQuery(
    `UPDATE job_posts SET ${fields.join(", ")} WHERE id = ?`,
    params
  );

  return { updated: true };
}

async function setJobStatus(jobId, recruiterUserId, is_active) {
  await ensureJobOwner(jobId, recruiterUserId);

  await safeQuery(
    "UPDATE job_posts SET is_active = ? WHERE id = ?",
    [is_active ? 1 : 0, jobId]
  );

  return { updated: true };
}

/* ---------------- EXPORT ---------------- */

module.exports = {
  createJob,
  listJobs,
  getJobById,
  updateJob,
  setJobStatus
};