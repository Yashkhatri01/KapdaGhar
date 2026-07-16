const db = require("../db/connection");
const { run, get, all, exec } = require("../db/database");


// Create a complete sale
function createSale(saleData) {
  const {
    customer_id,
    subtotal,
    discount,
    tax,
    grand_total,
    payment_method,
    payment_status,
    items,
  } = saleData;

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run("BEGIN TRANSACTION");

      // 1. Create Sale
      db.run(
        `
        INSERT INTO sales (
          customer_id,
          subtotal,
          discount,
          tax,
          grand_total,
          payment_method,
          payment_status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          customer_id,
          subtotal,
          discount,
          tax,
          grand_total,
          payment_method,
          payment_status,
        ],
        function (err) {
          if (err) {
            db.run("ROLLBACK");
            return reject(err);
          }

          const saleId = this.lastID;

          processItems(
          saleId,
          items,
          grand_total,
          payment_method,
          resolve,
          reject,
          false
        )
        }
      );
    });
  });
}

// Process every sold item
// Process every sold item
function processItems(
  saleId,
  items,
  grandTotal,
  paymentMethod,
  resolve,
  reject,
  isUpdate = false
) {
  let completed = 0;

  if (items.length === 0) {
    db.run("ROLLBACK");
    return reject(new Error("Sale must contain at least one item."));
  }

  items.forEach((item) => {

    // Check stock first
    db.get(
      `SELECT stock FROM inventory WHERE id = ?`,
      [item.inventory_id],
      (err, row) => {

        if (err) {
          db.run("ROLLBACK");
          return reject(err);
        }

        if (!row) {
          db.run("ROLLBACK");
          return reject(
            new Error(`Inventory item ${item.inventory_id} not found.`)
          );
        }

        if (row.stock < item.quantity) {
          db.run("ROLLBACK");
          return reject(
            new Error(
              `Insufficient stock for inventory item ${item.inventory_id}.`
            )
          );
        }

        // Insert sale item
        db.run(
          `
          INSERT INTO sale_items
          (
            sale_id,
            inventory_id,
            quantity,
            selling_price,
            discount,
            total
          )
          VALUES (?, ?, ?, ?, ?, ?)
          `,
          [
            saleId,
            item.inventory_id,
            item.quantity,
            item.selling_price,
            item.discount || 0,
            item.total,
          ],
          (err) => {

            if (err) {
              db.run("ROLLBACK");
              return reject(err);
            }

            // Reduce stock
            db.run(
              `
              UPDATE inventory
              SET stock = stock - ?
              WHERE id = ?
              AND stock >= ?
              `,
              [
                item.quantity,
                item.inventory_id,
                item.quantity,
              ],
              function (err) {

                if (err) {
                  db.run("ROLLBACK");
                  return reject(err);
                }

                if (this.changes === 0) {
                  db.run("ROLLBACK");
                  return reject(
                    new Error(
                      `Insufficient stock for inventory item ${item.inventory_id}.`
                    )
                  );
                }

                // Record inventory movement
                db.run(
                  `
                  INSERT INTO inventory_transactions
                  (
                    inventory_id,
                    movement_type,
                    quantity,
                    reference_type,
                    reference_id,
                    remarks
                  )
                  VALUES (?, ?, ?, ?, ?, ?)
                  `,
                  [
                    item.inventory_id,
                    "SALE",
                    item.quantity,
                    "sales",
                    saleId,
                    "Sale completed",
                  ],
                  (err) => {

                    if (err) {
                      db.run("ROLLBACK");
                      return reject(err);
                    }

                    completed++;

                    if (completed === items.length) {

                    if (isUpdate) {
                    
                      finishSaleUpdate(
                        saleId,
                        grandTotal,
                        paymentMethod,
                        items.length,
                        resolve,
                        reject
                      );
                    
                    } else {
                    
                      finishSale(
                        saleId,
                        grandTotal,
                        paymentMethod,
                        items.length,
                        resolve,
                        reject
                      );
                    
                    }
                  
                  }

                                    }
                                  );
                                
                                }
                              );
                            
                            }
                          );
                        
                        }
                      );
                    
                    });
                  }

                  // Create cashbook entry and commit
                  function finishSale(
                    saleId,
                    grandTotal,
                    paymentMethod,
                    totalItems,
                    resolve,
                    reject
                  ) {
  // Create cashbook entry
db.run(
  `
  INSERT INTO cashbook
  (
    transaction_type,
    amount,
    description,
    reference_type,
    reference_id
  )
  VALUES (?, ?, ?, ?, ?)
  `,
  [
  "INCOME",
  grandTotal,
  `Sale #${saleId} (${paymentMethod})`,
  "sales",
  saleId,
],
  (err) => {
    if (err) {
      db.run("ROLLBACK");
      return reject(err);
    }

    db.run("COMMIT", (err) => {
      if (err) {
        db.run("ROLLBACK");
        return reject(err);
      }

      resolve({
        sale_id: saleId,
        grand_total: grandTotal,
        payment_method: paymentMethod,
        total_items: totalItems,
        message: "Sale created successfully.",
      });
    });
  }
);
}

