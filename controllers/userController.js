const User = require("../models/User");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { username, email, password, fullName, gender, dateOfBirth, country } =
    req.body;

  try {
    let user = await User.findOne({ $or: [{ username }, { email }] });
    if (user) {
      return res
        .status(400)
        .json({ msg: "User with that username or email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      username,
      email,
      password: hashedPassword,
      fullName,
      gender,
      dateOfBirth,
      country,
    });

    await user.save();
    res.status(201).json({ msg: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { identifier, password } = req.body;

  try {
    let user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.searchUser = async (req, res) => {
  const { username, email } = req.query;

  try {
    let query = {};
    if (username) {
      query.username = username;
    }
    if (email) {
      query.email = email;
    }
    if (!username && !email) {
      return res
        .status(400)
        .json({ msg: "Please provide a username or email to search" });
    }

    const user = await User.findOne(query).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Search error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};
