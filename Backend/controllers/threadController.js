import { handleServerError } from "../utils/handleServerError.js";
import {
  getFilteredSortedThreads,
  getThreadById,
  createThread,
  updateThread,
  deleteThread,
} from "../models/threadModel.js";

const validateNumericId = (id, res, errorMessage = "Invalid ID format") => {
  if (!id || isNaN(id)) {
    res.status(400).json({ message: errorMessage });
    return false;
  }
  return true;
};

export const getThreads = async (req, res) => {
  const { searchTerm, category, sortBy } = req.query;
  try {
    const threads = await getFilteredSortedThreads({ searchTerm, category, sortBy });
    res.json(threads);
  } catch (error) {
    handleServerError(res, "fetching threads", error);
  }
};

export const getThreadByIdController = async (req, res) => {
  const threadId = req.params.threadId;
  if (!validateNumericId(threadId, res, "Invalid thread ID format")) return;

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

export const newThread = async (req, res) => {
  const {
    thread_title,
    thread_content,
    thread_author,
    thread_timestamp,
    thread_status,
    category_ids,
  } = req.body;

  if (!thread_title || !thread_content || !thread_author) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
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
      categories
    );
    res.status(201).json({ message: "Thread created successfully", threadId });
  } catch (error) {
    handleServerError(res, "creating the thread", error);
  }
};

export const editThread = async (req, res) => {
  const threadId = req.params.threadId;
  if (!validateNumericId(threadId, res, "Invalid thread ID format")) return;

  const {
    thread_title,
    thread_content,
    thread_author,
    thread_timestamp,
    thread_status,
    category_ids,
  } = req.body;

  if (!thread_title || !thread_content || !thread_author) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const categories = category_ids
      ? Array.isArray(category_ids)
        ? category_ids
        : [category_ids]
      : [];
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

export const deleteThreadById = async (req, res) => {
  const threadId = req.params.threadId;
  if (!validateNumericId(threadId, res, "Invalid thread ID format")) return;

  try {
    const result = await deleteThread(threadId);
    if (result.error) {
      return res.status(400).json({ message: result.error });
    }
    const threads = await getFilteredSortedThreads({});
    res.json(threads);
  } catch (error) {
    handleServerError(res, "deleting the thread", error);
  }
};

export const getThreadsByCategoryController = async (req, res) => {
  const categoryName = req.params.categoryName;
  try {
    const threads = await getFilteredSortedThreads({ category: categoryName });
    if (!threads || threads.length === 0) {
      return res.status(404).json({ message: "No threads found for this category" });
    }
    res.json(threads);
  } catch (error) {
    handleServerError(res, "fetching threads by category", error);
  }
};
