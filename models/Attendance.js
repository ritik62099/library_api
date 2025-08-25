// import mongoose from "mongoose";

// const attendanceSchema = new mongoose.Schema({
//   student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
//   time: { type: Date, default: Date.now }
// });

// export const Attendance = mongoose.model("Attendance", attendanceSchema);


const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  time: { type: Date, default: Date.now },
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = { Attendance };
