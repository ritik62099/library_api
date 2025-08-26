const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");

// ✅ First admin fetch karo
router.get("/me", async (req, res) => {
  try {
    const admin = await Admin.findOne();
    if (!admin) return res.status(404).json({ error: "No admin found" });

    res.json({ _id: admin._id, username: admin.username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
