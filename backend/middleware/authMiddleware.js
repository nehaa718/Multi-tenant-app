const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).populate("tenant");
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
