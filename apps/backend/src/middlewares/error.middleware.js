const { fail } = require("../utils/response");

module.exports = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  const errors = err.errors || [];

  // Log solo en desarrollo
  if (process.env.NODE_ENV !== "production") {
    console.error("[ERROR]", err.stack);
  }

  return fail(res, {
    status,
    message,
    errors
  });
};