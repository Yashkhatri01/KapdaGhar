const db = require("../db/connection");

function addSupplier(name, phone, address) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO suppliers(name, phone, address)
       VALUES (?, ?, ?)`,
      [name, phone, address],
      function (err) {
        if (err) return reject(err);

        resolve({
          id: this.lastID,
          name,
          phone,
          address
        });
      }
    );
  });
}

function getAllSuppliers(search = "") {

  return new Promise((resolve, reject) => {

    const keyword = `%${search}%`;

    db.all(
      `
      SELECT *
      FROM suppliers
      WHERE
        name LIKE ?
        OR phone LIKE ?
        OR address LIKE ?
      ORDER BY id DESC
      `,
      [
        keyword,
        keyword,
        keyword
      ],
      (err, rows) => {

        if (err) return reject(err);

        resolve(rows);

      }
    );

  });

}

// Update supplier
function updateSupplier(id, name, phone, address) {
  return new Promise((resolve, reject) => {
    db.run(
      `
      UPDATE suppliers
      SET
        name = ?,
        phone = ?,
        address = ?
      WHERE id = ?
      `,
      [name, phone, address, id],
      function (err) {
        if (err) return reject(err);

        resolve({
          id: Number(id),
          name,
          phone,
          address,
        });
      }
    );
  });
}

// Delete supplier
function deleteSupplier(id) {
  return new Promise((resolve, reject) => {
    db.run(
      `
      DELETE FROM suppliers
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
  addSupplier,
  getAllSuppliers,
  updateSupplier,
  deleteSupplier,
};