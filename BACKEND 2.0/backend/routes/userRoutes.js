import express from "express";
import { getProfile, updateProfile, getDashboardStats } from "../controllers/userController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes protected
router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateProfile);
router.get("/dashboard-stats", verifyToken, getDashboardStats);

export default router;
