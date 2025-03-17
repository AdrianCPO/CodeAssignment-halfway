export const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="container-search-bar">
      <input
        type="text"
        value={searchTerm}
        onChange={e => onSearchChange(e.target.value)}
        placeholder="Sök efter titel, innehåll eller författare..."
      />
      {searchTerm && <button onClick={() => onSearchChange("")}>x</button>}
    </div>
  );
};
