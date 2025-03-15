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

export const getFilteredSortedThreads = ({
  searchTerm,
  category,
  sortBy,
} = {}) => {
  let query = `
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
  `;
  const params = [];
  const conditions = [];

  if (category) {
    const categoryArr = Array.isArray(category) ? category : [category];
    query += `
      JOIN threadsXcategories ON threads.thread_id = threadsXcategories.thread_id
      JOIN categories ON threadsXcategories.category_id = categories.category_id
    `;
    const placeholders = categoryArr.map(() => "?").join(", ");
    conditions.push(`LOWER(categories.category_name) IN (${placeholders})`);
    params.push(...categoryArr.map(cat => cat.toLowerCase()));
  }

  if (searchTerm) {
    conditions.push(`(LOWER(threads.thread_title) LIKE LOWER(?) OR 
       LOWER(threads.thread_content) LIKE LOWER(?) OR 
       LOWER(threads.thread_author) LIKE LOWER(?))`);
    const searchPattern = `%${searchTerm}%`;
    params.push(searchPattern, searchPattern, searchPattern);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  query += " GROUP BY threads.thread_id ";

  let orderBy = "last_activity";
  if (sortBy === "comments") {
    orderBy = "comment_count";
  } else if (sortBy === "activity") {
    orderBy = "last_activity";
  }
  // Ändra från att använda datetime(last_activity) till att sortera direkt på last_activity
  if (orderBy === "last_activity") {
    query += " ORDER BY last_activity DESC";
  } else {
    query += ` ORDER BY ${orderBy} DESC`;
  }

  return runQuery(query, params, "Error fetching threads").map(thread => ({
    ...thread,
    last_activity: new Date(thread.last_activity).toISOString(),
  }));
};

// Hämta alla trådar (utan filter eller sökterm)
export const getAllThreads = () => {
  return getFilteredSortedThreads();
};

// Hämta en enskild tråd med dess data och en array med tillhörande kategori-ID:n
export const getThreadById = threadId => {
  if (!threadId || isNaN(threadId)) throw new Error("Invalid thread ID");

  try {
    const stmt = db.prepare("SELECT * FROM threads WHERE thread_id = ?");
    const thread = stmt.get(threadId);

    if (thread) {
      const stmtCat = db.prepare(
        "SELECT category_id FROM threadsXcategories WHERE thread_id = ?"
      );
      const catRows = stmtCat.all(threadId);
      thread.category_ids = catRows.map(row => row.category_id);
    }

    return thread;
  } catch (error) {
    console.error("Error fetching thread from database:", error.message);
    throw new Error("Error fetching thread from database");
  }
};

// Skapa en ny tråd med stöd för kategori (en kategori per tråd)
// Förväntar sig att du skickar in en array med kategori-ID:n
export const createThread = async (
  thread_title,
  thread_content,
  thread_author,
  thread_timestamp,
  thread_status,
  category_ids
) => {
  if (!thread_title || !thread_content || !thread_author) {
    throw new Error("Missing required fields for creating thread");
  }

  try {
    const stmt = db.prepare(
      "INSERT INTO threads (thread_title, thread_content, thread_author, thread_timestamp, thread_status) VALUES (?, ?, ?, ?, ?)"
    );
    const result = stmt.run(
      thread_title,
      thread_content,
      thread_author,
      thread_timestamp,
      thread_status
    );
    const threadId = result.lastInsertRowid;

    if (Array.isArray(category_ids) && category_ids.length > 0) {
      const insertStmt = db.prepare(
        "INSERT INTO threadsXcategories (thread_id, category_id) VALUES (?, ?)"
      );
      for (const catId of category_ids) {
        insertStmt.run(threadId, catId);
      }
    }

    return threadId;
  } catch (error) {
    console.error("Error inserting thread into database:", error.message);
    throw new Error("Error inserting thread into database");
  }
};

// Uppdatera en befintlig tråd med stöd för att ändra kategorier
// Förväntar sig att category_ids är en array med nya kategori-ID:n
export const updateThread = (
  threadId,
  thread_title,
  thread_content,
  thread_author,
  thread_timestamp,
  thread_status,
  category_ids
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

    // Ta bort alla befintliga relationer för tråden
    db.prepare("DELETE FROM threadsXcategories WHERE thread_id = ?").run(
      threadId
    );

    // Infoga nya relationer baserat på den skickade arrayen
    if (Array.isArray(category_ids) && category_ids.length > 0) {
      const insertStmt = db.prepare(
        "INSERT INTO threadsXcategories (thread_id, category_id) VALUES (?, ?)"
      );
      for (const catId of category_ids) {
        insertStmt.run(threadId, catId);
      }
    }
  } catch (error) {
    console.error("Error updating thread in database:", error.message);
    throw new Error("Error updating thread in database");
  }
};

// Radera en tråd och alla kopplade kommentarer samt kategori-relationer
export const deleteThread = threadId => {
  if (!threadId || isNaN(threadId)) throw new Error("Invalid thread ID");

  try {
    db.prepare("DELETE FROM comments WHERE thread_id = ?").run(threadId);
    db.prepare("DELETE FROM threadsXcategories WHERE thread_id = ?").run(
      threadId
    );

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