function finishSaleUpdate(
  saleId,
  grandTotal,
  paymentMethod,
  totalItems,
  resolve,
  reject
) {

  db.run(
    `
    UPDATE cashbook
    SET
      amount = ?,
      description = ?
    WHERE
      reference_type = 'sales'
      AND reference_id = ?
    `,
    [
      grandTotal,
      `Sale #${saleId} (${paymentMethod})`,
      saleId,
    ],
    function (err) {

      if (err) {
        db.run("ROLLBACK");
        return reject(err);
      }

      if (this.changes === 0) {

        db.run(
          `
          INSERT INTO cashbook
          (
            transaction_type,
            amount,
            description,
            reference_type,
            reference_id
          )
          VALUES (?, ?, ?, ?, ?)
          `,
          [
            "SALE",
            grandTotal,
            `Sale #${saleId} (${paymentMethod})`,
            "sales",
            saleId,
          ],
          (err) => {

            if (err) {
              db.run("ROLLBACK");
              return reject(err);
            }

            commitUpdatedSale(
              saleId,
              grandTotal,
              paymentMethod,
              totalItems,
              resolve,
              reject
            );

          }
        );

        return;
      }

      commitUpdatedSale(
        saleId,
        grandTotal,
        paymentMethod,
        totalItems,
        resolve,
        reject
      );

    }
  );

}

function commitUpdatedSale(
  saleId,
  grandTotal,
  paymentMethod,
  totalItems,
  resolve,
  reject
) {

  db.run("COMMIT", (err) => {

    if (err) {
      db.run("ROLLBACK");
      return reject(err);
    }

    resolve({
      sale_id: saleId,
      grand_total: grandTotal,
      payment_method: paymentMethod,
      total_items: totalItems,
      message: "Sale updated successfully.",
    });

  });

}

// List all sales
function getAllSales() {
  return new Promise((resolve, reject) => {
    db.all(
  `
  SELECT
    s.*,
    c.name AS customer_name

  FROM sales s

  LEFT JOIN customers c
    ON s.customer_id = c.id

  ORDER BY s.created_at DESC
  `,
  [],
  (err, rows) => {
    if (err) return reject(err);
    resolve(rows);
  }
);
  });
}

