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


// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const Admin = require("./models/Admin");

// dotenv.config();

// async function createAdmin() {
//   try {
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     // Check if already exists
//     const existing = await Admin.findOne({ username: "admin" });
//     if (existing) {
//       console.log("⚠️ Admin already exists:", existing.username);
//       process.exit(0);
//     }

//     // Create new admin (password auto-hash होगा pre-save hook से)
//     const admin = new Admin({
//       username: "admin",
//       password: "123456",
//     });

//     await admin.save();
//     console.log("✅ Admin created successfully!");
//     console.log("👉 Username: admin");
//     console.log("👉 Password: 123456");

//     process.exit(0);
//   } catch (err) {
//     console.error("❌ Error seeding admin:", err);
//     process.exit(1);
//   }
// }

// createAdmin();



const mongoose = require("mongoose");
const { Student } = require("./models/Student"); // अपने path के हिसाब से adjust करो
const dotenv = require("dotenv");
dotenv.config();
async function fixStudentsAdmin() {
  try {
    
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Step 1: सभी students को सही admin attach करना (पहले से attach वाले skip होंगे)
    // Example: अगर किसी student का admin missing है, तो default admin डालो
    const defaultAdminId = "68ac83b8ae477fbc4ad4ae6a"; // ritik admin
    const result = await Student.updateMany(
      { admin: { $exists: false } },
      { $set: { admin: defaultAdminId } }
    );
    console.log("✅ Students updated (missing admin):", result.modifiedCount);

    // Step 2: Duplicate entries handle करना
    // Same admin + same rollNo वाले duplicates निकालो
    const duplicates = await Student.aggregate([
      {
        $group: {
          _id: { admin: "$admin", rollNo: "$rollNo" },
          ids: { $push: "$_id" },
          count: { $sum: 1 },
        },
      },
      { $match: { count: { $gt: 1 } } },
    ]);

    for (const dup of duplicates) {
      const [keep, ...remove] = dup.ids;
      await Student.deleteMany({ _id: { $in: remove } });
      console.log(`⚠️ Removed duplicates for admin ${dup._id.admin}, rollNo ${dup._id.rollNo}`);
    }

    // Step 3: Index clean-up
    try {
      await Student.collection.dropIndex("rollNo_1");
      console.log("⚠️ Dropped old rollNo index");
    } catch (err) {
      console.log("ℹ️ Old index not found or already removed");
    }

    await Student.collection.createIndex({ admin: 1, rollNo: 1 }, { unique: true });
    console.log("✅ Created composite index: admin + rollNo unique");

    await Student.collection.createIndex({ admin: 1, email: 1 }, { unique: true, sparse: true });
    console.log("✅ Created composite index: admin + email unique (sparse)");

    await mongoose.disconnect();
    console.log("✅ Done, disconnected from DB");
  } catch (err) {
    console.error("🔥 Error:", err);
    process.exit(1);
  }
}

fixStudentsAdmin();
