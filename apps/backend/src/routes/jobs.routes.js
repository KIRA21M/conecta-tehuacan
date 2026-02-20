const router = require("express").Router();
const validate = require("../middlewares/validate.middleware");
const { authRequired, requireRole } = require("../middlewares/auth.middleware");
const JobsController = require("../controllers/jobs.controller");
const { createJobValidator, listJobsValidator, jobIdValidator } = require("../validators/jobs.validators");

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Público
router.get("/", listJobsValidator, validate, asyncHandler(JobsController.list));
router.get("/:id", jobIdValidator, validate, asyncHandler(JobsController.detail));

// Protegido (solo reclutador/admin)
router.post("/", authRequired, requireRole("reclutador","admin"), createJobValidator, validate, asyncHandler(JobsController.create));
router.patch("/:id", authRequired, requireRole("reclutador","admin"), jobIdValidator, validate, asyncHandler(JobsController.update));
router.patch("/:id/status", authRequired, requireRole("reclutador","admin"), jobIdValidator, validate, asyncHandler(JobsController.status));

module.exports = router;