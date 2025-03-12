//Denna mapp definierar alla mina API-rutter och kopplar dem till controller-funktioner.

import express from "express";
import {
  getThreads,
  getThreadByIdController,
  newThread,
  editThread,
  deleteThreadById,
} from "../controllers/threadController.js";

export const threadRoutes = express.Router();

threadRoutes.get("/", getThreads);
threadRoutes.get("/:threadId", getThreadByIdController);
threadRoutes.post("/new-thread", newThread);
threadRoutes.put("/edit-thread/:threadId", editThread);
threadRoutes.delete("/delete-thread/:threadId", deleteThreadById);

// Hantera 404 för ogiltiga rutter
threadRoutes.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});
