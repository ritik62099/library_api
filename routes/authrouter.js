const express = require("express");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const protectAdmin = require("../middleware/authMiddleware");

const router = express.Router();

// Login route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(404).json({ error: "Admin not found" });

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // JWT generation
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "365d" });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Refresh-safe login check
router.get("/me", protectAdmin, (req, res) => {
  res.json({ admin: req.admin });
});

module.exports = router;
