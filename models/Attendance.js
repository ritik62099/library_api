const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: false }, // ✅ not required
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  time: { type: Date, default: Date.now },
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = { Attendance };
