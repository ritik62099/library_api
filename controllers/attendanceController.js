const { Attendance } = require("../models/Attendance");
const { Student } = require("../models/Student");

// Mark Attendance (Public route allowed)
// const markAttendance = async (req, res) => {
//   try {
//     console.log("📩 Attendance request body:", req.body);

//     const { studentId, name, rollNo } = req.body;

//     let student;

//     if (studentId) {
//       // ✅ Agar admin call kare to ID use kar le
//       student = await Student.findById(studentId);
//     } else if (name && rollNo) {
//       // ✅ Agar student khud mark kare to name + rollNo se find kar le
//       student = await Student.findOne({
//         name: new RegExp("^" + name + "$", "i"),
//         rollNo: new RegExp("^" + rollNo + "$", "i"),
//       });
//     }

//     if (!student) {
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
//       return res.status(400).json({ error: "Attendance already marked today" });
//     }

//     // Save attendance
//     const attendance = await Attendance.create({
//       student: student._id,
//       admin: req.admin ? req.admin._id : null, // ✅ agar admin hoga to save kar le
//       time: new Date(),
//     });

//     // Calculate next payment month
//     const lastPaid = student.payments
//       ?.filter((p) => p.paid)
//       .sort((a, b) => a.month.localeCompare(b.month))
//       .pop();

//     let nextMonth = new Date();
//     if (lastPaid) {
//       const [year, month] = lastPaid.month.split("-").map(Number);
//       nextMonth = new Date(year, month, 1);
//     }

//     const nextDue = nextMonth.toLocaleString("default", {
//       month: "long",
//       year: "numeric",
//     });

//     return res.json({ success: true, student, attendance, nextDue });
//   } catch (err) {
//     console.error("🔥 Attendance error:", err);
//     return res.status(500).json({ error: err.message || "Server error" });
//   }
// };

const markAttendance = async (req, res) => {
  try {
    console.log("📩 Attendance request body:", req.body);

    const { studentId, name, rollNo } = req.body;

    let student;

    if (studentId) {
      // ✅ Agar admin call kare to ID use kar le
      student = await Student.findById(studentId);
    } else if (name && rollNo) {
      // ✅ Agar student khud mark kare to name + rollNo se find kar le
      student = await Student.findOne({
        name: new RegExp("^" + name + "$", "i"),
        rollNo: new RegExp("^" + rollNo + "$", "i"),
      });
    }

    if (!student) {
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
      return res.status(400).json({ error: "Attendance already marked today" });
    }

    // ✅ Yaha fix kiya
    const attendance = await Attendance.create({
      student: student._id,
      admin: req.admin ? req.admin._id : student.admin, // <<<< FIXED LINE
      time: new Date(),
    });

    return res.json({ success: true, student, attendance });
  } catch (err) {
    console.error("🔥 Attendance error:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
};




const getTodayAttendance = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    // ✅ Sirf current admin ke records
    const records = await Attendance.find({
      time: { $gte: start, $lte: end },
      admin: req.admin._id   // <- filter by logged-in admin
    }).populate("student");

    res.json(records);
  } catch (err) {
    console.error("🔥 Error in getTodayAttendance:", err);
    res.status(500).json({ error: "Server error" });
  }
};



module.exports = { markAttendance, getTodayAttendance };
