//Denna mapp används för konfigurationer och inställningar, som att hantera databaskopplingar eller andra externa tjänster.
//Exempel: database.js för att definiera hur du ansluter till SQLite-databasen.

// /config/database.js

import Database from "better-sqlite3";

let db;
try {
  db = new Database("../forum.db");
} catch (error) {
  console.error("Failed to connect to database:", error.message);
}

export default db;
