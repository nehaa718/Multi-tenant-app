const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const Tenant = require("./models/Tenant");
const User = require("./models/User");

dotenv.config();

const seed = async () => {
  try {
    await connectDB();

    await Tenant.deleteMany();
    await User.deleteMany();

    const acme = await Tenant.create({ name: "Acme", slug: "acme", subscription: "Free" });
    const globex = await Tenant.create({ name: "Globex", slug: "globex", subscription: "Free" });

    const hashedPassword = await bcrypt.hash("password", 10);

    await User.create([
      { email: "admin@acme.test", password: hashedPassword, role: "Admin", tenant: acme._id },
      { email: "user@acme.test", password: hashedPassword, role: "Member", tenant: acme._id },
      { email: "admin@globex.test", password: hashedPassword, role: "Admin", tenant: globex._id },
      { email: "user@globex.test", password: hashedPassword, role: "Member", tenant: globex._id },
    ]);

    console.log("Database seeded successfully");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
