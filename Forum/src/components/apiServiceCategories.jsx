const BASE_URL = "http://localhost:3000/api/categories";

// Hjälpfunktion för att kontrollera svar och parsa JSON
const handleResponse = async (response, errorMessage) => {
  if (!response.ok) {
    throw new Error(errorMessage);
  }
  return await response.json();
};

// Hämta alla kategorier
export const fetchCategories = async () => {
  try {
    const response = await fetch(BASE_URL);
    return await handleResponse(response, "Failed to fetch categories");
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// Hämta en kategori baserat på namn
export const fetchCategoryByName = async categoryName => {
  try {
    const response = await fetch(`${BASE_URL}/category/${categoryName}`);
    return await handleResponse(response, "Failed to fetch category by name");
  } catch (error) {
    console.error("Error fetching category by name:", error);
    throw error;
  }
};

// Skapa en ny kategori
export const createCategory = async newCategory => {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCategory),
    });
    return await handleResponse(response, "Failed to create category");
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

// Uppdatera en kategori
export const updateCategory = async (categoryId, updatedCategory) => {
  try {
    const response = await fetch(`${BASE_URL}/${categoryId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedCategory),
    });
    return await handleResponse(response, "Failed to update category");
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};
