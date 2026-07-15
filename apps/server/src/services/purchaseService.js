const { run, all,get, exec } = require("../db/database");

// Create Purchase
async function createPurchase(supplier_id, items, total) {
  try {
    await exec("BEGIN TRANSACTION");

    // 1. Create Purchase
    const purchase = await run(
      `INSERT INTO purchases (supplier_id, total)
       VALUES (?, ?)`,
      [supplier_id, total]
    );

    const purchaseId = purchase.lastID;

    // 2. Process each item
    for (const item of items) {

      // Insert purchase item
      await run(
        `INSERT INTO purchase_items
        (
          purchase_id,
          inventory_id,
          quantity,
          unit_cost,
          total
        )
        VALUES (?, ?, ?, ?, ?)`,
        [
          purchaseId,
          item.inventory_id,
          item.quantity,
          item.unit_cost,
          item.total
        ]
      );

      // Existing item ka stock hi increase karna hai
if (!item.isNewItem) {
  await run(
    `
    UPDATE inventory
    SET
      stock = stock + ?,
      purchase_price = ?,
      selling_price = ?
    WHERE id = ?
    `,
    [
      item.quantity,
      item.unit_cost,
      item.selling_price,
      item.inventory_id,
    ]
  );
} else {
  // New item already inventory modal se create ho chuka hai.
  // Uska stock dobara increase nahi karna.
  const extraStock =
  item.quantity - item.initialStock;

await run(
  `
  UPDATE inventory
  SET
    stock = stock + ?,
    purchase_price = ?,
    selling_price = ?
  WHERE id = ?
  `,
  [
    extraStock,
    item.unit_cost,
    item.selling_price,
    item.inventory_id,
  ]
);
}

      // Inventory transaction
      await run(
        `INSERT INTO inventory_transactions
        (
          inventory_id,
          movement_type,
          quantity,
          reference_type,
          reference_id,
          remarks
        )
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
          item.inventory_id,
          "PURCHASE",
          item.quantity,
          "purchases",
          purchaseId,
          "Stock purchased"
        ]
      );
    }

    // 3. Cashbook
    await run(
  `INSERT INTO cashbook
  (
    transaction_type,
    amount,
    description,
    reference_type,
    reference_id
  )
  VALUES (?, ?, ?, ?, ?)`,
  [
    "PURCHASE",
    total,
    `Purchase #${purchaseId}`,
    "purchases",
    purchaseId
  ]
);

    await exec("COMMIT");

    return {
      purchase_id: purchaseId,
      supplier_id,
      total
    };

  } catch (err) {

    try {
      await exec("ROLLBACK");
    } catch (_) {}

    throw err;
  }
}

async function getPurchaseById(purchaseId) {
  const purchase = await all(
    `
    SELECT
      p.*,
      s.name AS supplier_name
    FROM purchases p
    LEFT JOIN suppliers s
      ON p.supplier_id = s.id
    WHERE p.id = ?
    `,
    [purchaseId]
  );

  if (purchase.length === 0) {
    return null;
  }

  const items = await all(
    `
    SELECT
      pi.*,

      i.item_name,
      i.brand,
      i.size,
      i.color

    FROM purchase_items pi

    LEFT JOIN inventory i
      ON pi.inventory_id = i.id

    WHERE pi.purchase_id = ?
    ORDER BY pi.id
    `,
    [purchaseId]
  );

  return {
    purchase: purchase[0],
    items,
  };
}

async function getPurchaseItems(purchaseId) {
  return await all(
    `
    SELECT
      pi.id,
      pi.inventory_id,
      pi.quantity,
      pi.unit_cost,
      pi.total,

      i.item_name,
      i.brand,
      i.size,
      i.color,
      i.selling_price

    FROM purchase_items pi

    LEFT JOIN inventory i
      ON pi.inventory_id = i.id

    WHERE pi.purchase_id = ?

    ORDER BY pi.id
    `,
    [purchaseId]
  );
}

// Get Purchases
async function getAllPurchases() {
  return await all(
    `
    SELECT
      p.*,

      s.name AS supplier_name

    FROM purchases p

    LEFT JOIN suppliers s
      ON p.supplier_id = s.id

    ORDER BY p.id DESC
    `
  );
}

