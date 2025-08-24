import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the logged-in user
      required: true,
    },
    serialNumber: { type: Number, required: true },
    date: { type: Date, required: true },
    purpose: { type: String, required: true },
    amount: { type: Number, required: true },
    paidBy: { type: String, required: true },
    billUrl: { type: String }, // File path or URL to uploaded bill
  },
  { timestamps: true }
);

const Expense = mongoose.model("Expense", expenseSchema);
export default Expense;
