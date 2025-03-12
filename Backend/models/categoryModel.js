import { db } from "../config/database.js";

// Hämta alla kategorier
export const getAllCategories = async () => {
  try {
    console.log("Fetching categories from SQLite...");
    const stmt = db.prepare("SELECT * FROM categories");
    const categories = stmt.all();
    console.log("Fetched categories:", categories);
    return categories;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }
};

// Hämta kategori baserat på namn
export const getCategoryByName = async categoryName => {
  try {
    console.log(`Fetching category with name: ${categoryName}`);
    const stmt = db.prepare("SELECT * FROM categories WHERE category_name = ?");
    const category = stmt.get(categoryName); // Hämta kategori via namn

    return category;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error(`Failed to fetch category by name: ${error.message}`);
  }
};
