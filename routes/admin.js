import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { auth } from "../middleware/auth.js";


import User from "../models/User.js";
import Application from "../models/Application.js";

const router = express.Router();

// Admin registration
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
        code: "EMAIL_EXISTS",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin user
    const adminUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });

    await adminUser.save();

    // Generate token
    const token = jwt.sign(
      { id: adminUser._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      message: "Admin registered successfully",
      token,
      user: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      message: "Server error",
      code: "SERVER_ERROR",
    });
  }
});

// Admin login
router.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({
        message: "Name and password are required",
        code: "VALIDATION_ERROR",
      });
    }

    // Find user by username
    const user = await User.findOne({ name });
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
        code: "INVALID_CREDENTIALS",
      });
    }

    // Check if user is admin
    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Unauthorized access",
        code: "UNAUTHORIZED",
      });
    }

    // Validate password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        message: "Invalid credentials",
        code: "INVALID_CREDENTIALS",
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      message: "Server error",
      code: "SERVER_ERROR",
    });
  }
});

// Get all applications
router.get("/applications", auth, async (req, res) => {
  try {
    const applications = await Application.find();
    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Update application status
router.put("/applications/:id/status", auth, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = req.body.status;
    await application.save();

    res.json(application);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

export default router;
