import { db } from "../config/database.js";

export const getAllCategories = async () => {
  try {
    const stmt = db.prepare("SELECT * FROM categories");
    const categories = stmt.all();
    return categories;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }
};


export const getCategoryById = async categoryId => {
  try {
    const stmt = db.prepare("SELECT * FROM categories WHERE category_id = ?");
    const category = stmt.get(categoryId);
    return category;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error(`Failed to fetch category by ID: ${error.message}`);
  }
};

export const createCategory = async category_name => {
  try {
    const stmt = db.prepare(
      "INSERT INTO categories (category_name) VALUES (?)"
    );
    const result = stmt.run(category_name);
    return result.lastInsertRowid;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error(`Failed to create category: ${error.message}`);
  }
};

export const updateCategory = async (category_id, category_name) => {
  try {
    const stmt = db.prepare(
      "UPDATE categories SET category_name = ? WHERE category_id = ?"
    );
    const result = stmt.run(category_name, category_id);
    if (result.changes === 0) {
      throw new Error("No category was updated. Possibly invalid category ID.");
    }
    return true;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error(`Failed to update category: ${error.message}`);
  }
};
