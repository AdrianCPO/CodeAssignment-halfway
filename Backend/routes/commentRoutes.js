import express from "express";
import {
  getComments,
  getCommentsByThreadIdController,
  newComment,
  editComment,
  deleteCommentById,
} from "../controllers/commentController.js";

const router = express.Router();

router.get("/", getComments);
router.get("/:threadId", getCommentsByThreadIdController);
router.post("/:threadId/new-comment", newComment);
router.put("/edit-comment/:id", editComment);
router.delete("/delete-comment/:id", deleteCommentById);

// Hantera 404 för ogiltiga rutter
router.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default router;
