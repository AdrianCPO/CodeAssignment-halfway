import { useEffect, useState } from "react";
import { fetchCategories } from "../components/apiService";

export const CategoryFilter = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    loadCategories();
  }, []);

  return (
    <div>
      <label htmlFor="filter-label">Filtrera efter kategori: </label>
      <select onChange={e => onSelectCategory(e.target.value)}>
        <option value="">Alla kategorier</option>
        {categories.map(category => (
          <option key={category.category_id} value={category.category_name}>
            {category.category_name}
          </option>
        ))}
      </select>
    </div>
  );
};
