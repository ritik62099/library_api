const mongoose = require("mongoose");
const { Attendance } = require("./models/Attendance");
const { Student } = require("./models/Student");

const MONGO_URI = "mongodb+srv://ritik:ritik@cluster0.xawraow.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // apna DB name dalna

async function fixAttendance() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("✅ Connected to DB");

    // Sare attendance jisme admin null hai
    const records = await Attendance.find({ admin: null });

    console.log(`📝 Found ${records.length} records to fix...`);

    for (let rec of records) {
      const student = await Student.findById(rec.student).select("admin");
      if (student && student.admin) {
        rec.admin = student.admin; // student ka admin copy karo
        await rec.save();
        console.log(`✔ Fixed attendance for student ${rec.student}`);
      } else {
        console.log(`⚠ No admin found for student ${rec.student}`);
      }
    }

    console.log("🎉 Done fixing attendance records!");
    mongoose.connection.close();
  } catch (err) {
    console.error("🔥 Error:", err);
    mongoose.connection.close();
  }
}

fixAttendance();
