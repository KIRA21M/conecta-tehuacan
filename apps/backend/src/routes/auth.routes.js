const router = require("express").Router();
const { loginValidator, registerValidator } = require("../validators/auth.validators");
const validate = require("../middlewares/validate.middleware");
const { loginLimiter, registerLimiter } = require("../middlewares/rateLimiter.middleware");
const AuthController = require("../controllers/auth.controller");

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.get("/ping", (req, res) => res.json({ ok: true, message: "auth routes working" }));

// GET /api/auth/verify?token=<token>
router.get("/verify", asyncHandler(AuthController.verifyEmail));

// POST /api/auth/register
router.post("/register", registerLimiter, registerValidator, validate, asyncHandler(AuthController.register));

// POST /api/auth/login  → aspirante
router.post("/login", loginLimiter, loginValidator, validate, asyncHandler(AuthController.loginCandidate));

// POST /api/auth/login/admin  → reclutador / admin
router.post("/login/admin", loginLimiter, loginValidator, validate, asyncHandler(AuthController.loginAdmin));

// POST /api/auth/refresh
router.post("/refresh", asyncHandler(AuthController.refresh));

// POST /api/auth/logout
router.post("/logout", asyncHandler(AuthController.logout));

module.exports = router;
