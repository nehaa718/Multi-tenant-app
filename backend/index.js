const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const serverless = require("serverless-http");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Health route
app.get("/api/health", (req, res) => res.status(200).json({ status: "ok" }));

// Other routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));
app.use("/api/tenants", require("./routes/tenants"));

// Export as serverless function
module.exports.handler = serverless(app);
