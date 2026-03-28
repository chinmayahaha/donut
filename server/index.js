
require("dotenv").config({ path: "../.env" }); // loads .env from project root
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────
app.use(cors());                   // allow frontend requests
app.use(express.json());           // parse JSON request bodies
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// ── Database Connection ───────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1); // stop server if DB fails — no silent errors
  });

// ── Health Check Route ────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Donut API is running",
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes (add as you build) ─────────────────────────────
// app.use("/api/users",         require("./routes/users"));
 app.use("/api/auth",          require("./routes/auth"));
 app.use("/api/projects",      require("./routes/projects"));
// app.use("/api/subscriptions", require("./routes/subscriptions"));

// ── 404 Handler ───────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ── Global Error Handler ──────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Server error:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

// ── Start Server ──────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});