function restorePurchaseStock(
  purchaseId,
  purchaseData,
  resolve,
  reject
) {
  db.all(
    `
    SELECT
      inventory_id,
      quantity
    FROM purchase_items
    WHERE purchase_id = ?
    `,
    [purchaseId],
    (err, items) => {
      if (err) {
        db.run("ROLLBACK");
        return reject(err);
      }

      if (!items.length) {
        db.run("ROLLBACK");
        return reject(new Error("Purchase not found."));
      }

      let restored = 0;

      items.forEach((item) => {
        db.run(
          `
          UPDATE inventory
          SET stock = stock - ?
          WHERE id = ?
          `,
          [item.quantity, item.inventory_id],
          (err) => {
            if (err) {
              db.run("ROLLBACK");
              return reject(err);
            }

            restored++;

            if (restored === items.length) {
              removeOldPurchaseItems(
                purchaseId,
                purchaseData,
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

function removeOldPurchaseItems(
  purchaseId,
  purchaseData,
  resolve,
  reject
) {
  db.run(
    `
    DELETE FROM purchase_items
    WHERE purchase_id = ?
    `,
    [purchaseId],
    (err) => {
      if (err) {
        db.run("ROLLBACK");
        return reject(err);
      }

      updatePurchaseHeader(
        purchaseId,
        purchaseData,
        resolve,
        reject
      );
    }
  );
}

async function updatePurchase(purchaseId, purchaseData) {
  try {
    await exec("BEGIN TRANSACTION");

    // STEP 1: Restore old stock (reverse old purchase effect)
    const oldItems = await all(
      `SELECT * FROM purchase_items WHERE purchase_id = ?`,
      [purchaseId]
    );

    for (const item of oldItems) {
      await run(
        `
        UPDATE inventory
        SET stock = stock - ?
        WHERE id = ?
        `,
        [item.quantity, item.inventory_id]
      );
    }

    // STEP 2: Delete old purchase items
    await run(
      `DELETE FROM purchase_items WHERE purchase_id = ?`,
      [purchaseId]
    );

    // STEP 2: Re-insert updated purchase items + apply stock fresh

for (const item of purchaseData.items) {

  // 1. Insert purchase item again
  await run(
    `
    INSERT INTO purchase_items
    (
      purchase_id,
      inventory_id,
      quantity,
      unit_cost,
      total
    )
    VALUES (?, ?, ?, ?, ?)
    `,
    [
      purchaseId,
      item.inventory_id,
      item.quantity,
      item.unit_cost,
      item.total,
    ]
  );

  // 2. Get inventory
  const existing = await get(
    `SELECT * FROM inventory WHERE id = ?`,
    [item.inventory_id]
  );

  if (!existing) {
    throw new Error(`Inventory item ${item.inventory_id} not found`);
  }

  // 3. SIMPLE & SAFE RULE:
  // Since STEP 1 already reversed old stock,
  // we now just ADD fresh quantity

  await run(
    `
    UPDATE inventory
    SET stock = stock + ?,
        purchase_price = ?,
        selling_price = ?
    WHERE id = ?
    `,
    [
      item.quantity,
      item.unit_cost,
      item.selling_price,
      item.inventory_id,
    ]
  );

  // 4. Log movement
  await run(
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
      "PURCHASE_UPDATE",
      item.quantity,
      "purchases",
      purchaseId,
      "Purchase updated"
    ]
  );
}

// STEP 3: Recalculate total safely

const recalculatedTotal = purchaseData.items.reduce(
  (sum, item) => sum + item.total,
  0
);

// STEP 4: Update purchase header
await run(
  `
  UPDATE purchases
  SET total = ?
  WHERE id = ?
  `,
  [recalculatedTotal, purchaseId]
);

// STEP 5: Update or Insert cashbook entry

const existingCashbook = await get(
  `
  SELECT * FROM cashbook
  WHERE reference_type = 'purchases'
  AND reference_id = ?
  `,
  [purchaseId]
);

if (existingCashbook) {
  await run(
    `
    UPDATE cashbook
    SET amount = ?,
        description = ?
    WHERE reference_type = 'purchases'
    AND reference_id = ?
    `,
    [
      recalculatedTotal,
      `Purchase #${purchaseId}`,
      purchaseId,
    ]
  );
} else {
  await run(
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
      "PURCHASE",
      recalculatedTotal,
      `Purchase #${purchaseId}`,
      "purchases",
      purchaseId,
    ]
  );
}
    
    await exec("COMMIT");

return {
  purchase_id: purchaseId,
  total: recalculatedTotal,
  message: "Purchase updated successfully"
};

  } catch (err) {
    await exec("ROLLBACK");
    throw err;
  }
}



async function deletePurchase(purchaseId) {
  try {
    await exec("BEGIN TRANSACTION");

    const items = await all(
      `SELECT * FROM purchase_items WHERE purchase_id = ?`,
      [purchaseId]
    );

    if (!items.length) {
      throw new Error("Purchase not found or already deleted");
    }

    for (const item of items) {
      // safer stock check
      await run(
        `
        UPDATE inventory
        SET stock = CASE 
          WHEN stock - ? < 0 THEN 0 
          ELSE stock - ? 
        END
        WHERE id = ?
        `,
        [item.quantity, item.quantity, item.inventory_id]
      );

      await run(
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
          "PURCHASE_DELETE",
          item.quantity,
          "purchases",
          purchaseId,
          "Purchase rollback",
        ]
      );
    }

    await run(
      `DELETE FROM purchase_items WHERE purchase_id = ?`,
      [purchaseId]
    );

    await run(
      `
      DELETE FROM cashbook
      WHERE reference_type = 'purchases'
      AND reference_id = ?
      `,
      [purchaseId]
    );

    const result = await run(
      `DELETE FROM purchases WHERE id = ?`,
      [purchaseId]
    );

    if (result.changes === 0) {
      throw new Error("Purchase already deleted");
    }

    await exec("COMMIT");

    return true;
  } catch (err) {
    await exec("ROLLBACK");
    throw err;
  }
}

module.exports = {
  createPurchase,
  getAllPurchases,
  getPurchaseById,
  getPurchaseItems,
  deletePurchase,
  updatePurchase,
};