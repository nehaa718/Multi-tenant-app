const express = require("express");
const serverless = require("serverless-http"); // Install this
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));
app.use("/api/tenants", require("./routes/tenants"));

// Remove app.listen
module.exports = app;
module.exports.handler = serverless(app); // Vercel ke liye
