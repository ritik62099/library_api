const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  month: String, // "YYYY-MM"
  paid: { type: Boolean, default: false },
  amount: Number,
});

const studentSchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true }, // ✅ हर student किसी admin से जुड़ा
  name: { type: String, required: true },
  rollNo: { type: String, required: true },
  email: String,
  mobile: String,
  address: String,
  monthlyFee: Number,
  payments: [paymentSchema],
});

// ✅ Composite unique index → rollNo हर admin के लिए unique रहेगा
studentSchema.index({ admin: 1, rollNo: 1 }, { unique: true, sparse: true  });
// Optional: अगर email भी unique चाहिए per-admin
studentSchema.index({ admin: 1, email: 1 }, { unique: true, sparse: true });

const Student = mongoose.model("Student", studentSchema);

module.exports = { Student };
