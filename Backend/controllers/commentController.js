import {
  getAllComments,
  getCommentsByThreadId,
  createComment,
  updateComment,
  deleteComment,
} from "../models/commentModel.js";

export const getComments = (req, res) => {
  console.log("getComments anropades");
  try {
    const comments = getAllComments();
    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error.message);
    res
      .status(500)
      .json({ message: "An error occurred while fetching comments" });
  }
};

export const getCommentsByThreadIdController = (req, res) => {
  const threadId = req.params.threadId;

  if (isNaN(threadId)) {
    return res.status(400).json({ message: "Invalid thread ID format" }); // Kontrollera om threadId är ogiltigt
  }

  try {
    const comments = getCommentsByThreadId(threadId); // Hämtar alla kommentarer för den här tråden
    if (comments.length > 0) {
      res.json(comments); // Skicka alla kommentarer om de finns
    } else {
      res.status(404).json({ message: "No comments found for this thread" }); // Om inga kommentarer finns
    }
  } catch (error) {
    console.error("Error fetching comments:", error.message);
    res
      .status(500)
      .json({ message: "An error occurred while fetching comments" });
  }
};

export const newComment = (req, res) => {
  const { comment_content, comment_author, comment_timestamp } = req.body;
  const { threadId } = req.params; // Ta emot `threadId` från URL-parametrarna

  try {
    createComment(comment_content, comment_author, comment_timestamp, threadId); // Skicka med `threadId`
    res.status(201).json({ message: "Comment created successfully" });
  } catch (error) {
    console.error("Error creating comment:", error.message);
    res
      .status(500)
      .json({ message: "An error occurred while creating the comment" });
  }
};

export const editComment = (req, res) => {
  const id = req.params.id;
  const { comment_content, comment_author, comment_timestamp } = req.body;

  try {
    updateComment(id, comment_content, comment_author, comment_timestamp);
    const comment = getAllComments();
    res.json(comment);
  } catch (error) {
    console.error("Error updating comment:", error.message);
    res
      .status(500)
      .json({ message: "An error occurred while updating the comment" });
  }
};

export const deleteCommentById = (req, res) => {
  const id = req.params.id;

  try {
    deleteComment(id);
    const comments = getAllComments();
    res.json(comments);
  } catch (error) {
    console.error("Error deleting comment:", error.message);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the comment" });
  }
};
