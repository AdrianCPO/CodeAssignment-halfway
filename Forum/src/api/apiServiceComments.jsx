import { apiRequest } from "./apiRequest";

const API_BASE_URL = "http://localhost:3000/api/comments";

export const fetchAllComments = async () => {
  const url = API_BASE_URL;
  return await apiRequest(url, {}, "Failed to fetch all comments");
};

export const fetchCommentsByThreadId = async threadId => {
  const url = `${API_BASE_URL}/${threadId}`;
  try {
    return await apiRequest(url, {}, "Failed to fetch comments");
  } catch (error) {
    // Om jag får en 404 Not Found, returnerar jag en tom array.
    if (error.message.includes("404")) return [];
    throw error;
  }
};

export const createComment = async (threadId, newComment) => {
  const url = `${API_BASE_URL}/${threadId}/new-comment`;
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newComment),
  };
  return await apiRequest(url, options, "Failed to create comment");
};

export const deleteComment = async commentId => {
  const url = `${API_BASE_URL}/delete-comment/${commentId}`;
  const options = { method: "DELETE" };
  await apiRequest(url, options, "Failed to delete comment");
};

export const updateComment = async (commentId, updatedComment) => {
  const url = `${API_BASE_URL}/edit-comment/${commentId}`;
  const options = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedComment),
  };
  return await apiRequest(url, options, "Failed to update comment");
};
