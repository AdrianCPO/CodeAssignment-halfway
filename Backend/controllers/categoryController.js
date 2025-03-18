import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
} from "../models/categoryModel.js";
import { handleServerError } from "../utils/handleServerError.js";

const validateNumericId = (id, res, errorMessage = "Invalid ID format") => {
  if (!id || isNaN(id)) {
    res.status(400).json({ message: errorMessage });
    return false;
  }
  return true;
};

export const getAllCategoriesController = async (req, res) => {
  try {
    const categories = await getAllCategories();
    res.json(categories);
  } catch (error) {
    handleServerError(res, "fetching categories", error);
  }
};

export const getCategoryByIdController = async (req, res) => {
  const categoryId = req.params.categoryId;
  if (!validateNumericId(categoryId, res, "Invalid category ID")) return;

  try {
    const category = await getCategoryById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    handleServerError(res, "fetching category by ID", error);
  }
};

export const createCategoryController = async (req, res) => {
  const { category_name } = req.body;
  if (!category_name) {
    return res.status(400).json({ message: "Missing category_name" });
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

export const updateCategoryController = async (req, res) => {
  const { categoryId } = req.params;
  const { category_name } = req.body;

  if (
    !validateNumericId(categoryId, res, "Invalid category ID") ||
    !category_name
  ) {
    return res
      .status(400)
      .json({ message: "Missing category ID or category_name" });
  }
  try {
    await updateCategory(categoryId, category_name);
    res.json({ message: "Category updated" });
  } catch (error) {
    handleServerError(res, "updating category", error);
  }
};
