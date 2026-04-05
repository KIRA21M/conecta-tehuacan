const { ok } = require("../utils/response");
const { AppError } = require("../utils/errors");
const JobsService = require("../services/jobs.service");

async function list(req, res, next) {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);

    const result = await JobsService.listJobs({
      ...req.query,
      page,
      limit
    });

    return ok(res, {
      message: "Vacantes",
      data: result.items,
      meta: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
}

async function detail(req, res, next) {
  try {
    const job = await JobsService.getJobById(Number(req.params.id));
    if (!job) {
      const err = new Error("Vacante no encontrada");
      err.status = 404;
      throw err;
    }

    return ok(res, { message: "Vacante", data: job });
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const data = await JobsService.createJob(req.user.id, req.body);
    
    // Audit: Log successful job creation
    console.info(`[AUDIT] Job created: id=${data.id} by user=${req.user.id} role=${req.user.role}`);
    
    return ok(res, { status: 201, message: "Vacante creada", data });
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const jobId = Number(req.params.id);
    const userId = req.user.id;

    // Validate ID format
    if (!jobId || isNaN(jobId) || jobId < 1) {
      return next(new AppError("ID de vacante inválido", 400, [{ reason: "invalid_id" }]));
    }

    // Service performs ownership check via ensureJobOwner()
    // This is "defense in depth" - middleware already checked role + permission
    await JobsService.updateJob(jobId, userId, req.body);
    
    // Audit: Log successful job update
    console.info(`[AUDIT] Job updated: id=${jobId} by user=${userId} role=${req.user.role}`);
    
    return ok(res, { message: "Vacante actualizada" });
  } catch (error) {
    next(error);
  }
}

async function status(req, res, next) {
  try {
    const jobId = Number(req.params.id);
    const userId = req.user.id;
    const { is_active } = req.body;

    // Validate ID format
    if (!jobId || isNaN(jobId) || jobId < 1) {
      return next(new AppError("ID de vacante inválido", 400, [{ reason: "invalid_id" }]));
    }

    // Validate is_active value
    if (typeof is_active !== "boolean") {
      return next(new AppError("Campo is_active debe ser booleano", 400, [{ reason: "invalid_status" }]));
    }

    // Service performs ownership check via ensureJobOwner()
    // This is "defense in depth" - middleware already checked role + permission
    await JobsService.setJobStatus(jobId, userId, is_active);
    
    // Audit: Log successful job status change
    console.info(`[AUDIT] Job status changed: id=${jobId} status=${is_active} by user=${userId} role=${req.user.role}`);
    
    return ok(res, { message: "Estado actualizado" });
  } catch (error) {
    next(error);
  }
}

module.exports = { list, detail, create, update, status };