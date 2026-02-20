const { ok } = require("../utils/response");
const JobsService = require("../services/jobs.service");

async function list(req, res) {
  const data = await JobsService.listJobs(req.query);
  return ok(res, { message: "Vacantes", data });
}

async function detail(req, res) {
  const job = await JobsService.getJobById(Number(req.params.id));
  if (!job) return res.status(404).json({ ok: false, message: "Vacante no encontrada", errors: [] });
  return ok(res, { message: "Vacante", data: job });
}

async function create(req, res) {
  const data = await JobsService.createJob(req.user.id, req.body);
  return ok(res, { status: 201, message: "Vacante creada", data });
}

async function update(req, res) {
  await JobsService.updateJob(Number(req.params.id), req.user.id, req.body);
  return ok(res, { message: "Vacante actualizada" });
}

async function status(req, res) {
  const { is_active } = req.body;
  await JobsService.setJobStatus(Number(req.params.id), req.user.id, !!is_active);
  return ok(res, { message: "Estado actualizado" });
}

module.exports = { list, detail, create, update, status };