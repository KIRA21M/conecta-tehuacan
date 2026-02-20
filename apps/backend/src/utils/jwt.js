const jwt = require("jsonwebtoken");

function signAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: process.env.JWT_EXPIRES_IN || "2h",
    issuer: process.env.JWT_ISSUER || "conecta-tehuacan",
    audience: process.env.JWT_AUDIENCE || "conecta-app",
  });
}

function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET, {
    algorithms: ["HS256"],
    issuer: process.env.JWT_ISSUER || "conecta-tehuacan",
    audience: process.env.JWT_AUDIENCE || "conecta-app",
  });
}

module.exports = { signAccessToken, verifyAccessToken };
