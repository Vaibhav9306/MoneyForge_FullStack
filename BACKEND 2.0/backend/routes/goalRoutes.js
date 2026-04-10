import express from "express";
import {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
} from "../controllers/goalController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes protected
router.post("/", verifyToken, createGoal);
router.get("/", verifyToken, getGoals);
router.put("/:id", verifyToken, updateGoal);
router.delete("/:id", verifyToken, deleteGoal);

export default router;
