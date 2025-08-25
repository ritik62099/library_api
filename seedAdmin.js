// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const Admin = require("./models/Admin");

// dotenv.config();

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(async () => {
//     const exists = await Admin.findOne({ username: "ritik" });
//     if (exists) {
//       console.log("Admin already exists");
//       process.exit(0);
//     }

//     const admin = new Admin({
//       username: "ritik",
//       password: "123456", // ye automatically hash ho jayega pre-save hook se
//     });

//     await admin.save();
//     console.log("✅ Admin created successfully");
//     process.exit(0);
//   })
//   .catch((err) => {
//     console.error(err);
//     process.exit(1);
//   });


const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Admin = require("./models/Admin");

dotenv.config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Check if already exists
    const existing = await Admin.findOne({ username: "admin" });
    if (existing) {
      console.log("⚠️ Admin already exists:", existing.username);
      process.exit(0);
    }

    // Create new admin (password auto-hash होगा pre-save hook से)
    const admin = new Admin({
      username: "admin",
      password: "123456",
    });

    await admin.save();
    console.log("✅ Admin created successfully!");
    console.log("👉 Username: admin");
    console.log("👉 Password: 123456");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding admin:", err);
    process.exit(1);
  }
}

createAdmin();
