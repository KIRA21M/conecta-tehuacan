/**
 * Authentication Routes
 * =====================
 * 
 * Security features implemented:
 * - Rate limiting on login/register to prevent brute force attacks
 * - Input validation with express-validator
 * - Async error handling via asyncHandler
 * - Generic error messages to prevent user enumeration
 * - Password hashing via bcrypt
 * - JWT token rotation (access + refresh tokens)
 * - Email verification required before first login
 * - Account status check (is_active, is_verified)
 * - Separate login endpoints for candidates vs recruiters (role enforcement)
 */

const router = require("express").Router();
const { loginValidator, registerValidator } = require("../validators/auth.validators");
const validate = require("../middlewares/validate.middleware");
const { loginLimiter, registerLimiter } = require("../middlewares/rateLimiter.middleware");
const AuthController = require("../controllers/auth.controller");

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.get("/ping", (req, res) => res.json({ ok: true, message: "auth routes working" }));

/**
 * GET /api/auth/verify?token=<token>
 * Security: Email verification token validation
 * - Only unused tokens are accepted
 * - Token is marked as used after first verification
 * - Prevents token replay attacks
 */
router.get("/verify", asyncHandler(AuthController.verifyEmail));

/**
 * POST /api/auth/register
 * Security: 
 * - Rate limited: 5 attempts per hour in production
 * - Input validation: email format, strong password, valid role
 * - Email and password hashed before storage
 * - Transaction: Atomic user+profile creation
 * - Verification required before login
 */
router.post("/register", registerLimiter, registerValidator, validate, asyncHandler(AuthController.register));

/**
 * POST /api/auth/login (aspirante only)
 * Security:
 * - Rate limited: 10 attempts per 15 minutes in production
 * - Uses generic error "Credenciales inválidas" to prevent user enumeration
 * - Password compared via bcrypt (timing attack resistant)
 * - Only aspirante role allowed
 * - Account must be verified and active
 */
router.post("/login", loginLimiter, loginValidator, validate, asyncHandler(AuthController.loginCandidate));

/**
 * POST /api/auth/login/admin (reclutador/admin only)
 * Security:
 * - Same as /login but allows reclutador and admin roles
 * - Separate endpoint prevents accidental admin login as regular candidate
 */
router.post("/login/admin", loginLimiter, loginValidator, validate, asyncHandler(AuthController.loginAdmin));

/**
 * POST /api/auth/refresh
 * Security:
 * - Validates refresh token signature and expiration
 * - Implements token rotation: old token is revoked, new token issued
 * - Revoked tokens cannot be used again (prevents replay)
 * - User must still be active and verified
 */
router.post("/refresh", asyncHandler(AuthController.refresh));

/**
 * POST /api/auth/logout
 * Security:
 * - Revokes refresh token to prevent reuse
 * - Idempotent: safe to call multiple times
 */
router.post("/logout", asyncHandler(AuthController.logout));

/**
 * POST /api/auth/forgot-password
 * Security:
 * - Generic response even if email doesn't exist (prevents user enumeration)
 * - Reset token expires after 15 minutes
 * - Reset token is hashed before storage (not reversible)
 * - TODO: Send reset link via email instead of returning token
 */
router.post("/forgot-password", asyncHandler(AuthController.forgotPassword));

/**
 * POST /api/auth/reset-password
 * Security:
 * - Token must be valid, unexpired, and unused
 * - Token is marked as used after successful reset (one-time use only)
 * - Password is hashed with bcrypt before storage
 */
router.post("/reset-password", asyncHandler(AuthController.resetPassword));

module.exports = router;
