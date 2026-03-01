const router = require("express").Router();
const validate = require("../middlewares/validate.middleware");
const { authRequired, requireRole } = require("../middlewares/auth.middleware");
const JobsController = require("../controllers/jobs.controller");
const { createJobValidator, listJobsValidator, jobIdValidator } = require("../validators/jobs.validators");

const asyncHandler = fn => (req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);

// Public
router.get("/", listJobsValidator, validate, asyncHandler(JobsController.list));
router.get("/:id", jobIdValidator, validate, asyncHandler(JobsController.getById));

// Protected
router.post(
  "/",
  createJobValidator,
  validate,
  authRequired,
  requireRole("reclutador","admin"),
  asyncHandler(JobsController.create)
);

router.patch(
  "/:id",
  jobIdValidator,
  validate,
  authRequired,
  requireRole("reclutador","admin"),
  asyncHandler(JobsController.update)
);

router.patch(
  "/:id/status",
  jobIdValidator,
  validate,
  authRequired,
  requireRole("reclutador","admin"),
  asyncHandler(JobsController.setStatus)
);

module.exports = router;