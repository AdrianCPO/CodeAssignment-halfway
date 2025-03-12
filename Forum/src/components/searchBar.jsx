export const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <div
      className="container-search-bar"
      style={{ display: "flex", alignItems: "center", gap: "8px" }}
    >
      <input
        type="text"
        value={searchTerm}
        onChange={e => onSearchChange(e.target.value)}
        placeholder="Sök efter titel, innehåll eller författare..."
      />
      {searchTerm && (
        <button
          onClick={() => onSearchChange("")}
          style={{ cursor: "pointer" }}
        >
          x
        </button>
      )}
    </div>
  );
};
