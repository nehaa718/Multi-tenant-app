const Tenant = require("../models/Tenant");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Upgrade Tenant Subscription (Admin only)
exports.upgradeTenant = async (req, res) => {
  try {
    const { slug } = req.params;
    const tenant = await Tenant.findOne({ slug });

    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // Ensure admin can only upgrade their own tenant
    if (tenant._id.toString() !== req.user.tenant._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to upgrade this tenant" });
    }

    if (tenant.subscription === "Pro") {
      return res.status(400).json({ message: "Tenant already Pro" });
    }

    tenant.subscription = "Pro";
    await tenant.save();
    res.json({ message: `${tenant.name} upgraded to Pro` });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Invite a new user (Admin only)
exports.inviteUser = async (req, res) => {
  try {
    const { email, role } = req.body;
    if (!email || !role) {
      return res.status(400).json({ message: "Email and role are required" });
    }
    if (!["Admin", "Member"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash("password", 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      role,
      tenant: req.user.tenant._id,
    });

    res.status(201).json({
      message: `User ${user.email} created under tenant ${req.user.tenant.name}`,
      user: { email: user.email, role: user.role, tenant: req.user.tenant.slug },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
