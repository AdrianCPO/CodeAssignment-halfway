import {
  getAllThreads,
  getThreadById,
  createThread,
  updateThread,
  deleteThread,
  searchThreads,
  getThreadSortedByActivity,
  getThreadSortedByComments,
} from "../models/threadModel.js";

// Validerar om threadId är ett giltigt nummer
const validateThreadId = (threadId, res) => {
  if (!threadId || isNaN(threadId)) {
    res.status(400).json({ message: "Invalid thread ID format" });
    return false;
  }
  return true;
};

// Hämta alla trådar med sortering eller sökning
export const getThreads = async (req, res) => {
  const { sortBy, searchTerm } = req.query;
  console.log("Sorting by:", sortBy, "Search term:", searchTerm);

  try {
    let threads;
    if (searchTerm) {
      threads = await searchThreads(searchTerm);
    } else if (sortBy === "activity") {
      threads = await getThreadSortedByActivity();
    } else if (sortBy === "comments") {
      threads = await getThreadSortedByComments();
    } else {
      threads = await getAllThreads();
    }

    res.json(threads);
  } catch (error) {
    handleServerError(res, "fetching threads", error);
  }
};

// Hämta en specifik tråd via ID
export const getThreadByIdController = async (req, res) => {
  const threadId = req.params.threadId;
  if (!validateThreadId(threadId, res)) return;

  try {
    const thread = await getThreadById(threadId);
    if (thread) {
      res.json(thread);
    } else {
      res.status(404).json({ message: "Thread not found" });
    }
  } catch (error) {
    handleServerError(res, "fetching the thread", error);
  }
};

// Skapa en ny tråd
export const newThread = async (req, res) => {
  const {
    thread_title,
    thread_content,
    thread_author,
    thread_timestamp,
    thread_status,
  } = req.body;

  if (!thread_title || !thread_content || !thread_author) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    await createThread(
      thread_title,
      thread_content,
      thread_author,
      thread_timestamp,
      thread_status
    );
    res.status(201).json({ message: "Thread created successfully" });
  } catch (error) {
    handleServerError(res, "creating the thread", error);
  }
};

// Uppdatera en tråd
export const editThread = async (req, res) => {
  const threadId = req.params.threadId;
  if (!validateThreadId(threadId, res)) return;

  const {
    thread_title,
    thread_content,
    thread_author,
    thread_timestamp,
    thread_status,
  } = req.body;
  if (!thread_title || !thread_content || !thread_author) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    await updateThread(
      threadId,
      thread_title,
      thread_content,
      thread_author,
      thread_timestamp,
      thread_status
    );
    const updatedThread = await getThreadById(threadId);
    if (updatedThread) {
      res.json(updatedThread);
    } else {
      res.status(404).json({ message: "Thread not found" });
    }
  } catch (error) {
    handleServerError(res, "updating the thread", error);
  }
};

// Radera en tråd
export const deleteThreadById = async (req, res) => {
  const threadId = req.params.threadId;
  if (!validateThreadId(threadId, res)) return;

  try {
    const result = await deleteThread(threadId);
    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    // Hämta alla trådar efter radering
    const threads = await getAllThreads();
    res.json(threads);
  } catch (error) {
    handleServerError(res, "deleting the thread", error);
  }
};

// Gemensam felhanteringsfunktion
const handleServerError = (res, action, error) => {
  console.error(`Error ${action}:`, error.message);
  res.status(500).json({
    message: `An error occurred while ${action}`,
    error: error.message,
  });
};
