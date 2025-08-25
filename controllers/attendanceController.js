// const { Attendance } = require("../models/Attendance");
// const { Student } = require("../models/Student");

// // Mark Attendance
// // Mark Attendance
// const markAttendance = async (req, res, next) => {
//   try {
//     const { studentId } = req.body;
//     const student = await Student.findById(studentId);
//     if (!student) return res.status(404).json({ error: "Student not found" });

//     // Check if already marked today
//     const start = new Date();
//     start.setHours(0, 0, 0, 0);
//     const end = new Date();
//     end.setHours(23, 59, 59, 999);

//     const existing = await Attendance.findOne({
//       student: student._id,
//       time: { $gte: start, $lte: end },
//     });

//     if (existing) return res.status(400).json({ error: "Attendance already marked today" });

//     // ✅ admin field optional
//     const attendanceData = {
//       student: student._id,
//       time: new Date(),
//     };
//     if (req.admin) {
//       attendanceData.admin = req.admin._id; // only if admin logged in
//     }

//     const attendance = await Attendance.create(attendanceData);

//     res.json({ success: true, attendance });
//   } catch (err) {
//     next(err);
//   }
// };

// // Get Today’s Attendance for current admin
// const getTodayAttendance = async (req, res, next) => {
//   try {
//     const start = new Date();
//     start.setHours(0, 0, 0, 0);
//     const end = new Date();
//     end.setHours(23, 59, 59, 999);

//     const records = await Attendance.find({
//       admin: req.admin._id, // ✅ only current admin
//       time: { $gte: start, $lte: end },
//     }).populate("student");

//     res.json(records);
//   } catch (err) {
//     next(err);
//   }
// };

// module.exports = { markAttendance, getTodayAttendance };



const { Attendance } = require("../models/Attendance");
const { Student } = require("../models/Student");

// Mark Attendance (public)
const markAttendance = async (req, res, next) => {
  try {
    const { studentId } = req.body;
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ error: "Student not found" });

    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const existing = await Attendance.findOne({
      student: student._id,
      time: { $gte: start, $lte: end },
    });

    if (existing) return res.status(400).json({ error: "Attendance already marked today" });

    const attendance = await Attendance.create({
      student: student._id,
      time: new Date(),
    });

    res.json({ success: true, attendance });
  } catch (err) {
    next(err);
  }
};

// Get Today’s Attendance (admin only)
const getTodayAttendance = async (req, res, next) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const records = await Attendance.find({
      time: { $gte: start, $lte: end },
    }).populate("student");

    res.json(records);
  } catch (err) {
    next(err);
  }
};

module.exports = { markAttendance, getTodayAttendance };