function getSaleItems(saleId) {
  

  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT
        si.id AS sale_item_id,
        si.sale_id,
        si.inventory_id,
        si.quantity,
        si.selling_price,
        si.discount,
        si.total,

        i.item_name,
        i.brand,
        i.size,
        i.color,
        i.purchase_price,

        COALESCE(r.returned_qty, 0) AS already_returned,

        (
          si.quantity -
          COALESCE(r.returned_qty, 0)
        ) AS remaining_quantity

      FROM sale_items si

      LEFT JOIN inventory i
        ON si.inventory_id = i.id

      LEFT JOIN (
        SELECT
          sale_item_id,
          SUM(quantity) AS returned_qty
        FROM customer_return_items
        GROUP BY sale_item_id
      ) r
        ON si.id = r.sale_item_id

      WHERE si.sale_id = ?

      ORDER BY si.id
      `,
      [saleId],
      (err, rows) => {
        if (err) return reject(err);

      

        resolve(rows);
      }
    );
  });
}

function getSaleById(saleId) {
  return new Promise((resolve, reject) => {

    db.get(
  `
  SELECT
    s.*,
    c.name AS customer_name

  FROM sales s

  LEFT JOIN customers c
    ON s.customer_id = c.id

  WHERE s.id = ?
  `,
  [saleId],
  async (err, sale) => {

    if (err) {
      return reject(err);
    }

    if (!sale) {
      return reject(
        new Error("Sale not found.")
      );
    }

    // remaining code same...

        try {

          const items =
            await getSaleItems(saleId);

          resolve({
            sale,
            items,
          });

        } catch (err) {
          reject(err);
        }

      }
    );

  });

  

}

function updateSale(saleId, saleData) {
  return new Promise((resolve, reject) => {

    db.serialize(() => {

      db.run("BEGIN TRANSACTION");

      restoreSaleStock(
        saleId,
        saleData,
        resolve,
        reject
      );

    });

  });
}

function restoreSaleStock(
  saleId,
  saleData,
  resolve,
  reject
) {

  db.all(
    `
    SELECT
      inventory_id,
      quantity
    FROM sale_items
    WHERE sale_id = ?
    `,
    [saleId],
    (err, items) => {

      if (err) {
        db.run("ROLLBACK");
        return reject(err);
      }

      if (!items.length) {
        db.run("ROLLBACK");
        return reject(
          new Error("Sale not found.")
        );
      }

      let restored = 0;

      items.forEach((item) => {

        db.run(
          `
          UPDATE inventory
          SET stock = stock + ?
          WHERE id = ?
          `,
          [
            item.quantity,
            item.inventory_id,
          ],
          (err) => {

            if (err) {
              db.run("ROLLBACK");
              return reject(err);
            }

            restored++;

            if (restored === items.length) {

              removeOldSaleItems(
                saleId,
                saleData,
                resolve,
                reject
              );

            }

          }
        );

      });

    }
  );

}

function removeOldSaleItems(
  saleId,
  saleData,
  resolve,
  reject
) {

  db.run(
    `
    DELETE FROM sale_items
    WHERE sale_id = ?
    `,
    [saleId],
    (err) => {

      if (err) {
        db.run("ROLLBACK");
        return reject(err);
      }

      updateSaleHeader(
        saleId,
        saleData,
        resolve,
        reject
      );

    }
  );

}

function updateSaleHeader(
  saleId,
  saleData,
  resolve,
  reject
) {

  const {
    customer_id,
    subtotal,
    discount,
    tax,
    grand_total,
    payment_method,
    payment_status,
    items,
  } = saleData;

  db.run(
    `
    UPDATE sales
    SET
      customer_id = ?,
      subtotal = ?,
      discount = ?,
      tax = ?,
      grand_total = ?,
      payment_method = ?,
      payment_status = ?
    WHERE id = ?
    `,
    [
      customer_id,
      subtotal,
      discount,
      tax,
      grand_total,
      payment_method,
      payment_status,
      saleId,
    ],
    function (err) {

      if (err) {
        db.run("ROLLBACK");
        return reject(err);
      }

      if (this.changes === 0) {
        db.run("ROLLBACK");
        return reject(
          new Error("Sale not found.")
        );
      }

      processItems(
  saleId,
  items,
  grand_total,
  payment_method,
  resolve,
  reject,
  true
);

    }
  );

}




function deleteSale(saleId) {
  return new Promise((resolve, reject) => {

    db.serialize(() => {

      db.run("BEGIN TRANSACTION");

      db.all(
        `
        SELECT inventory_id, quantity
        FROM sale_items
        WHERE sale_id = ?
        `,
        [saleId],
        (err, items) => {

          if (err) {
            db.run("ROLLBACK");
            return reject(err);
          }

          if (items.length === 0) {
            db.run("ROLLBACK");
            return reject(new Error("Sale not found."));
          }

          let restored = 0;

          items.forEach((item) => {

            db.run(
              `
              UPDATE inventory
              SET stock = stock + ?
              WHERE id = ?
              `,
              [
                item.quantity,
                item.inventory_id,
              ],
              (err) => {

                if (err) {
                  db.run("ROLLBACK");
                  return reject(err);
                }

                // Inventory movement
                db.run(
                  `
                  INSERT INTO inventory_transactions
                  (
                    inventory_id,
                    movement_type,
                    quantity,
                    reference_type,
                    reference_id,
                    remarks
                  )
                  VALUES (?, ?, ?, ?, ?, ?)
                  `,
                  [
                    item.inventory_id,
                    "SALE_DELETE",
                    item.quantity,
                    "sales",
                    saleId,
                    "Sale deleted - stock restored",
                  ],
                  (err) => {

                    if (err) {
                      db.run("ROLLBACK");
                      return reject(err);
                    }

                    restored++;

                    if (restored === items.length) {

                      deleteSaleRecords(
                        saleId,
                        resolve,
                        reject
                      );

                    }

                  }
                );

              }
            );

          });

        }
      );

    });

  });
}

function deleteSaleRecords(
  saleId,
  resolve,
  reject
) {

  db.run(
    `
    DELETE FROM sale_items
    WHERE sale_id = ?
    `,
    [saleId],
    (err) => {

      if (err) {
        db.run("ROLLBACK");
        return reject(err);
      }

      db.run(
        `
        DELETE FROM cashbook
        WHERE reference_type='sales'
        AND reference_id=?
        `,
        [saleId],
        (err) => {

          if (err) {
            db.run("ROLLBACK");
            return reject(err);
          }

          db.run(
            `
            DELETE FROM sales
            WHERE id=?
            `,
            [saleId],
            (err) => {

              if (err) {
                db.run("ROLLBACK");
                return reject(err);
              }

              db.run("COMMIT", (err) => {

                if (err) {
                  db.run("ROLLBACK");
                  return reject(err);
                }

                resolve({
                  message:
                    "Sale deleted successfully."
                });

              });

            }
          );

        }
      );

    }
  );

}

module.exports = {
  createSale,
  getAllSales,
  getSaleItems,
  getSaleById,
  updateSale,
  deleteSale,
};