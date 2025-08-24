// routes/auth.js
import express from "express";
import User from "../models/user.models.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// helper to create JWT
function createToken(user) {
  return jwt.sign(
    {
      id: user._id,
      fullname: user.fullname,
      email: user.email,
      username: user.username
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

/**
 * Register
 * body: { fullname, email, username, password }
 */
router.post("/ppsignup", async (req, res) => {
  try {
    const { fullname, email, username, password } = req.body;
    if (!fullname || !email || !username || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) {
      return res.status(409).json({ error: "Email or username already in use" });
    }

    const user = await User.create({ fullname, email, username, password });
    const token = createToken(user);

    // store JWT in httpOnly cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      message: "Registered successfully",
      user: { id: user._id, fullname: user.fullname, email: user.email, username: user.username }
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * Login
 * body: { usernameOrEmail, password }
 */
router.post("/pplogin", async (req, res) => {
  try {
    const { username, password } = req.body;

    // console.log(username);
    
    if (!username || !password) {
      return res.status(400).json({ error: "Both fields required" });
    }

    const user = await User.findOne({
      $or: [{ email: username.toLowerCase() }, { username: username.toLowerCase() }]
    });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = createToken(user);

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      message: "Login successful",
      user: { id: user._id, fullname: user.fullname, email: user.email, username: user.username }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * Me (who is logged in)
 */
router.get("/me", (req, res) => {
  const token = req.cookies?.jwt;
  if (!token) return res.json({ user: null });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.json({ user: decoded });
  } catch (err) {
    return res.json({ user: null });
  }
});

/**
 * Logout
 */
router.post("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.json({ message: "Logged out" });
});

export default router;
