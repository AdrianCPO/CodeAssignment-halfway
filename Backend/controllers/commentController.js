import { db } from "../config/database.js";
import { handleServerError } from "../utils/handleServerError.js";
import {
  getCommentsByThreadId,
  createComment,
  updateComment,
  deleteComment,
} from "../models/commentModel.js";

const validateNumericId = (id, res, errorMessage = "Invalid ID format") => {
  if (!id || isNaN(id)) {
    res.status(400).json({ message: errorMessage });
    return false;
  }
  return true;
};

export const getCommentById = async (req, res) => {
  const id = req.params.id;
  if (!validateNumericId(id, res, "Invalid comment ID")) return;

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

export const getCommentsByThreadIdController = async (req, res) => {
  const threadId = req.params.threadId;
  if (!validateNumericId(threadId, res, "Invalid thread ID format")) return;

  try {
    const comments = await getCommentsByThreadId(threadId);
    if (!comments || comments.length === 0) {
      return res
        .status(404)
        .json({ message: "No comments found for this thread" });
    }
    res.json(comments);
  } catch (error) {
    handleServerError(res, "fetching comments by thread ID", error);
  }
};

export const newComment = async (req, res) => {
  const { comment_content, comment_author, comment_timestamp } = req.body;
  const { threadId } = req.params;

  if (!comment_content || !comment_author || !threadId) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  if (!validateNumericId(threadId, res, "Invalid thread ID format")) return;

  try {
    await createComment(
      comment_content,
      comment_author,
      comment_timestamp,
      threadId
    );
    res.status(201).json({ message: "Comment created successfully" });
  } catch (error) {
    handleServerError(res, "creating the comment", error);
  }
};

export const editComment = async (req, res) => {
  const id = req.params.id;
  const { comment_content, comment_author, comment_timestamp } = req.body;

  if (
    !validateNumericId(id, res, "Invalid comment ID") ||
    !comment_content ||
    !comment_author
  ) {
    return res.status(400).json({ message: "Invalid request data" });
  }
  try {
    await updateComment(id, comment_content, comment_author, comment_timestamp);
    res.json({ message: "Comment updated successfully" });
  } catch (error) {
    handleServerError(res, "updating the comment", error);
  }
};

export const deleteCommentById = async (req, res) => {
  const id = req.params.id;
  if (!validateNumericId(id, res, "Invalid comment ID")) return;

  try {
    await deleteComment(id);
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    handleServerError(res, "deleting the comment", error);
  }
};
