import express from "express";
import {
  saveIdea,
  getIdeas,
  getIdeaById,
  updateIdeaStatus,
  deleteIdea,
} from "../controllers/ideaController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes protected
router.post("/", verifyToken, saveIdea);
router.get("/", verifyToken, getIdeas);
router.get("/:id", verifyToken, getIdeaById);
router.patch("/:id/status", verifyToken, updateIdeaStatus);
router.delete("/:id", verifyToken, deleteIdea);

export default router;
