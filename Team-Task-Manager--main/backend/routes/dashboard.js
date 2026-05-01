const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

// Dashboard stats
router.get("/", authMiddleware, async (req, res) => {
  try {
    // 🔥 ALL TASKS (no filter)
    const tasks = await Task.find();

    const total = tasks.length;

 const completed = tasks.filter(t => t.status.toLowerCase() === "completed").length;
 const pending = tasks.filter(t => t.status.toLowerCase() === "pending").length;
 const inProgress = tasks.filter(t => t.status.toLowerCase() === "in progress").length;

    const overdue = tasks.filter(t =>
      t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "completed"
    ).length;

    res.json({
      total,
      completed,
      pending,
      inProgress,
      overdue
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;