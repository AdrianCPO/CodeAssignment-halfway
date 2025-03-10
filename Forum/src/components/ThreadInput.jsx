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
    <div className="input group">
      <label>{label}</label>
      {isTextArea ? (
        <textarea
          type="text"
          rows="10"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
        />
      )}

      {showStatusSelect && ( // visa statusändringsalternativet endast om showStatusSelect är true
        <select value={status} onChange={onStatusChange}>
          <option value="open">Open</option>
          <option value="closed">closed</option>
        </select>
      )}
    </div>
  );
};
