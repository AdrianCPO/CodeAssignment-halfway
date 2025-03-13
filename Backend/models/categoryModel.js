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
    const category = stmt.get(categoryName);
    return category;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error(`Failed to fetch category by name: ${error.message}`);
  }
};

// Hämta kategori baserat på ID
export const getCategoryById = async categoryId => {
  try {
    console.log(`Fetching category with ID: ${categoryId}`);
    const stmt = db.prepare("SELECT * FROM categories WHERE category_id = ?");
    const category = stmt.get(categoryId);
    return category;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error(`Failed to fetch category by ID: ${error.message}`);
  }
};

// Skapa en ny kategori
export const createCategory = async category_name => {
  try {
    console.log(`Creating category with name: ${category_name}`);
    const stmt = db.prepare(
      "INSERT INTO categories (category_name) VALUES (?)"
    );
    const result = stmt.run(category_name);
    console.log(`Created category with ID: ${result.lastInsertRowid}`);
    return result.lastInsertRowid;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error(`Failed to create category: ${error.message}`);
  }
};

// Uppdatera en kategori
export const updateCategory = async (category_id, category_name) => {
  try {
    console.log(
      `Updating category ID: ${category_id} to name: ${category_name}`
    );
    const stmt = db.prepare(
      "UPDATE categories SET category_name = ? WHERE category_id = ?"
    );
    const result = stmt.run(category_name, category_id);
    if (result.changes === 0) {
      throw new Error("No category was updated. Possibly invalid category ID.");
    }
    console.log(`Updated category ID: ${category_id}`);
    return true;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error(`Failed to update category: ${error.message}`);
  }
};
