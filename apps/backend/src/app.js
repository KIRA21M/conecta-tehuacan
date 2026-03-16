require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const performanceMiddleware = require("./middlewares/performance.middleware");
const routes = require("./routes");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(performanceMiddleware);

app.use("/api", routes);

app.use((req, res) => res.status(404).json({ ok: false, message: "Not Found", errors: [] }));
app.use(errorMiddleware);

module.exports = app;
