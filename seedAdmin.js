const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Admin = require("./models/Admin");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    const exists = await Admin.findOne({ username: "ritik" });
    if (exists) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const admin = new Admin({
      username: "ritik",
      password: "123456", // ye automatically hash ho jayega pre-save hook se
    });

    await admin.save();
    console.log("✅ Admin created successfully");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
