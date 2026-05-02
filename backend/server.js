const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// =======================
// Middleware
// =======================
app.use(cors({ origin: "*" }));
app.use(express.json());

// =======================
// Routes import
// =======================
const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/project");
const taskRoutes = require("./routes/task");
const dashboardRoutes = require("./routes/dashboard");

// =======================
// API Routes
// =======================
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);

// =======================
// Health route
// =======================
app.get("/health", (req, res) => {
  res.send("OK");
});

// =======================
// 🔥 FRONTEND SERVE (FINAL FIX)
// =======================

// ✅ Absolute path fix (Railway safe)
const frontendPath = path.resolve(__dirname, "../frontend/dist");

app.use(express.static(frontendPath));

app.use((req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// =======================
// MongoDB
// =======================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => console.log("❌ MongoDB Error:", err));

// =======================
// Server start
// =======================
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});