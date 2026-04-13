const router = require("express").Router();

// Existing routes
router.use("/auth", require("./auth.routes"));
router.use("/jobs", require("./jobs.routes"));

// New routes - Applications, Messages, Company Profiles
router.use("/applications", require("./applications.routes"));
router.use("/messages", require("./messages.routes"));
router.use("/company", require("./company.routes"));

module.exports = router;