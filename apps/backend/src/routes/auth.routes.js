const router = require("express").Router();
const { loginValidator, registerValidator, forgotPasswordValidator, resetPasswordValidator } = require("../validators/auth.validators");
const validate = require("../middlewares/validate.middleware");
const { authRequired } = require("../middlewares/auth.middleware");
const AuthController = require("../controllers/auth.controller");

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Ping
router.get("/ping", (req, res) => res.json({ ok: true, message: "auth routes working" }));

// Registro
router.post("/register", registerValidator, validate, asyncHandler(AuthController.register));

// Login aspirante
router.post("/login", loginValidator, validate, asyncHandler(AuthController.loginCandidate));

// Login reclutador/admin
router.post("/login/admin", loginValidator, validate, asyncHandler(AuthController.loginAdmin));

// Sesiones
router.get("/sessions", authRequired, asyncHandler(AuthController.listSessions));
router.post("/logout", authRequired, asyncHandler(AuthController.logout));
router.post("/logout-all", authRequired, asyncHandler(AuthController.logoutAll));

// Recuperación de contraseña
router.post("/forgot-password", forgotPasswordValidator, validate, asyncHandler(AuthController.forgotPassword));
router.post("/reset-password", resetPasswordValidator, validate, asyncHandler(AuthController.resetPassword));

module.exports = router;