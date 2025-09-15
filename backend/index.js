// index.js
const serverless = require("serverless-http");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// health check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));
app.use("/api/tenants", require("./routes/tenants"));

// **serverless export**
module.exports = serverless(app);
