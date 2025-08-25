const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");

const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Admin search
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(404).json({ error: "Admin not found" });

    // Password check
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // JWT token
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ token });
  } catch (err) {
    console.error(err); // ← ye important, stack trace dekho
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { loginAdmin };
