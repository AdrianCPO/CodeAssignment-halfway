// apiServiceCategories.jsx
import { apiRequest } from "./apiRequest";

const BASE_URL = "http://localhost:3000/api/categories";

export const fetchCategories = async () => {
  const url = BASE_URL;
  return await apiRequest(url, {}, "Failed to fetch categories");
};

export const fetchCategoryByName = async categoryName => {
  const url = `${BASE_URL}/category/${categoryName}`;
  return await apiRequest(url, {}, "Failed to fetch category by name");
};

export const createCategory = async newCategory => {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newCategory),
  };
  return await apiRequest(BASE_URL, options, "Failed to create category");
};

export const updateCategory = async (categoryId, updatedCategory) => {
  const url = `${BASE_URL}/${categoryId}`;
  const options = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedCategory),
  };
  return await apiRequest(url, options, "Failed to update category");
};
