const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ Create Task (Assign to user OR self)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      assignedTo: req.body.assignedTo || req.user.id
    });

    res.status(201).json(task);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get tasks
router.get("/", authMiddleware, async (req, res) => {
  try {
    let query = {};

    // Admin → sab dekhega
    if (req.user.role !== "Admin") {
      query.assignedTo = req.user.id;
    }

    const tasks = await Task.find(query)
      .populate("assignedTo project");

    res.json(tasks);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(task);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;