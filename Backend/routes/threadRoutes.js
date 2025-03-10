//Denna mapp definierar alla dina API-rutter och kopplar dem till controller-funktioner.
//Exempel: blogRoutes.js som innehåller alla routes för blogginlägg, t.ex. GET, POST, PUT, DELETE.
// /routes/blogRoutes.js
import express from "express";
import {
  getThreads,
  getThreadByIdController,
  newThread,
  editThread,
  deleteThreadById,
} from "../controllers/threadController.js";

const router = express.Router();

router.get("/", getThreads);
router.get("/:threadId", getThreadByIdController);
router.post("/new-thread", newThread);
router.put("/edit-thread/:threadId", editThread);
router.delete("/delete-thread/:threadId", deleteThreadById);

// Hantera 404 för ogiltiga rutter
router.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default router;
