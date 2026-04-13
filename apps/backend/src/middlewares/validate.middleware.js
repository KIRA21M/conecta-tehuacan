const { validationResult } = require("express-validator");
const { AppError } = require("../utils/errors");

module.exports = (req, res, next) => {
  const r = validationResult(req);
  if (!r.isEmpty()) {
    throw new AppError("Validación fallida", 400, r.array().map(e => ({
      field: e.path,
      reason: "validation_error",
      message: e.msg
    })));
  }
  next();
};
