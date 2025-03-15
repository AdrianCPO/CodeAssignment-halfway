import express from "express";
import {
  getComments,
  getCommentById,
  getCommentsByThreadIdController,
  newComment,
  editComment,
  deleteCommentById,
} from "../controllers/commentController.js";

export const commentRoutes = express.Router();

commentRoutes.get("/", getComments);
commentRoutes.get("/comment/:id", getCommentById);
commentRoutes.get("/:threadId", getCommentsByThreadIdController);
commentRoutes.post("/:threadId/new-comment", newComment);
commentRoutes.put("/edit-comment/:id", editComment);
commentRoutes.delete("/delete-comment/:id", deleteCommentById);

commentRoutes.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});


