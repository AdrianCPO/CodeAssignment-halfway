import { useState, useEffect } from "react";
import { fetchCategories } from "../components/apiServiceCategories";

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

  const handleCheckboxChange = (e, categoryId) => {
    if (e.target.checked) {
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
    <div style={{ position: "relative", display: "inline-block" }}>
      <button type="button" onClick={toggleDropdown}>
        {buttonLabel}
      </button>
      {isOpen && (
        <div
          style={{
            position: "absolute",
            background: "#fff",
            border: "1px solid #ccc",
            padding: "8px",
            zIndex: 1000,
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          {categories.map(cat => (
            <label key={cat.category_id} style={{ display: "block" }}>
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
