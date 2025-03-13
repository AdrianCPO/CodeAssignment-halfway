import express from "express";
import {
  getAllCategoriesController,
  getCategoryByNameController,
  createCategoryController,
  updateCategoryController,
} from "../controllers/categoryController.js";

export const categoryRoutes = express.Router();

// Route för att hämta alla kategorier
categoryRoutes.get("/", getAllCategoriesController);

// Route för att hämta en kategori via namn
categoryRoutes.get("/category/:categoryName", getCategoryByNameController);

// Route för att skapa en ny kategori
categoryRoutes.post("/", createCategoryController);

// Route för att uppdatera en kategori
categoryRoutes.put("/:categoryId", updateCategoryController);

// Hantera 404 för ogiltiga rutter
categoryRoutes.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});
