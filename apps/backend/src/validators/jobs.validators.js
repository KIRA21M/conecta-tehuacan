const { body, query, param } = require("express-validator");

const createJobValidator = [
  body("title").isString().isLength({ min: 3, max: 180 }),
  body("company_name").isString().isLength({ min: 2, max: 200 }),
  body("location").isString().isLength({ min: 2, max: 160 }),
  body("category_id").optional().isInt({ min: 1 }),
  body("work_mode").isIn(["presencial", "hibrido", "remoto"]),
  body("employment_type").isIn(["tiempo_completo","medio_tiempo","temporal","practicas","freelance"]),
  body("salary_min").optional().isInt({ min: 0 }),
  body("salary_max").optional().isInt({ min: 0 }),
  body("description").isString().isLength({ min: 20 }),
  body("requirements").optional().isString(),
];

const listJobsValidator = [
  query("q").optional().isString().isLength({ min: 1, max: 80 }),
  query("category_id").optional().isInt({ min: 1 }),
  query("work_mode").optional().isIn(["presencial","hibrido","remoto"]),
  query("employment_type").optional().isIn(["tiempo_completo","medio_tiempo","temporal","practicas","freelance"]),
  query("min").optional().isInt({ min: 0 }),
  query("max").optional().isInt({ min: 0 }),
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 50 }),
];

const jobIdValidator = [param("id").isInt({ min: 1 })];

module.exports = { createJobValidator, listJobsValidator, jobIdValidator };