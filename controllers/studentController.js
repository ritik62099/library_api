// const { Student } = require("../models/Student");

// // Add new student
// const addStudent = async (req, res, next) => {
//   try {
//     const student = await Student.create(req.body);
//     res.json(student);
//   } catch (err) {
//     next(err);
//   }
// };

// // Get all students
// const getStudents = async (req, res, next) => {
//   try {
//     const students = await Student.find();
//     res.json(students);
//   } catch (err) {
//     next(err);
//   }
// };

// // Get single student
// const getStudentById = async (req, res, next) => {
//   try {
//     const student = await Student.findById(req.params.id);
//     if (!student) return res.status(404).json({ error: "Student not found" });
//     res.json(student);
//   } catch (err) {
//     next(err);
//   }
// };

// // Update student
// const updateStudent = async (req, res, next) => {
//   try {
//     const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!student) return res.status(404).json({ error: "Student not found" });
//     res.json(student);
//   } catch (err) {
//     next(err);
//   }
// };

// // Delete student
// const deleteStudent = async (req, res, next) => {
//   try {
//     const student = await Student.findByIdAndDelete(req.params.id);
//     if (!student) return res.status(404).json({ error: "Student not found" });
//     res.json({ message: "✅ Student deleted successfully" });
//   } catch (err) {
//     next(err);
//   }
// };

// const updatePayment = async (req, res, next) => {
//   try {
//     const student = await Student.findById(req.params.id);
//     if (!student) return res.status(404).json({ error: "Student not found" });

//     const month = new Date().toISOString().slice(0, 7); // current month "YYYY-MM"
//     const amount = student.monthlyFee || req.body.amount || 0;

//     // Check if payment already exists for this month
//     const existing = student.payments.find(p => p.month === month);

//     if (existing) {
//       existing.paid = true;
//       existing.amount = amount;
//     } else {
//       student.payments.push({ month, paid: true, amount });
//     }

//     await student.save();
//     res.json({ success: true, student });
//   } catch (err) {
//     next(err);
//   }
// };



// module.exports = {
//   addStudent,
//   getStudents,
//   getStudentById,
//   updateStudent,
//   deleteStudent,
//   updatePayment,
// };



const { Student } = require("../models/Student");

// Add new student → bind with logged-in admin
const addStudent = async (req, res, next) => {
  try {
    const student = await Student.create({
      ...req.body,
      admin: req.admin._id,  // ✅ ensure student belongs to current admin
    });
    res.json(student);
  } catch (err) {
    next(err);
  }
};

// Get all students → only for current admin
const getStudents = async (req, res, next) => {
  try {
    const students = await Student.find({ admin: req.admin._id }); // ✅ filter by admin
    res.json(students);
  } catch (err) {
    next(err);
  }
};

// Get single student → only if belongs to current admin
const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findOne({ _id: req.params.id, admin: req.admin._id }); // ✅
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json(student);
  } catch (err) {
    next(err);
  }
};

// Update student → only if belongs to current admin
const updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findOneAndUpdate(
      { _id: req.params.id, admin: req.admin._id }, // ✅
      req.body,
      { new: true }
    );
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json(student);
  } catch (err) {
    next(err);
  }
};

// Delete student → only if belongs to current admin
const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findOneAndDelete({ _id: req.params.id, admin: req.admin._id }); // ✅
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json({ message: "✅ Student deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// Update payment → only if belongs to current admin
const updatePayment = async (req, res, next) => {
  try {
    const student = await Student.findOne({ _id: req.params.id, admin: req.admin._id }); // ✅
    if (!student) return res.status(404).json({ error: "Student not found" });

    const month = new Date().toISOString().slice(0, 7); // current month "YYYY-MM"
    const amount = student.monthlyFee || req.body.amount || 0;

    // Check if payment already exists for this month
    const existing = student.payments.find(p => p.month === month);

    if (existing) {
      existing.paid = true;
      existing.amount = amount;
    } else {
      student.payments.push({ month, paid: true, amount });
    }

    await student.save();
    res.json({ success: true, student });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  updatePayment,
};
