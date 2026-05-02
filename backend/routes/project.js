const express = require("express");
const router = express.Router();
const Project = require("../models/Project");

// 🔐 Middleware
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");


// =======================
// ✅ Create Project (Admin only)
// =======================
router.post("/", authMiddleware, roleMiddleware("Admin"), async (req, res) => {
  try {
    const { name, description } = req.body;

    const project = await Project.create({
      name,
      description,
      createdBy: req.user.id,
      members: [req.user.id], // 🔥 creator auto member
    });

    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// =======================
// ✅ Get only user projects
// =======================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find({
      members: req.user.id, // 🔥 only user's projects
    }).populate("members createdBy", "name email role");

    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// =======================
// ✅ Add member (Admin only)
// =======================
router.post("/add-member", authMiddleware, async (req, res) => {
  try {
    const { projectId, userId } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // 🔥 Only admin (creator) can add
    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only admin can add members" });
    }

    // avoid duplicate
    if (!project.members.includes(userId)) {
      project.members.push(userId);
      await project.save();
    }

    res.json(project);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// =======================
// ✅ Remove member (Admin)
// =======================
router.post("/remove-member", authMiddleware, async (req, res) => {
  try {
    const { projectId, userId } = req.body;

    const project = await Project.findById(projectId);

    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only admin can remove members" });
    }

    project.members = project.members.filter(
      (id) => id.toString() !== userId
    );

    await project.save();

    res.json(project);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;