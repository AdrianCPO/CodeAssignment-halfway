import db from "../config/database.js";

export const getAllComments = () => {
  try {
    const stmt = db.prepare(
      "SELECT * FROM comments ORDER BY comment_timestamp DESC"
    );
    return stmt.all();
  } catch (error) {
    console.error("Error fetching comments from database:", error.message);
    throw new Error("Error fetching comments from database");
  }
};

export const getCommentsByThreadId = threadId => {
  try {
    const stmt = db.prepare("SELECT * FROM comments WHERE thread_id = ?");
    return stmt.all(threadId);
  } catch (error) {
    console.error("Error fetching comments from database:", error.message);
    throw new Error("Error fetching comments from database");
  }
};

export const createComment = (
  comment_content,
  comment_author,
  comment_timestamp,
  threadId
) => {
  try {
    const stmt = db.prepare(
      "INSERT INTO comments (comment_content, comment_author, comment_timestamp, thread_id) VALUES (?, ?, ?, ?)"
    );
    stmt.run(comment_content, comment_author, comment_timestamp, threadId); // Lägg till `threadId` här
  } catch (error) {
    console.error("Error inserting comment into database:", error.message);
    throw new Error("Error inserting comment into database");
  }
};

export const updateComment = (
  id,
  comment_content,
  comment_author,
  comment_timestamp
) => {
  try {
    const stmt = db.prepare(
      "UPDATE comments SET comment_content = ?, comment_author = ?, comment_timestamp = ? WHERE comment_id = ?"
    );
    stmt.run(comment_content, comment_author, comment_timestamp, id);
  } catch (error) {
    console.error("Error updating comment in database:", error.message);
    throw new Error("Error updating comment in database");
  }
};

export const deleteComment = id => {
  try {
    const stmt = db.prepare("DELETE FROM comments WHERE comment_id = ?");
    stmt.run(id);
  } catch (error) {
    console.error("Error deleting comment from database:", error.message);
    throw new Error("Error deleting comment from database");
  }
};
