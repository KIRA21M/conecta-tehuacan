const { ok } = require("../utils/response");
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
      data: result.data,
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
    return ok(res, { status: 201, message: "Vacante creada", data });
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    await JobsService.updateJob(
      Number(req.params.id),
      req.user.id,
      req.body
    );
    return ok(res, { message: "Vacante actualizada" });
  } catch (error) {
    next(error);
  }
}

async function status(req, res, next) {
  try {
    const { is_active } = req.body;

    await JobsService.setJobStatus(
      Number(req.params.id),
      req.user.id,
      !!is_active
    );

    return ok(res, { message: "Estado actualizado" });
  } catch (error) {
    next(error);
  }
}

module.exports = { list, detail, create, update, status };