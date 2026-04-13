import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import financeRoutes from "./routes/financeRoutes.js";
import ideaRoutes from "./routes/ideaRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

// 🔐 Load env
dotenv.config();

const app = express();

// 🔌 Connect DB
connectDB();

// 🧩 Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000", 
      "http://localhost:5173", 
      "http://127.0.0.1:5173", 
      "http://localhost:4173",
      "http://127.0.0.1:4173"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📦 Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/ideas", ideaRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/ai", aiRoutes);

// 🧪 Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "MoneyForge Backend Running 🚀",
    timestamp: new Date().toISOString(),
  });
});

// 🌐 Default
app.get("/", (req, res) => {
  res.json({ msg: "MoneyForge API v1.0 🚀" });
});

// ❌ 404 handler
app.use((req, res) => {
  res.status(404).json({ msg: "Route not found ❌" });
});

// ❌ Global error handler
app.use((err, req, res, next) => {
  console.error("Global Error:", err.message);
  res.status(500).json({ msg: "Internal server error ❌" });
});

// 🚀 Start
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 Routes: /api/auth | /api/user | /api/finance | /api/ideas | /api/goals | /api/ai`);
});