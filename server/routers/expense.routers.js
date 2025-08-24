import express from "express";
import Expense from "../models/Expense.js";
import { requireAuth } from "../middlewares/auth.middlewares.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// Configure file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Submit expense form
router.post("/submit", requireAuth, upload.single("bill"), async (req, res) => {
  try {
    const { sino, date, purpose, amount, paidby } = req.body;

    const expense = new Expense({
      userId: req.user._id,
      serialNumber: sino,
      date,
      purpose,
      amount,
      paidBy: paidby,
      billUrl: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await expense.save();
    res
      .status(201)
      .json({ message: "Expense submitted successfully", expense });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
