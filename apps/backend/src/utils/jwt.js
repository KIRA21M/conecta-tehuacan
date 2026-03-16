const jwt = require("jsonwebtoken");

const ISSUER   = process.env.JWT_ISSUER   || "conecta-tehuacan";
const AUDIENCE = process.env.JWT_AUDIENCE || "conecta-app";

function signAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
    issuer: ISSUER,
    audience: AUDIENCE,
  });
}

function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET, {
    algorithms: ["HS256"],
    issuer: ISSUER,
    audience: AUDIENCE,
  });
}

function signRefreshToken(payload) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    algorithm: "HS256",
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    issuer: ISSUER,
    audience: AUDIENCE,
  });
}

function verifyRefreshToken(token) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET, {
    algorithms: ["HS256"],
    issuer: ISSUER,
    audience: AUDIENCE,
  });
}

module.exports = { signAccessToken, verifyAccessToken, signRefreshToken, verifyRefreshToken };
