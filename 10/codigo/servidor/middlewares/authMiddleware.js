const jwt = require("jsonwebtoken");
require('dotenv').config();

module.exports = (rolesPermitidos = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token requerido." });
    }
    const token = authHeader.split(" ")[1];
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || "clave_secreta_123");
      if (rolesPermitidos.length && !rolesPermitidos.includes(payload.role)) {
        return res.status(403).json({ error: "No autorizado." });
      }
      req.user = payload;
      next();
    } catch (err) {
      return res.status(401).json({ error: "Token inválido." });
    }
  };
};
