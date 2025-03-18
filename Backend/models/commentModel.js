import { db } from "../config/database.js";

export const getCommentsByThreadId = threadId => {
  if (!threadId || isNaN(threadId)) {
    throw new Error("Invalid thread ID");
  }
  try {
    const stmt = db.prepare("SELECT * FROM comments WHERE thread_id = ?");
    return stmt.all(threadId);
  } catch (error) {
    console.error("Error fetching comments by thread ID:", error.message);
    throw new Error("Error fetching comments by thread ID");
  }
};

export const createComment = (
  comment_content,
  comment_author,
  comment_timestamp,
  threadId
) => {
  if (!comment_content || !comment_author || !threadId) {
    throw new Error("Missing required fields for creating comment");
  }
  try {
    const stmt = db.prepare(
      "INSERT INTO comments (comment_content, comment_author, comment_timestamp, thread_id) VALUES (?, ?, ?, ?)"
    );
    stmt.run(comment_content, comment_author, comment_timestamp, threadId);
  } catch (error) {
    console.error("Error creating comment:", error.message);
    throw new Error("Error inserting comment into database");
  }
};

export const updateComment = (
  id,
  comment_content,
  comment_author,
  comment_timestamp
) => {
  if (!id || isNaN(id) || !comment_content || !comment_author) {
    throw new Error("Invalid or missing fields for updating comment");
  }
  try {
    const stmt = db.prepare(
      "UPDATE comments SET comment_content = ?, comment_author = ?, comment_timestamp = ? WHERE comment_id = ?"
    );
    const result = stmt.run(
      comment_content,
      comment_author,
      comment_timestamp,
      id
    );
    if (result.changes === 0) {
      throw new Error(
        "No comment was updated. Maybe the comment doesn't exist."
      );
    }
  } catch (error) {
    console.error("Error updating comment:", error.message);
    throw new Error("Error updating comment in database");
  }
};

export const deleteComment = id => {
  if (!id || isNaN(id)) {
    throw new Error("Invalid comment ID");
  }
  try {
    const stmt = db.prepare("DELETE FROM comments WHERE comment_id = ?");
    const result = stmt.run(id);
    if (result.changes === 0) {
      throw new Error(
        "No comment was deleted. Maybe the comment doesn't exist."
      );
    }
  } catch (error) {
    console.error("Error deleting comment:", error.message);
    throw new Error("Error deleting comment from database");
  }
};
