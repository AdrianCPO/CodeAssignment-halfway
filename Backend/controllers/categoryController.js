import {
  getAllCategories,
  getCategoryById,
  getCategoryByName,
  createCategory,
  updateCategory,
} from "../models/categoryModel.js";
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
    const category = await getCategoryByName(categoryName);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    handleServerError(res, "fetching category by name", error);
  }
};

// Hämta kategori baserat på ID (om du vill ha denna endpoint)
export const getCategoryByIdController = async (req, res) => {
  const categoryId = req.params.categoryId;
  try {
    const category = await getCategoryById(categoryId);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    handleServerError(res, "fetching category by ID", error);
  }
};

// Skapa en ny kategori
export const createCategoryController = async (req, res) => {
  const { category_name } = req.body;
  if (!category_name) {
    return res.status(400).json({ error: "Missing category_name" });
  }

  try {
    const newCategoryId = await createCategory(category_name);
    res
      .status(201)
      .json({ message: "Category created", categoryId: newCategoryId });
  } catch (error) {
    handleServerError(res, "creating category", error);
  }
};

// Uppdatera en kategori
export const updateCategoryController = async (req, res) => {
  const { category_name } = req.body;
  const { categoryId } = req.params;

  if (!categoryId || !category_name) {
    return res
      .status(400)
      .json({ error: "Missing category ID or category_name" });
  }

  try {
    await updateCategory(categoryId, category_name);
    res.json({ message: "Category updated" });
  } catch (error) {
    handleServerError(res, "updating category", error);
  }
};
