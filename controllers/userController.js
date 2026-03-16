const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        error: "EMAIL_EXISTS",
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({
      error: "SERVER_ERROR",
      message: error.message,
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      deletedAt: null,
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        error: "NOT_FOUND",
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      error: "SERVER_ERROR",
      message: error.message,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, isActive } = req.query;

    const filter = { deletedAt: null };

    if (role) filter.role = role;
    if (isActive) filter.isActive = isActive;

    const users = await User.find(filter)
      .select("-password")
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json(users);
  } catch (error) {
    res.status(500).json({
      error: "SERVER_ERROR",
      message: error.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updates = req.body;

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({
      error: "SERVER_ERROR",
      message: error.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, {
      deletedAt: new Date(),
    });

    res.json({ message: "User soft deleted" });
  } catch (error) {
    res.status(500).json({
      error: "SERVER_ERROR",
      message: error.message,
    });
  }
};