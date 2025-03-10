export const ThreadInput = ({
  label,
  value,
  onChange,
  placeholder,
  isTextArea,
  status,
  onStatusChange,
  showStatusSelect,
}) => {
  const handleChange = e => onChange(e.target.value);

  return (
    <div className="input-group">
      <label className="input-label">{label}</label>
      {isTextArea ? (
        <textarea
          className="input-textarea"
          rows="5"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
        />
      ) : (
        <input
          className="input-field"
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
        />
      )}

      {showStatusSelect && (
        <select
          className="input-select"
          value={status}
          onChange={onStatusChange}
        >
          <option value="open">Öppen</option>
          <option value="closed">Stängd</option>
        </select>
      )}
    </div>
  );
};
