// const mongoose = require("mongoose");

// const paymentSchema = new mongoose.Schema({
//   month: String, // "YYYY-MM"
//   paid: { type: Boolean, default: false },
//   amount: Number,
// });

// const studentSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   rollNo: { type: String, required: true, unique: true },
//   email: String,
//   mobile: String,
//   address: String,
//   monthlyFee: Number,
//   payments: [paymentSchema],
// });

// const Student = mongoose.model("Student", studentSchema);

// module.exports = { Student };


const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  month: String, // "YYYY-MM"
  paid: { type: Boolean, default: false },
  amount: Number,
});

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNo: { type: String, required: true, unique: true },
  email: String,
  mobile: String,
  address: String,
  monthlyFee: Number,
  payments: [paymentSchema],

  // ✅ Add admin field to link student → admin
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
});

const Student = mongoose.model("Student", studentSchema);

module.exports = { Student };
