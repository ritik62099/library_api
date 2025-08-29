
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
  mobile: String,
  address: String,
  monthlyFee: Number,
  payments: [paymentSchema],
});

// rollNo हर admin के लिए unique
studentSchema.index({ admin: 1, rollNo: 1 }, { unique: true });

const Student = mongoose.model("Student", studentSchema);

module.exports = { Student };
