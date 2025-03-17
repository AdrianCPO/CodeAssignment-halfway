import { useState, useEffect } from "react";
import { fetchCategories } from "../api/apiServiceCategories";

export const CategorySelect = ({ value, onChange }) => {
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    getCategories();
  }, []);

  const toggleDropdown = () => {
    setIsOpen(prev => !prev);
  };

  const handleCheckboxChange = (event, categoryId) => {
    if (event.target.checked) {
      onChange([...value, categoryId]);
    } else {
      onChange(value.filter(id => id !== categoryId));
    }
  };

  // Visa namnen på de valda kategorierna
  const selectedCategories = categories.filter(cat =>
    value.includes(cat.category_id)
  );
  const buttonLabel =
    selectedCategories.length > 0
      ? selectedCategories.map(cat => cat.category_name).join(", ")
      : "Välj kategori(er)";

  return (
    <div className="category-select-container">
      <button type="button" onClick={toggleDropdown}>
        {buttonLabel}
      </button>
      {isOpen && (
        <div className="category-dropdown">
          {categories.map(cat => (
            <label key={cat.category_id} className="category-select-label">
              <input
                type="checkbox"
                value={cat.category_id}
                checked={value.includes(cat.category_id)}
                onChange={e => handleCheckboxChange(e, cat.category_id)}
              />
              {cat.category_name}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};
