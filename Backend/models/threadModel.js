import { db } from "../config/database.js";

// Generisk SQL-hanteringsfunktion för att minska kodupprepning
const runQuery = (query, params = [], errorMessage) => {
  try {
    const stmt = db.prepare(query);
    return stmt.all(...params);
  } catch (error) {
    console.error(`${errorMessage}:`, error.message);
    throw new Error(errorMessage);
  }
};

// Hämta alla trådar, sorterade efter senaste aktivitet
export const getAllThreads = () => {
  return runQuery(
    "SELECT * FROM threads ORDER BY thread_timestamp DESC",
    [],
    "Error fetching threads from database"
  );
};

// Sök trådar efter titel, innehåll eller författare
export const searchThreads = searchTerm => {
  const query = `
    SELECT 
      threads.thread_id,
      threads.thread_title, 
      threads.thread_content,
      threads.thread_author,
      threads.thread_timestamp,
      threads.thread_status,
      COUNT(comments.comment_id) AS comment_count,
      COALESCE(MAX(comments.comment_timestamp), threads.thread_timestamp) AS last_activity
    FROM threads
    LEFT JOIN comments ON threads.thread_id = comments.thread_id
    WHERE 
      LOWER(threads.thread_title) LIKE LOWER(?) OR 
      LOWER(threads.thread_content) LIKE LOWER(?) OR
      LOWER(threads.thread_author) LIKE LOWER(?)
    GROUP BY threads.thread_id
    ORDER BY last_activity DESC;
  `;

  return runQuery(
    query,
    [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`],
    "Error searching threads"
  ).map(thread => ({
    ...thread,
    last_activity: new Date(thread.last_activity).toISOString(),
  }));
};

// Hämta trådar sorterade efter aktivitet
export const getThreadSortedByActivity = () => {
  const query = `
    SELECT 
      threads.thread_id,
      threads.thread_title, 
      threads.thread_content,
      threads.thread_author,
      threads.thread_timestamp, 
      threads.thread_status,
      -- Hämtar det senaste timestampet från antingen tråden eller kommentarerna
      MAX(COALESCE(comments.comment_timestamp, threads.thread_timestamp)) AS last_activity
    FROM threads
    LEFT JOIN comments ON threads.thread_id = comments.thread_id
    GROUP BY threads.thread_id, threads.thread_title, threads.thread_content, 
             threads.thread_author, threads.thread_timestamp, threads.thread_status
    ORDER BY last_activity DESC;
  `;

  return runQuery(query, [], "Error fetching threads sorted by activity").map(
    thread => ({
      ...thread,
      last_activity: thread.last_activity
        ? new Date(thread.last_activity).toISOString()
        : null,
    })
  );
};

// Hämta trådar sorterade efter antal kommentarer
export const getThreadSortedByComments = () => {
  const query = `
    SELECT
      threads.thread_id,
      threads.thread_title,
      threads.thread_content,
      threads.thread_author,
      threads.thread_timestamp,
      threads.thread_status,
      COUNT(comments.comment_id) AS comment_count,
      -- Se till att last_activity alltid finns med här också
      MAX(COALESCE(comments.comment_timestamp, threads.thread_timestamp)) AS last_activity
    FROM threads
    LEFT JOIN comments ON threads.thread_id = comments.thread_id
    GROUP BY threads.thread_id, threads.thread_title, threads.thread_content, 
             threads.thread_author, threads.thread_timestamp, threads.thread_status
    ORDER BY comment_count DESC;
  `;

  return runQuery(query, [], "Error fetching threads sorted by comments").map(
    thread => ({
      ...thread,
      last_activity: thread.last_activity
        ? new Date(thread.last_activity).toISOString()
        : null,
    })
  );
};

export const getThreadsByCategory = async categoryName => {
  const query = `
    SELECT 
      threads.thread_id,
      threads.thread_title, 
      threads.thread_content,
      threads.thread_author,
      threads.thread_timestamp, 
      threads.thread_status,
      categories.category_name
    FROM threads
    JOIN threadsXcategories ON threads.thread_id = threadsXcategories.thread_id
    JOIN categories ON threadsXcategories.category_id = categories.category_id
    WHERE categories.category_name = ?  -- Använd parametrisering för kategori
    ORDER BY threads.thread_timestamp DESC;  -- Förbättrad ordning, sortera efter timestamp
  `;

  try {
    // Kör SQL-frågan och returnera resultatet
    const result = await runQuery(
      query,
      [categoryName],
      "Error fetching threads by category"
    );

    if (!result || result.length === 0) {
      console.warn(`No threads found for category: ${categoryName}`);
      return [];
    }

    return result.map(thread => ({
      ...thread,
      last_activity: thread.last_activity
        ? new Date(thread.last_activity).toISOString()
        : null,
    }));
  } catch (error) {
    console.error("Database error in getThreadsByCategory:", error);
    throw new Error(`Failed to fetch threads by category: ${error.message}`);
  }
};

// Hämta en tråd med ID
export const getThreadById = threadId => {
  if (!threadId || isNaN(threadId)) throw new Error("Invalid thread ID");

  try {
    const stmt = db.prepare("SELECT * FROM threads WHERE thread_id = ?");
    return stmt.get(threadId);
  } catch (error) {
    console.error("Error fetching thread from database:", error.message);
    throw new Error("Error fetching thread from database");
  }
};

// Skapa en ny tråd
export const createThread = (
  thread_title,
  thread_content,
  thread_author,
  thread_timestamp,
  thread_status
) => {
  if (!thread_title || !thread_content || !thread_author) {
    throw new Error("Missing required fields for creating thread");
  }

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

// Uppdatera en tråd
export const updateThread = (
  threadId,
  thread_title,
  thread_content,
  thread_author,
  thread_timestamp,
  thread_status
) => {
  if (
    !threadId ||
    isNaN(threadId) ||
    !thread_title ||
    !thread_content ||
    !thread_author
  ) {
    throw new Error("Invalid or missing fields for updating thread");
  }

  try {
    const stmt = db.prepare(
      "UPDATE threads SET thread_title = ?, thread_content = ?, thread_author = ?, thread_timestamp = ?, thread_status = ? WHERE thread_id = ?"
    );
    const result = stmt.run(
      thread_title,
      thread_content,
      thread_author,
      thread_timestamp,
      thread_status,
      threadId
    );

    if (result.changes === 0) {
      throw new Error("No thread was updated. Maybe the thread doesn't exist.");
    }
  } catch (error) {
    console.error("Error updating thread in database:", error.message);
    throw new Error("Error updating thread in database");
  }
};

// Radera en tråd och dess kommentarer
export const deleteThread = threadId => {
  if (!threadId || isNaN(threadId)) throw new Error("Invalid thread ID");

  try {
    // Ta bort alla kommentarer kopplade till tråden
    db.prepare("DELETE FROM comments WHERE thread_id = ?").run(threadId);

    // Ta bort själva tråden
    const deleteThreadStmt = db.prepare(
      "DELETE FROM threads WHERE thread_id = ?"
    );
    const result = deleteThreadStmt.run(threadId);

    if (result.changes === 0) {
      throw new Error("No thread found with given ID");
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting thread from database:", error.message);
    throw new Error("Error deleting thread from database");
  }
};
