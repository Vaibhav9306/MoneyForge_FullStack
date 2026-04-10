import express from "express";
import { generateAI } from "../controllers/aiController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected — only logged-in users can call AI
router.post("/generate", verifyToken, generateAI);

export default router;
