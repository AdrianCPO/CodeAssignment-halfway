// ErrorMessage.jsx
export const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div className="error-message" style={{ color: "red", margin: "0.5rem 0" }}>
      {message}
    </div>
  );
};
