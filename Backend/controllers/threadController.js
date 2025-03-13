import { handleServerError } from "../utils/handleServerError.js";
import {
  getFilteredSortedThreads,
  getThreadById,
  createThread,
  updateThread,
  deleteThread,
} from "../models/threadModel.js";

// Validera om threadId är ett giltigt nummer
const validateThreadId = (threadId, res) => {
  if (!threadId || isNaN(threadId)) {
    res.status(400).json({ message: "Invalid thread ID format" });
    return false;
  }
  return true;
};

// Hämta trådar med sökning, kategori och sortering
export const getThreads = async (req, res) => {
  const { searchTerm, category, sortBy } = req.query;
  console.log(
    "Sökterm:",
    searchTerm,
    "Kategori:",
    category,
    "Sortering:",
    sortBy
  );

  try {
    const threads = await getFilteredSortedThreads({
      searchTerm,
      category,
      sortBy,
    });
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

// Skapa en ny tråd med möjlighet att sätta kategori
// Ändrad: förväntar sig nu att klienten skickar med category_ids (en array med kategori-ID:n)
export const newThread = async (req, res) => {
  const {
    thread_title,
    thread_content,
    thread_author,
    thread_timestamp,
    thread_status,
    category_ids, // Förväntas vara ett enskilt värde eller en array med kategori-ID:n
  } = req.body;

  if (!thread_title || !thread_content || !thread_author) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Säkerställ att category_ids alltid är en array om den skickas med
    const categories = category_ids
      ? Array.isArray(category_ids)
        ? category_ids
        : [category_ids]
      : [];
    const threadId = await createThread(
      thread_title,
      thread_content,
      thread_author,
      thread_timestamp,
      thread_status,
      categories // Skickar en array med kategori-ID:n
    );
    res.status(201).json({ message: "Thread created successfully", threadId });
  } catch (error) {
    handleServerError(res, "creating the thread", error);
  }
};

// Uppdatera en tråd med möjlighet att ändra kategori
export const editThread = async (req, res) => {
  const threadId = req.params.threadId;
  if (!validateThreadId(threadId, res)) return;

  const {
    thread_title,
    thread_content,
    thread_author,
    thread_timestamp,
    thread_status,
    category_ids, // Ändrad: ta emot category_ids istället för category_id
  } = req.body;

  // Säkerställ att category_ids hanteras som en array
  const categories = category_ids
    ? Array.isArray(category_ids)
      ? category_ids
      : [category_ids]
    : [];

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
      thread_status,
      categories
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

    // Efter radering hämtar vi alla trådar (utan filter)
    const threads = await getFilteredSortedThreads({});
    res.json(threads);
  } catch (error) {
    handleServerError(res, "deleting the thread", error);
  }
};

// Hämta trådar baserat på kategori (använder i så fall det dynamiska filtret)
export const getThreadsByCategoryController = async (req, res) => {
  const categoryName = req.params.categoryName;
  console.log("Fetching threads for category:", categoryName);

  try {
    const threads = await getFilteredSortedThreads({ category: categoryName });
    if (!threads || threads.length === 0) {
      return res
        .status(404)
        .json({ error: "No threads found for this category" });
    }
    res.json(threads);
  } catch (error) {
    console.error("Error fetching threads by category:", error);
    res.status(500).json({ error: "Failed to fetch threads by category" });
  }
};
