const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// If DATABASE_PATH is provided (Render), use it.
// Otherwise use local database.
const DB_PATH =
  process.env.DATABASE_PATH ||
  path.join(__dirname, "../../../../database/kapdaghar.db");

console.log("Using DB at:", DB_PATH);

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("DB Connection Error:", err.message);
  } else {
    console.log("SQLite connected successfully");

    db.run("PRAGMA foreign_keys = ON", (err) => {
      if (err) {
        console.error("Foreign keys enable failed:", err.message);
      } else {
        console.log("Foreign keys enabled");
      }
    });
  }
});

module.exports = db;