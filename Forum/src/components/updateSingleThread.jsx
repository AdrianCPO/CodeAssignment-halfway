export const updateSingleThread = async (threadId, updatedThread) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/threads/edit-thread/${threadId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedThread),
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};
