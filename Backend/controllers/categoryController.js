import {
  getAllCategories,
  getCategoryByName,
} from "../models/categoryModel.js"; // Importera getCategoryByName
import { handleServerError } from "../utils/handleServerError.js";

// Hämta alla kategorier
export const getAllCategoriesController = async (req, res) => {
  try {
    const categories = await getAllCategories();
    res.json(categories);
  } catch (error) {
    handleServerError(res, "fetching categories", error);
  }
};

// Hämta kategori baserat på namn
export const getCategoryByNameController = async (req, res) => {
  const categoryName = req.params.categoryName; // Ta emot kategorinamn från URL

  try {
    const category = await getCategoryByName(categoryName); // Använd rätt funktion

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(category); // Returnera den hittade kategorin
  } catch (error) {
    handleServerError(res, "fetching category by name", error);
  }
};
