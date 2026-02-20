const router = require("express").Router();
router.use("/auth", require("./auth.routes"));
<<<<<<< HEAD
router.use("/jobs", require("./jobs.routes"));
module.exports = router;
=======
module.exports = router;
>>>>>>> 23b8af0 (feat(auth): register y login con JWT)
