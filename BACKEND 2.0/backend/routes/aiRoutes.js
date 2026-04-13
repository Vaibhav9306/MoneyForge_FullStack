import express from "express";
import { chatAI, getInsights, getPredictions, generateAI } from "../controllers/aiController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected routes — only logged-in users can access AI
router.post("/chat", verifyToken, chatAI);
router.post("/insights", verifyToken, getInsights);
router.post("/predict", verifyToken, getPredictions);

// Keep for legacy/general tool generation
router.post("/generate", verifyToken, generateAI);

export default router;
