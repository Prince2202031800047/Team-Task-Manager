const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, async (req, res) => {
  try {
    let query = {};

    // 🔥 Member → only their tasks
    if (req.user.role !== "Admin") {
      query.assignedTo = req.user.id;
    }

    const tasks = await Task.find(query);

    const totalTasks = tasks.length;

    const completed = tasks.filter(t => t.status === "Done").length;
    const inProgress = tasks.filter(t => t.status === "In Progress").length;
    const todo = tasks.filter(t => t.status === "To Do").length;

    const overdue = tasks.filter(
      t =>
        t.dueDate &&
        new Date(t.dueDate) < new Date() &&
        t.status !== "Done"
    ).length;

    res.json({
      totalTasks,
      completed,
      inProgress,
      todo,
      overdue,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;