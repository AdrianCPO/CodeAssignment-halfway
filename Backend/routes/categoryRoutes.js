import express from "express";
import {
  getAllCategoriesController,
  
  createCategoryController,
  updateCategoryController,
} from "../controllers/categoryController.js";

export const categoryRoutes = express.Router();


categoryRoutes.get("/", getAllCategoriesController);

categoryRoutes.post("/", createCategoryController);
categoryRoutes.put("/:categoryId", updateCategoryController);

categoryRoutes.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});
