const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const Admin = mongoose.model("Admin", adminSchema);

async function addAdmin() {
  await mongoose.connect("mongodb://localhost:27017/librarydb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const username = "anjali";
  const plainPassword = "12345";
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const existing = await Admin.findOne({ username });
  if (existing) {
    console.log("Admin already exists!");
    mongoose.disconnect();
    return;
  }

  const admin = new Admin({ username, password: hashedPassword });
  await admin.save();
  console.log("Admin added successfully!");
  mongoose.disconnect();
}

addAdmin();
