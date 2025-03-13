import express from "express";
import {
  getThreads,
  getThreadByIdController,
  getThreadsByCategoryController,
  newThread,
  editThread,
  deleteThreadById,
} from "../controllers/threadController.js";

export const threadRoutes = express.Router();

threadRoutes.get("/", getThreads);
threadRoutes.get("/category/:categoryName", getThreadsByCategoryController);
threadRoutes.get("/:threadId", getThreadByIdController);

threadRoutes.post("/new-thread", newThread);
threadRoutes.put("/edit-thread/:threadId", editThread);
threadRoutes.delete("/delete-thread/:threadId", deleteThreadById);

// Hantera 404 för ogiltiga rutter
threadRoutes.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});
