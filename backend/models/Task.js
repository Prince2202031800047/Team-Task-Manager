const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed"],
    default: "Pending",
  },

  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },

  // 🔥 IMPORTANT
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  dueDate: {
    type: Date,
  }

}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);