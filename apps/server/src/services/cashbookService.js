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
// Get filtered cashbook entries
function getAll(filters = {}) {
  const { year, month, day } = filters;

  let query = `
    SELECT *
    FROM cashbook
    WHERE 1=1
  `;

  const params = [];

  if (year != null && Number(year) !== 0) {
  query += `
    AND strftime('%Y', created_at) = ?
  `;
  params.push(String(year));
}

if (month != null && Number(month) !== 0) {
  query += `
    AND strftime('%m', created_at) = ?
  `;
  params.push(String(month).padStart(2, "0"));
}

if (day != null && Number(day) !== 0) {
  query += `
    AND strftime('%d', created_at) = ?
  `;
  params.push(String(day).padStart(2, "0"));
}

  query += `
    ORDER BY created_at DESC
  `;

  return new Promise((resolve, reject) => {


    db.all(
      query,
      params,
      (err, rows) => {

        if (err) return reject(err);

        resolve(rows);

      }
    );

  });

}

function getSummary(filters = {}) {

  const { year, month, day } = filters;

  let query = `
    SELECT

      COALESCE(
        SUM(
          CASE
            WHEN transaction_type='INCOME'
            THEN amount
          END
        ),
        0
      ) income,

      COALESCE(
        SUM(
          CASE
            WHEN transaction_type='EXPENSE'
            THEN amount
          END
        ),
        0
      ) expense,

      COUNT(*) transactions

    FROM cashbook

    WHERE 1=1
  `;

  const params = [];

  if (year != null && Number(year) !== 0) {
  query += `
    AND strftime('%Y', created_at) = ?
  `;
  params.push(String(year));
}

if (month != null && Number(month) !== 0) {
  query += `
    AND strftime('%m', created_at) = ?
  `;
  params.push(String(month).padStart(2, "0"));
}

if (day != null && Number(day) !== 0) {
  query += `
    AND strftime('%d', created_at) = ?
  `;
  params.push(String(day).padStart(2, "0"));
}

  return new Promise((resolve, reject) => {

    db.get(
      query,
      params,
      (err, row) => {

        if (err)
          return reject(err);

        resolve({

          income: row.income,

          expense: row.expense,

          net:
            row.income - row.expense,

          transactions:
            row.transactions,

        });

      }
    );

  });

}

module.exports = {
  addEntry,
  getAll,
  getSummary
};