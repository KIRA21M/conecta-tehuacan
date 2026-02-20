const { body } = require("express-validator");

const loginValidator = [
  body("email").isEmail().withMessage("Email inválido").normalizeEmail(),
  body("password").isString().notEmpty().withMessage("Password requerido"),
];

const registerValidator = [
  body("full_name")
    .isString()
    .isLength({ min: 3, max: 180 })
    .withMessage("Nombre completo inválido"),

  body("email")
    .isEmail()
    .withMessage("Email inválido")
    .normalizeEmail(),

  body("password")
    .isString()
    .isLength({ min: 8, max: 72 })
    .withMessage("La contraseña debe tener entre 8 y 72 caracteres"),

  body("confirm_password")
    .isString()
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Las contraseñas no coinciden"),

  // tu UI dice Aspirante / Reclutador
  body("role")
    .isIn(["aspirante", "reclutador"])
    .withMessage("role debe ser aspirante o reclutador"),
];

module.exports = { loginValidator, registerValidator };