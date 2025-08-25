// // const express = require("express");
// // const { markAttendance, getTodayAttendance } = require("../controllers/attendanceController");
// // const protectAdmin = require("../middleware/authMiddleware");

// // const router = express.Router();

// // router.post("/mark", markAttendance);
// // router.get("/today", protectAdmin, getTodayAttendance);

// // module.exports = router;


// const express = require("express");
// const { markAttendance, getTodayAttendance } = require("../controllers/attendanceController");
// const protectAdmin = require("../middleware/authMiddleware");

// const router = express.Router();

// // ✅ Public route (students QR से खुद mark करेंगे)
// router.post("/mark", markAttendance);

// // ✅ Only admin can see today's full list
// router.get("/today", protectAdmin, getTodayAttendance);

// module.exports = router;


const express = require("express");
const { markAttendance, getTodayAttendance } = require("../controllers/attendanceController");
const protectAdmin = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Public route: students mark attendance (QR or form)
router.post("/mark", markAttendance);

// 🔐 Private route: only admin can see today's attendance
router.get("/today", protectAdmin, getTodayAttendance);

module.exports = router;

