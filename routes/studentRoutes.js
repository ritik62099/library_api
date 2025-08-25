const express = require("express");
const {
  addStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  updatePayment,
} = require("../controllers/studentController");

const router = express.Router();

router.post("/", addStudent);
router.get("/", getStudents);
router.get("/:id", getStudentById);
router.put("/:id", updateStudent);    // Update student
router.delete("/:id", deleteStudent); // Delete student
router.put("/students/:id/payment", updatePayment);
router.put("/:id/payment", updatePayment); // ✅ this is needed

module.exports = router;
