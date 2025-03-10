export const CommentInput = ({ value, onChange }) => {
  return (
    <div className="input-group">
      <textarea
        className="input-textarea"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Skriv din kommentar..."
      />
    </div>
  );
};
