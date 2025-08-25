const express = require("express");
const { markAttendance, getTodayAttendance } = require("../controllers/attendanceController");
const protectAdmin = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/mark", protectAdmin, markAttendance);
router.get("/today", protectAdmin, getTodayAttendance);

module.exports = router;
