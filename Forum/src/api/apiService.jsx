import { apiRequest } from "./apiRequest";

const THREAD_BASE_URL = "http://localhost:3000/api/threads";

export const fetchThreads = async (sortBy, searchTerm) => {
  let url = `${THREAD_BASE_URL}?sortBy=${sortBy}`;
  if (searchTerm) url += `&searchTerm=${searchTerm}`;

  return await apiRequest(url, {}, "Failed to fetch threads");
};

export const fetchThreadById = async threadId => {
  const url = `${THREAD_BASE_URL}/${threadId}`;
  return await apiRequest(url, {}, "Thread not found");
};

export const createThread = async newThread => {
  const url = `${THREAD_BASE_URL}/new-thread`;
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newThread),
  };
  return await apiRequest(url, options, "Failed to create thread");
};

export const updateThread = async () => {
  const url = THREAD_BASE_URL;
  return await apiRequest(url, {}, "Failed to fetch threads");
};

export const updateThreadById = async (threadId, updatedThread) => {
  const url = `${THREAD_BASE_URL}/edit-thread/${threadId}`;
  const options = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedThread),
  };
  return await apiRequest(url, options, "Failed to update thread");
};

export const deleteThread = async threadId => {
  const url = `${THREAD_BASE_URL}/delete-thread/${threadId}`;
  const options = { method: "DELETE" };

  await apiRequest(url, options, "Failed to delete thread");
};

export const fetchThreadsByCategory = async categoryName => {
  const url = `${THREAD_BASE_URL}/category/${categoryName}`;
  try {
    return await apiRequest(url, {}, "Failed to fetch threads by category");
  } catch (error) {
    if (error.message.includes("HTTP 404")) {
      return [];
    }
    throw error;
  }
};
