
import { useState } from "react";

export const SortThreads = ({ setSortBy }) => {
  const [selectedSort, setSelectedSort] = useState("activity");

  const handleSortChange = event => {
    setSelectedSort(event.target.value);
    setSortBy(event.target.value); 
  };

  return (
    <div>
      <label htmlFor="sort-select">Sortera efter:</label>
      <select id="sort-select" value={selectedSort} onChange={handleSortChange}>
        <option value="activity">Senaste aktivitet</option>
        <option value="comments">Antal svar</option>
      </select>
    </div>
  );
};
