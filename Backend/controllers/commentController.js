import db from "../config/database.js";


import {
  getAllComments,
  getCommentsByThreadId,
  createComment,
  updateComment,
  deleteComment,
} from "../models/commentModel.js";

// Hämta alla kommentarer
export const getComments = (req, res) => {
  try {
    const comments = getAllComments();
    res.json(comments);
  } catch (error) {
    handleServerError(res, "fetching comments", error);
  }
};

// Hämta en specifik kommentar via ID
export const getCommentById = (req, res) => {
  const id = req.params.id;
  console.log("ID:", id);
  if (!id || isNaN(id)) {
    return res.status(400).json({ message: "Invalid comment ID" });
  }

  try {
    const stmt = db.prepare("SELECT * FROM comments WHERE comment_id = ?");
    const comment = stmt.get(id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.json(comment);
  } catch (error) {
    handleServerError(res, "fetching the comment", error);
  }
};

// Hämta kommentarer för en specifik tråd
export const getCommentsByThreadIdController = (req, res) => {
  const threadId = req.params.threadId;

  if (!threadId || isNaN(threadId)) {
    return res.status(400).json({ message: "Invalid thread ID format" });
  }

  try {
    const comments = getCommentsByThreadId(threadId);
    if (comments.length === 0) {
      return res
        .status(404)
        .json({ message: "No comments found for this thread" });
    }
    res.json(comments);
  } catch (error) {
    handleServerError(res, "fetching comments by thread ID", error);
  }
};

// Skapa en ny kommentar
export const newComment = (req, res) => {
  const { comment_content, comment_author, comment_timestamp } = req.body;
  const { threadId } = req.params;

  if (!comment_content || !comment_author || !threadId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    createComment(comment_content, comment_author, comment_timestamp, threadId);
    res.status(201).json({ message: "Comment created successfully" });
  } catch (error) {
    handleServerError(res, "creating the comment", error);
  }
};

// Uppdatera en kommentar
export const editComment = (req, res) => {
  const id = req.params.id;
  const { comment_content, comment_author, comment_timestamp } = req.body;

  if (!id || isNaN(id) || !comment_content || !comment_author) {
    return res.status(400).json({ message: "Invalid request data" });
  }

  try {
    updateComment(id, comment_content, comment_author, comment_timestamp);
    res.json({ message: "Comment updated successfully" });
  } catch (error) {
    handleServerError(res, "updating the comment", error);
  }
};

// Radera en kommentar
export const deleteCommentById = (req, res) => {
  const id = req.params.id;

  if (!id || isNaN(id)) {
    return res.status(400).json({ message: "Invalid comment ID" });
  }

  try {
    deleteComment(id);
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    handleServerError(res, "deleting the comment", error);
  }
};

// Gemensam felhanteringsfunktion för att minska kodupprepning
const handleServerError = (res, action, error) => {
  console.error(`Error ${action}:`, error.message);
  res.status(500).json({ message: `An error occurred while ${action}` });
};
