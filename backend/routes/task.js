const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const Project = require("../models/Project");
const authMiddleware = require("../middleware/authMiddleware");


// =======================
// ✅ Create Task
// =======================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { project, assignedTo } = req.body;

    // 🔥 Check project exists
    const projectData = await Project.findById(project);
    if (!projectData) {
      return res.status(404).json({ message: "Project not found" });
    }

    // 🔥 Check user is member of project
    if (!projectData.members.includes(req.user.id)) {
      return res.status(403).json({ message: "Not part of this project" });
    }

    const task = await Task.create({
      ...req.body,
      assignedTo: assignedTo || req.user.id,
    });

    res.status(201).json(task);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// =======================
// ✅ Get Tasks
// =======================
router.get("/", authMiddleware, async (req, res) => {
  try {
    let query = {};

    if (req.user.role !== "Admin") {
      query.assignedTo = req.user.id; // 🔥 member restriction
    }

    const tasks = await Task.find(query)
      .populate("assignedTo", "name email")
      .populate("project", "name");

    res.json(tasks);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// =======================
// ✅ Update Task
// =======================
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // 🔥 Only admin OR assigned user
    if (
      req.user.role !== "Admin" &&
      task.assignedTo.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedTask);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// =======================
// ✅ Delete Task (Admin only)
// =======================
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Only admin can delete" });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: "Task deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;