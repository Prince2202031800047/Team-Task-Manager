const express = require("express");
const router = express.Router();
const Project = require("../models/Project");

// 🔐 Middleware
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// ✅ Create Project (Only Admin)
router.post("/", authMiddleware, roleMiddleware("Admin"), async (req, res) => {
  try {
    const project = await Project.create({
      ...req.body,
      createdBy: req.user.id
    });

    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all projects (Logged in users only)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("members createdBy");

    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;