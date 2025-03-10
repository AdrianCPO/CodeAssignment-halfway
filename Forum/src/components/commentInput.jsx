export const CommentInput = ({ value, onChange, onSubmit }) => {
  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Write a comment"
      />
      <button type="submit">Submit</button>
    </form>
  );
};
