const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");


// =======================
// 🔐 SIGNUP
// =======================
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || "Member",
    });

    res.status(201).json({
      message: "User created successfully",
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// =======================
// 🔐 LOGIN
// =======================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// =======================
// 👥 GET ALL USERS (Admin Only)
// =======================
router.get("/users", authMiddleware, async (req, res) => {
  try {
    // 🔥 Role check
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const users = await User.find().select("_id name email role");

    res.json(users);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// =======================
module.exports = router;