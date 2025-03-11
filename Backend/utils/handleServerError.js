export const handleServerError = (res, action, error) => {
  console.error(`Error ${action}:`, error.message);
  res.status(500).json({
    message: `An error occurred while ${action}`,
    error: error.message,
  });
};
