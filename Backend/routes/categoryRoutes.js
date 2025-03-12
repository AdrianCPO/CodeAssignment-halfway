import express from "express";
import {
  getAllCategoriesController,
  getCategoryByNameController,
} from "../controllers/categoryController.js";

export const categoryRoutes = express.Router();

// Route för att hämta alla kategorier
categoryRoutes.get("/", getAllCategoriesController);

// Route för att hämta en kategori via namn
categoryRoutes.get("/category/:categoryName", getCategoryByNameController);
