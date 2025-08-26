// /routes/expense.routes.js
import express from "express";
import multer from "multer";
import Expense from "../models/expense.models.js";
import { Readable } from "stream";
import { storage, appwriteIds } from "../lib/appwrite.js";
import { requireAuth } from "../middlewares/auth.middlewares.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/submitExpense",requireAuth, upload.single("bill"), async (req, res) => {
  try {
    const { serialNumber, date, purpose, amount, paidBy } = req.body;
    if (!serialNumber || !date || !purpose || !amount || !paidBy) {
      return res.status(400).json({ error: "All fields are required" });
    }

    let billFileId = null;
    let billUrl = null;

    // console.log(req.file);
    
if (req.file) {
  const uniqueId = appwriteIds.ID.unique();

  // Convert buffer to stream
  const fileStream = Readable.from(req.file.buffer);

  const uploaded = await storage.createFile(
    process.env.APPWRITE_BUCKET_ID,
    uniqueId,
    new File([req.file.buffer], req.file.originalname, { type: req.file.mimetype }), // ✅ pass File object
    [appwriteIds.Permission.read(appwriteIds.Role.any())]
  );

  billFileId = uploaded.$id;
  billUrl = `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${uploaded.bucketId}/files/${uploaded.$id}/view?project=${process.env.APPWRITE_PROJECT_ID}`;
}
// console.log(req.user);


const expense = await Expense.create({
      serialNumber: Number(serialNumber),
      date: new Date(date),
      purpose,
      amount: Number(amount),
      paidBy,
      billFileId,
      billUrl,
       userId: req.user.id || req.user._id 
    });

    res.status(201).json({ message: "Saved", expense });
  } catch (err) {
    console.error("Create expense error:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

router.get("/getExpenses/:year",requireAuth, async (req, res) => {
  try {
    const { year } = req.params;
    const start = new Date(`${year}-01-01T00:00:00Z`);
    const end = new Date(`${year}-12-31T23:59:59Z`);

    const expenses = await Expense.find({
      date: { $gte: start, $lte: end }
    }).sort({ date: 1 });

       const formatted = expenses.map(exp => ({
      _id: exp._id,
      serialNumber: exp.serialNumber,
      date: exp.date.toISOString().split("T")[0], // ✅ "YYYY-MM-DD"
      purpose: exp.purpose,
      amount: exp.amount,
      paidBy: exp.paidBy,
      billUrl: exp.billUrl || null,
      userId: exp.userId
    }));

    return res.json(formatted);
    
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
});


export default router;
