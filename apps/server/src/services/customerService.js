const db = require("../db/connection");

// Add customer
function addCustomer(name, phone) {
  return new Promise((resolve, reject) => {
    db.run(
      `
      INSERT INTO customers (name, phone)
      VALUES (?, ?)
      `,
      [name, phone],
      function (err) {
        if (err) return reject(err);

        resolve({
          id: this.lastID,
          name,
          phone,
        });
      }
    );
  });
}

// Get all customers
function getAllCustomers(search = "") {
  return new Promise((resolve, reject) => {
    const keyword = `%${search}%`;

    db.all(
      `
      SELECT *
      FROM customers
      WHERE
        name LIKE ?
        OR phone LIKE ?
      ORDER BY id DESC
      `,
      [keyword, keyword],
      (err, rows) => {
        if (err) return reject(err);

        resolve(rows);
      }
    );
  });
}

// Update customer
function updateCustomer(id, name, phone) {
  return new Promise((resolve, reject) => {
    db.run(
      `
      UPDATE customers
      SET
        name = ?,
        phone = ?
      WHERE id = ?
      `,
      [name, phone, id],
      function (err) {
        if (err) return reject(err);

        resolve({
          id,
          name,
          phone,
        });
      }
    );
  });
}

// Delete customer
function deleteCustomer(id) {
  return new Promise((resolve, reject) => {
    db.run(
      `
      DELETE FROM customers
      WHERE id = ?
      `,
      [id],
      function (err) {
        if (err) return reject(err);

        resolve();
      }
    );
  });
}

module.exports = {
  addCustomer,
  getAllCustomers,
  updateCustomer,
  deleteCustomer,
};