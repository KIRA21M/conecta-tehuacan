const router = require("express").Router();
const validate = require("../middlewares/validate.middleware");
const { authRequired, requireRole } = require("../middlewares/auth.middleware");
const { requirePermission } = require("../middlewares/authorization.middleware");
const JobsController = require("../controllers/jobs.controller");
const { createJobValidator, listJobsValidator, jobIdValidator } = require("../validators/jobs.validators");

const asyncHandler = fn => (req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);

// Public routes
router.get("/", listJobsValidator, validate, asyncHandler(JobsController.list));
router.get("/:id", jobIdValidator, validate, asyncHandler(JobsController.detail));

// Protected routes: Create job
// Requires: authentication + reclutador/admin role + create_job permission
router.post(
  "/",
  createJobValidator,
  validate,
  authRequired,
  requireRole("reclutador", "admin"),
  requirePermission("create_job"),
  asyncHandler(JobsController.create)
);

// Protected routes: Update job
// Requires: authentication + reclutador/admin role + update_job permission
// Note: Controller should verify ownership (only job creator or admin can update)
router.patch(
  "/:id",
  jobIdValidator,
  validate,
  authRequired,
  requireRole("reclutador", "admin"),
  requirePermission("update_job"),
  asyncHandler(JobsController.update)
);

// Protected routes: Change job status
// Requires: authentication + reclutador/admin role + change_job_status permission
// Note: Controller should verify ownership (only job creator or admin can change status)
router.patch(
  "/:id/status",
  jobIdValidator,
  validate,
  authRequired,
  requireRole("reclutador", "admin"),
  requirePermission("change_job_status"),
  asyncHandler(JobsController.status)
);

module.exports = router;