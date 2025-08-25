const { Attendance } = require("../models/Attendance");
const { Student } = require("../models/Student");

// Mark Attendance (Public route allowed)
const markAttendance = async (req, res, next) => {
  try {
    const { studentId } = req.body;
    if (!studentId) {
      return res.status(400).json({ error: "Student ID is required" });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Today range
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    // Check if attendance already exists today
    const existing = await Attendance.findOne({
      student: student._id,
      time: { $gte: start, $lte: end },
    });

    if (existing) {
      return res.status(400).json({ error: "Attendance already marked today" });
    }

    // Create attendance (admin optional → null if not logged in)
    const attendance = await Attendance.create({
      student: student._id,
      admin: req.admin ? req.admin._id : null,
      time: new Date(),
    });

    return res.json({ success: true, attendance });
  } catch (err) {
    console.error("🔥 Attendance error:", err.message);
    return res.status(500).json({ error: "Server error" });
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
