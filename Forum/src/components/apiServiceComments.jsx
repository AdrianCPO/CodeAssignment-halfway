const API_BASE_URL = "http://localhost:3000/api/comments";

export const fetchAllComments = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/comments"); // Se till att denna route finns i backend
    if (!response.ok) throw new Error("Failed to fetch all comments");
    return await response.json();
  } catch (error) {
    console.error("Error fetching all comments:", error);
    throw error;
  }
};

export const fetchCommentsByThreadId = async threadId => {
  try {
    const response = await fetch(`${API_BASE_URL}/${threadId}`);
    if (!response.ok) {
      if (response.status === 404) return [];
      throw new Error("Failed to fetch comments");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

export const createComment = async (threadId, newComment) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${threadId}/new-comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newComment),
    });
    if (!response.ok) throw new Error("Failed to create comment");
    return await response.json();
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};

export const deleteComment = async commentId => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/delete-comment/${commentId}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) throw new Error("Failed to delete comment");
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};

export const updateComment = async (commentId, updatedComment) => {
  try {
    const response = await fetch(`${API_BASE_URL}/edit-comment/${commentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedComment),
    });
    if (!response.ok) throw new Error("Failed to update comment");
    return await response.json();
  } catch (error) {
    console.error("Error updating comment:", error);
    throw error;
  }
};
