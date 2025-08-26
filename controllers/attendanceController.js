// const { Attendance } = require("../models/Attendance");
// const { Student } = require("../models/Student");

// // Mark Attendance (Public route allowed)
// const markAttendance = async (req, res) => {
//   try {
//     console.log("📩 Attendance request body:", req.body);

//     const { studentId } = req.body;
//     if (!studentId) {
//       console.log("❌ Missing studentId");
//       return res.status(400).json({ error: "Student ID is required" });
//     }

//     const student = await Student.findById(studentId);
//     if (!student) {
//       console.log("❌ Student not found:", studentId);
//       return res.status(404).json({ error: "Student not found" });
//     }

//     // Today’s range
//     const start = new Date();
//     start.setHours(0, 0, 0, 0);
//     const end = new Date();
//     end.setHours(23, 59, 59, 999);

//     // Already marked?
//     const existing = await Attendance.findOne({
//       student: student._id,
//       time: { $gte: start, $lte: end },
//     });

//     if (existing) {
//       console.log("⚠️ Already marked for:", student._id);
//       return res.status(400).json({ error: "Attendance already marked today" });
//     }

//     // Save attendance
//     const attendance = await Attendance.create({
//       student: student._id,
//       admin: req.admin ? req.admin._id : null, // optional
//       time: new Date(),
//     });

//     console.log("✅ Attendance saved:", attendance);
//     return res.json({ success: true, attendance });
//   } catch (err) {
//     console.error("🔥 Attendance error:", err);
//     return res.status(500).json({ error: err.message || "Server error" });
//   }
// };

// // Get Today’s Attendance (Only Admin)
// const getTodayAttendance = async (req, res) => {
//   try {
//     const start = new Date();
//     start.setHours(0, 0, 0, 0);

//     const end = new Date();
//     end.setHours(23, 59, 59, 999);

//     const records = await Attendance.find({
//       time: { $gte: start, $lte: end },
//       $or: [
//         { admin: req.admin?._id }, // अगर admin है तो उसकी entries
//         { admin: null }            // student QR वाली entries भी आ जाएँ
//       ]
//     }).populate("student");

//     res.json(records);
//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//   }
// };


// module.exports = { markAttendance, getTodayAttendance };




const { Attendance } = require("../models/Attendance");
const { Student } = require("../models/Student");

const markAttendance = async (req, res) => {
  const { name, rollNo, adminQrId } = req.body;

  const admin = await Admin.findOne({ qrId: adminQrId });
  if (!admin) return res.status(404).json({ error: "Invalid QR" });

  const student = await Student.findOne({ 
    name: name.toLowerCase(), 
    rollNo: rollNo.toLowerCase(), 
    admin: admin._id 
  });

  if (!student) return res.status(404).json({ error: "Student not found" });

  // ✅ mark attendance
  const attendance = await Attendance.create({
    student: student._id,
    admin: admin._id,
  });

  res.json({ success: true, attendance });
};

// Get Today’s Attendance (Only Admin)
const getTodayAttendance = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const records = await Attendance.find({
      time: { $gte: start, $lte: end },
      $or: [
        { admin: req.admin?._id }, // logged-in admin entries
        { admin: null }            // public QR entries
      ]
    }).populate("student");

    res.json(records);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { markAttendance, getTodayAttendance };
