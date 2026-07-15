const db = require("../db/connection");

// Add item
function addItem(item) {
  return new Promise((resolve, reject) => {

    db.run(
      `
      INSERT INTO inventory
      (
        item_name,
        category,
        brand,
        size,
        color,
        purchase_price,
        selling_price,
        stock,
        min_stock,
        barcode
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        item.item_name,
        item.category,
        item.brand,
        item.size,
        item.color,
        item.purchase_price,
        item.selling_price,
        item.stock,
        item.min_stock,
        item.barcode || null
      ],
      function (err) {

        if (err) return reject(err);

        resolve({
          id: this.lastID,
          ...item
        });

      }
    );

  });
}

// Get all items
function getAllItems(search = "") {

  return new Promise((resolve, reject) => {

    const keyword = `%${search}%`;

    db.all(
      `
      SELECT *
      FROM inventory
      WHERE status != 'INACTIVE'
      AND (
        item_name LIKE ?
        OR category LIKE ?
        OR brand LIKE ?
        OR size LIKE ?
        OR color LIKE ?
        OR barcode LIKE ?
    )
      ORDER BY id DESC
      `,
      [
        keyword,
        keyword,
        keyword,
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

// Update stock
function updateStock(id, stock) {
  return new Promise((resolve, reject) => {

    db.run(
      `UPDATE inventory SET stock = ? WHERE id = ?`,
      [stock, id],
      function (err) {

        if (err) return reject(err);

        resolve({
          updated: this.changes
        });

      }
    );

  });
}

async function updateItem(id, data) {
  const query = `
    UPDATE inventory
    SET
      item_name = ?,
      category = ?,
      brand = ?,
      size = ?,
      color = ?,
      purchase_price = ?,
      selling_price = ?,
      stock = ?,
      min_stock = ?,
      barcode = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  return db.run(query, [
    data.item_name,
    data.category,
    data.brand,
    data.size,
    data.color,
    data.purchase_price,
    data.selling_price,
    data.stock,
    data.min_stock,
    data.barcode,
    id
  ]);
}

async function deleteItem(id) {
  return new Promise((resolve, reject) => {
    db.run(
      `
      UPDATE inventory
      SET
        status = 'INACTIVE',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
      [id],
      function (err) {
        if (err) return reject(err);

        resolve({
          updated: this.changes,
        });
      }
    );
  });
}

async function updateInventoryStatus(id, stock) {
  const status = stock <= 0 ? "OUT_OF_STOCK" : "ACTIVE";

  return new Promise((resolve, reject) => {
    db.run(
      `
      UPDATE inventory
      SET stock = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
      [stock, status, id],
      function (err) {
        if (err) return reject(err);
        resolve({ success: true });
      }
    );
  });
}



module.exports = {
  addItem,
  getAllItems,
  updateStock,
  updateItem,
  updateInventoryStatus,
  deleteItem
};