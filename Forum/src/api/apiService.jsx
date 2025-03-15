import { apiRequest } from "./apiRequest";

export const fetchThreads = async (sortBy, searchTerm) => {
  let url = `http://localhost:3000/api/threads?sortBy=${sortBy}`;
  if (searchTerm) url += `&searchTerm=${searchTerm}`;

  return await apiRequest(url, {}, "Failed to fetch threads");
};

export const fetchThreadById = async threadId => {
  const url = `http://localhost:3000/api/threads/${threadId}`;
  return await apiRequest(url, {}, "Thread not found");
};

export const createThread = async newThread => {
  const url = "http://localhost:3000/api/threads/new-thread";
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newThread),
  };
  return await apiRequest(url, options, "Failed to create thread");
};

export const updateThread = async () => {
  const url = "http://localhost:3000/api/threads";
  return await apiRequest(url, {}, "Failed to fetch threads");
};

export const updateThreadById = async (threadId, updatedThread) => {
  const url = `http://localhost:3000/api/threads/edit-thread/${threadId}`;
  const options = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedThread),
  };
  return await apiRequest(url, options, "Failed to update thread");
};

export const deleteThread = async threadId => {
  const url = `http://localhost:3000/api/threads/delete-thread/${threadId}`;
  const options = { method: "DELETE" };
  // Här returneras inget, men jag ger felmeddelande om något går fel.
  await apiRequest(url, options, "Failed to delete thread");
};

export const fetchThreadsByCategory = async categoryName => {
  const url = `http://localhost:3000/api/threads/category/${categoryName}`;
  try {
    return await apiRequest(url, {}, "Failed to fetch threads by category");
  } catch (error) {
    if (error.message.includes("HTTP 404")) {
      return [];
    }
    throw error;
  }
};
