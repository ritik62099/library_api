    const express = require("express");
    const { markAttendance, getTodayAttendance } = require("../controllers/attendanceController");
    const protectAdmin = require("../middleware/authMiddleware");

    const router = express.Router();

    router.post("/mark", markAttendance); // ✅ Public
    router.get("/today", protectAdmin, getTodayAttendance); // ✅ Admin only

    module.exports = router;
