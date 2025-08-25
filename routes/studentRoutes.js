// const express = require("express");
// const {
//   addStudent,
//   getStudents,
//   getStudentById,
//   updateStudent,
//   deleteStudent,
//   updatePayment,
// } = require("../controllers/studentController");

// const router = express.Router();

// router.post("/", addStudent);
// router.get("/", getStudents);
// router.get("/:id", getStudentById);
// router.put("/:id", updateStudent);    // Update student
// router.delete("/:id", deleteStudent); // Delete student
// router.put("/students/:id/payment", updatePayment);
// router.put("/:id/payment", updatePayment); // ✅ this is needed

// module.exports = router;


const express = require("express");
const {
  addStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  updatePayment,
} = require("../controllers/studentController");

const protectAdmin = require("../middleware/authMiddleware"); // ✅ import middleware

const router = express.Router();

// All student routes should be protected
router.post("/", protectAdmin, addStudent);
router.get("/", protectAdmin, getStudents);
router.get("/:id", protectAdmin, getStudentById);
router.put("/:id", protectAdmin, updateStudent);    // Update student
router.delete("/:id", protectAdmin, deleteStudent); // Delete student
router.put("/:id/payment", protectAdmin, updatePayment); // ✅ payment update

module.exports = router;
