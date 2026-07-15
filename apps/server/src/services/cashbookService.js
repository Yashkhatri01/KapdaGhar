const db = require("../db/connection");

// Add entry
function addEntry(transaction_type, amount, description) {
  return new Promise((resolve, reject) => {
      db.run(
      `INSERT INTO cashbook (transaction_type, amount, description)
       VALUES (?, ?, ?)`,
      [transaction_type, amount, description],
      function (err) {
    if (err) return reject(err);

    resolve({
      id: this.lastID,
      transaction_type,
      amount,
      description
    });
      }
  );
  });
}

// Get all entries
function getAll() {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM cashbook ORDER BY id DESC`, [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

module.exports = {
  addEntry,
  getAll
};