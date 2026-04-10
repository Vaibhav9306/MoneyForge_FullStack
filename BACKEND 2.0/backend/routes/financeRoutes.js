import express from "express";
import {
  addTransaction,
  getTransactions,
  deleteTransaction,
  getChartData,
} from "../controllers/financeController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes protected
router.post("/", verifyToken, addTransaction);
router.get("/", verifyToken, getTransactions);
router.get("/chart", verifyToken, getChartData);
router.delete("/:id", verifyToken, deleteTransaction);

export default router;
