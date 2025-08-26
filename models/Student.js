// const mongoose = require("mongoose");

// const paymentSchema = new mongoose.Schema({
//   month: String, // "YYYY-MM"
//   paid: { type: Boolean, default: false },
//   amount: Number,
// });

// const studentSchema = new mongoose.Schema({
//   admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true }, // ✅ हर student किसी admin से जुड़ा
//   name: { type: String, required: true },
//   rollNo: { type: String, required: true },
//   email: String,
//   mobile: String,
//   address: String,
//   monthlyFee: Number,
//   payments: [paymentSchema],
// });

// // ✅ Composite unique index → rollNo हर admin के लिए unique रहेगा
// studentSchema.index({ admin: 1, rollNo: 1 }, { unique: true });
// // Optional: अगर email भी unique चाहिए per-admin
// studentSchema.index({ admin: 1, email: 1 }, { unique: true, sparse: true });

// const Student = mongoose.model("Student", studentSchema);

// module.exports = { Student };


// const { Attendance } = require("../models/Attendance");
// const { Student } = require("../models/Student");

// // Mark Attendance (Public)
// const markAttendance = async (req, res) => {
//   try {
//     console.log("📩 Attendance request body:", req.body);

//     const { name, rollNo } = req.body;
//     if (!name || !rollNo) {
//       return res.status(400).json({ error: "Name and Roll No required" });
//     }

//     // Case-insensitive match
//     const student = await Student.findOne({
//       name: new RegExp("^" + name + "$", "i"),
//       rollNo: new RegExp("^" + rollNo + "$", "i"),
//     });

//     if (!student) {
//       console.log("❌ Student not found:", rollNo, name);
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
//       admin: null, // ✅ public entry me admin nahi hoga
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

//     console.log("✅ Attendance saved:", attendance);
//     return res.json({ success: true, student, attendance, nextDue });
//   } catch (err) {
//     console.error("🔥 Attendance error:", err);
//     return res.status(500).json({ error: err.message || "Server error" });
//   }
// };



const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  month: String, // "YYYY-MM"
  paid: { type: Boolean, default: false },
  amount: Number,
});

const studentSchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
  name: { type: String, required: true },
  rollNo: { type: String, required: true },
  email: String,
  mobile: String,
  address: String,
  monthlyFee: Number,
  payments: [paymentSchema],
});

// ✅ Composite unique index
studentSchema.index({ admin: 1, rollNo: 1 }, { unique: true });
studentSchema.index({ admin: 1, email: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("Student", studentSchema);
