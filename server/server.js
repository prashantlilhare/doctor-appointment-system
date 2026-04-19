require('dotenv').config();
const dns = require('dns');
dns.setServers(['1.1.1.1', '8.8.8.8']);
const app = require('./app');
const connectDB = require('./config/db');
const Admin = require('./models/Admin');
const Schedule = require('./models/Schedule');
const bcrypt = require("bcryptjs");





const PORT = process.env.PORT || 5000;

const seedAdmin = async () => {
  const exists = await Admin.findOne({ email: process.env.ADMIN_EMAIL });

  if (!exists) {
    await Admin.create({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD, // plain
    });

    console.log("Admin seeded:", process.env.ADMIN_EMAIL);
  }
};

connectDB()
  .then(async () => {
    console.log("DB connected");

    await seedAdmin();

    // ✅ FIX: schedule seeding properly called
    const seedSchedule = async () => {
      const count = await Schedule.countDocuments();

      if (count === 0) {
        const days = [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ];

        const defaultSchedule = days.map((day) => ({
          day,
          isAvailable: true,
          startTime: "06:00",
          endTime: "22:00",
        }));

        await Schedule.insertMany(defaultSchedule);
        console.log("Schedule seeded");
      }
    };

    await seedSchedule(); // 🔥 THIS WAS MISSING

    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("DB CONNECTION FAILED:", err);
  });

// register route for creating admin (for testing purposes only, remove in production)
  


// app.get("/create-admin", async (req, res) => {
//   try {
//     const hashedPassword = await bcrypt.hash("pravesh455", 10);

//     await User.create({
//       email: "admin@santosh.com",
//       password: hashedPassword,
//       role: "admin",
//     });

//     res.send("✅ Admin Created");
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error creating admin");
//   }
// });