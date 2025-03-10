//Här lägger du all databasrelaterad logik. Modeller är ansvariga för att hantera och utföra SQL-frågor mot databasen.
//Exempel: blogModel.js för att hantera databasoperationer relaterade till blogginlägg (som att hämta, skapa, uppdatera och ta bort bloggar).
// /models/blogModel.js
import db from "../config/database.js";

export const getAllThreads = () => {
  try {
    const stmt = db.prepare(
      "SELECT * FROM threads ORDER BY thread_timestamp DESC"
    );
    return stmt.all();
  } catch (error) {
    console.error("Error fetching threads from database:", error.message);
    throw new Error("Error fetching threads from database");
  }
};

export const getThreadSortedByActivity = () => {
  const query = `
    SELECT 
      threads.thread_id,
      threads.thread_title, 
      threads.thread_content,
      threads.thread_author,
      threads.thread_timestamp, 
      threads.thread_status,
      MAX(comments.comment_timestamp) AS last_comment_timestamp  -- Ge MAX ett alias
    FROM threads
    LEFT JOIN comments ON threads.thread_id = comments.thread_id
    GROUP BY threads.thread_id
    ORDER BY COALESCE(last_comment_timestamp, threads.thread_timestamp) DESC;
  `;
  try {
    const stmt = db.prepare(query);
    return stmt.all(); // Använd .all() för att hämta flera resultat
  } catch (error) {
    console.error("Error fetching threads sorted by activity:", error.message);
    throw new Error("Error fetching threads sorted by activity");
  }
};

export const getThreadSortedByComments = () => {
  const query = `
    SELECT
      threads.thread_id,
      threads.thread_title,
      threads.thread_content,
      threads.thread_author,
      threads.thread_timestamp,
      COUNT(comments.comment_id) AS comment_count
    FROM threads
    LEFT JOIN comments ON threads.thread_id = comments.thread_id
    GROUP BY threads.thread_id
    ORDER BY comment_count DESC;
  `;
  try {
    const stmt = db.prepare(query);
    return stmt.all(); // Använd .all() för att hämta flera resultat
  } catch (error) {
    console.error("Error fetching threads sorted by comments:", error.message);
    throw new Error("Error fetching threads sorted by comments");
  }
};

export const getThreadById = threadId => {
  try {
    const stmt = db.prepare("SELECT * FROM threads WHERE thread_id = ?");
    return stmt.get(threadId); // Försök hämta tråden från databasen
  } catch (error) {
    console.error("Error fetching thread from database:", error.message);
    throw new Error("Error fetching thread from database");
  }
};

export const createThread = (
  thread_title,
  thread_content,
  thread_author,
  thread_timestamp,
  thread_status
) => {
  try {
    const stmt = db.prepare(
      "INSERT INTO threads (thread_title, thread_content, thread_author, thread_timestamp, thread_status) VALUES (?, ?, ?, ?, ?)"
    );
    stmt.run(
      thread_title,
      thread_content,
      thread_author,
      thread_timestamp,
      thread_status
    );
  } catch (error) {
    console.error("Error inserting thread into database:", error.message);
    throw new Error("Error inserting thread into database");
  }
};

export const updateThread = (
  threadId,
  thread_title,
  thread_content,
  thread_author,
  thread_timestamp,
  thread_status
) => {
  try {
    const stmt = db.prepare(
      "UPDATE threads SET thread_title = ?, thread_content = ?, thread_author = ?, thread_timestamp = ?, thread_status = ? WHERE thread_id = ?"
    );
    stmt.run(
      thread_title,
      thread_content,
      thread_author,
      thread_timestamp,
      thread_status,
      threadId
    );
  } catch (error) {
    console.error("Error updating thread in database:", error.message);
    throw new Error("Error updating thread in database");
  }
};

export const deleteThread = threadId => {
  try {
    const stmt = db.prepare("DELETE FROM threads WHERE thread_id = ?");
    stmt.run(threadId);
  } catch (error) {
    console.error("Error deleting thread from database:", error.message);
    throw new Error("Error deleting thread from database");
  }
};
