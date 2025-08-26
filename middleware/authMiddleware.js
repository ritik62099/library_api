const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const protectAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Not authorized, no token" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = { _id: decoded.id }; // attach admin object
    next();
  } catch (err) {
    return res.status(401).json({ error: "Not authorized, token failed" });
  }
};

module.exports = protectAdmin;
