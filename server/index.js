// server.js
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import authRoutes from "./routers/auth.routers.js";
import { requireAuth } from "./middlewares/auth.middlewares.js";
import expensesRoutes from "./routers/expense.routers.js";

dotenv.config();

const app = express();
app.use(express.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- DB ---
const { MONGODB_URI, PORT = 3000, NODE_ENV } = process.env;

if (!MONGODB_URI) {
  console.error("Please set MONGODB_URI in .env");
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((e) => {
    console.error("MongoDB connection error:", e);
    process.exit(1);
  });

// --- Middlewares ---

app.use(cookieParser());

// Serve static files (CSS, JS, images etc.)
app.use("/static", express.static(path.join(__dirname, "public")));

// Auth API routes
app.use("/api/auth", authRoutes);


app.use("/api/expenses", expensesRoutes);

// Public login page
app.get("/pplogin", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "pplogin.html"));
});

app.get("/ppsignup", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "ppsignup.html"));
});

app.get("/index", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});
app.get("/expenses", requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "expenses.html"));
});

// Protected page route
app.get("/ppdashboard", requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "ppdashboard.html"));
});
app.get("/gallery", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "gallery.html"));
});
app.get("/members", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "members.html"));
});
app.get("/contactus", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "contactus.html"));
});
app.get("/survey",requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "survey.html"));
});

// Example protected API (JSON)
// app.get("/api/protected/data", requireAuth, (req, res) => {
//   res.json({
//     message: "Secret data only for logged-in users.",
//     user: req.user // <- from JWT middleware
//   });
// });

// Root
app.get("/", (req, res) => {
  res.redirect("/index");
});

// Start
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
