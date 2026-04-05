require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const securityProtection = require("./middlewares/securityProtection.middleware");
const securityLogger = require("./middlewares/securityLog.middleware");
const performanceMiddleware = require("./middlewares/performance.middleware");
const routes = require("./routes");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

// Security headers
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true,
}));

// Body parsing and security protection (before routes)
app.use(express.json({ limit: "10kb" }));
app.use(securityProtection); // Input validation and sanitization
app.use(cookieParser());

// Logging and performance
app.use(securityLogger); // Security audit logging
app.use(performanceMiddleware);

// Routes
app.use("/api", routes);

// 404 handler
app.use((req, res) => res.status(404).json({ ok: false, message: "Not Found", errors: [] }));

// Error handler (must be last)
app.use(errorMiddleware);

module.exports = app;
