import { db } from "../config/database.js";

// Funktion för att köra SQL-frågor med parametrar och bättre felhantering
const runQuery = (query, params = [], errorMessage) => {
  try {
    const stmt = db.prepare(query);
    return stmt.all(...params);
  } catch (error) {
    console.error(`${errorMessage}:`, error.message);
    throw new Error(errorMessage);
  }
};

// Hämta alla kommentarer
export const getAllComments = () => {
  return runQuery(
    "SELECT * FROM comments ORDER BY comment_timestamp DESC",
    [],
    "Error fetching comments from database"
  );
};

// Hämta kommentarer för en specifik tråd
export const getCommentsByThreadId = threadId => {
  if (!threadId || isNaN(threadId)) {
    throw new Error("Invalid thread ID");
  }

  return runQuery(
    "SELECT * FROM comments WHERE thread_id = ?",
    [threadId],
    "Error fetching comments by thread ID"
  );
};

// Skapa en ny kommentar
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
    console.error("Error inserting comment into database:", error.message);
    throw new Error("Error inserting comment into database");
  }
};

// Uppdatera en kommentar
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
    console.error("Error updating comment in database:", error.message);
    throw new Error("Error updating comment in database");
  }
};

// Radera en kommentar
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
    console.error("Error deleting comment from database:", error.message);
    throw new Error("Error deleting comment from database");
  }
};
