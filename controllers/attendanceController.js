const { Attendance } = require("../models/Attendance");
const { Student } = require("../models/Student");

// Mark Attendance (Public route allowed)
const markAttendance = async (req, res) => {
  try {
    console.log("📩 Attendance request body:", req.body);

    const { studentId } = req.body;
    if (!studentId) {
      console.log("❌ Missing studentId");
      return res.status(400).json({ error: "Student ID is required" });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      console.log("❌ Student not found:", studentId);
      return res.status(404).json({ error: "Student not found" });
    }

    // Today’s range
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    // Already marked?
    const existing = await Attendance.findOne({
      student: student._id,
      time: { $gte: start, $lte: end },
    });

    if (existing) {
      console.log("⚠️ Already marked for:", student._id);
      return res.status(400).json({ error: "Attendance already marked today" });
    }

    // Save attendance
    const attendance = await Attendance.create({
      student: student._id,
      admin: req.admin ? req.admin._id : null, // optional
      time: new Date(),
    });

    console.log("✅ Attendance saved:", attendance);
    return res.json({ success: true, attendance });
  } catch (err) {
    console.error("🔥 Attendance error:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
};

// Get Today’s Attendance (Only Admin)
const getTodayAttendance = async (req, res, next) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const filter = {
      time: { $gte: start, $lte: end },
    };

    // If admin logged in → show only his students
    if (req.admin) {
      filter.admin = req.admin._id;
    }

    const records = await Attendance.find(filter).populate("student");
    return res.json(records);
  } catch (err) {
    console.error("🔥 Get attendance error:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = { markAttendance, getTodayAttendance };
