const { run, get, all, exec } = require("../db/database");
const INVENTORY_MOVEMENTS = require("../constants/inventoryMovements");

/**
 * Get purchase by id
 */
async function getPurchaseById(purchaseId) {
  const purchase = await get(
    `
    SELECT *
    FROM purchases
    WHERE id = ?
    `,
    [purchaseId]
  );

  if (!purchase) {
    throw new Error("Purchase not found.");
  }

  return purchase;
}

/**
 * Get purchase items
 */
async function getPurchaseItems(purchaseId) {
  return await all(
    `
    SELECT *
    FROM purchase_items
    WHERE purchase_id = ?
    `,
    [purchaseId]
  );
}

/**
 * Total quantity already returned
 */
async function getAlreadyReturnedQty(purchaseItemId) {
  const row = await get(
    `
    SELECT
      COALESCE(SUM(quantity), 0) AS returned
    FROM supplier_return_items
    WHERE purchase_item_id = ?
    `,
    [purchaseItemId]
  );

  return row.returned;
}

/**
 * Create Supplier Return
 */
async function createSupplierReturn(data) {
  const { purchase_id, items } = data;

  await exec("BEGIN TRANSACTION");

  try {

    // Validate purchase
    const purchase = await getPurchaseById(purchase_id);

    // Get purchase items
    const purchaseItems = await getPurchaseItems(purchase_id);

    const purchaseItemMap = new Map();

    for (const item of purchaseItems) {
      purchaseItemMap.set(item.id, item);
    }

    // Validate request
    for (const item of items) {

      const purchaseItem = purchaseItemMap.get(item.purchase_item_id);

      if (!purchaseItem) {
        throw new Error(
          `Invalid purchase item ${item.purchase_item_id}`
        );
      }

      if (item.quantity > purchaseItem.quantity) {
        throw new Error(
          `Return quantity exceeds purchased quantity.`
        );
      }

      const alreadyReturned =
        await getAlreadyReturnedQty(item.purchase_item_id);

      if (
        alreadyReturned + item.quantity >
        purchaseItem.quantity
      ) {
        throw new Error(
          `Return quantity exceeds remaining quantity.`
        );
      }

    }

    // Create return header
    const result = await run(
      `
      INSERT INTO supplier_returns
      (
        purchase_id,
        supplier_id,
        total
      )
      VALUES (?, ?, ?)
      `,
      [
        purchase_id,
        purchase.supplier_id,
        0
      ]
    );

    const supplierReturnId = result.lastID;

    let grandTotal = 0;

        // Process each return item
    for (const item of items) {

      const purchaseItem = purchaseItemMap.get(
        item.purchase_item_id
      );

      const alreadyReturned =
        await getAlreadyReturnedQty(
          item.purchase_item_id
        );

      const remainingQty =
        purchaseItem.quantity - alreadyReturned;

      if (item.quantity > remainingQty) {
        throw new Error(
          `Return quantity exceeds remaining quantity.`
        );
      }

      const unitCost = purchaseItem.unit_cost;
      const itemTotal = unitCost * item.quantity;

      grandTotal += itemTotal;

      // Insert return item
      await run(
        `
        INSERT INTO supplier_return_items
        (
          supplier_return_id,
          purchase_item_id,
          inventory_id,
          quantity,
          unit_cost,
          total
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          supplierReturnId,
          item.purchase_item_id,
          purchaseItem.inventory_id,
          item.quantity,
          unitCost,
          itemTotal
        ]
      );

      
        // Reduce inventory
        const result = await run(
          `
          UPDATE inventory
          SET stock = stock - ?
          WHERE id = ?
          AND stock >= ?
          `,
          [
            item.quantity,
            purchaseItem.inventory_id,
            item.quantity
          ]
        );

        if (result.changes === 0) {
          throw new Error("Insufficient stock for supplier return.");
        }

      // Inventory transaction
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
          purchaseItem.inventory_id,
          INVENTORY_MOVEMENTS.SUPPLIER_RETURN,
          item.quantity,
          "supplier_returns",
          supplierReturnId,
          "Returned to supplier"
        ]
      );

    }

    // Update return total
    await run(
      `
      UPDATE supplier_returns
      SET total = ?
      WHERE id = ?
      `,
      [
        grandTotal,
        supplierReturnId
      ]
    );

    await exec("COMMIT");

    return {
      supplier_return_id: supplierReturnId,
      purchase_id,
      supplier_id: purchase.supplier_id,
      total: grandTotal
    };

  } catch (err) {

  try {
    await exec("ROLLBACK");
  } catch (_) {}

  throw err;

}
}

/**
 * List all supplier returns
 */
async function getAllSupplierReturns() {

  return await all(
    `
    SELECT *
    FROM supplier_returns
    ORDER BY created_at DESC
    `
  );

}

module.exports = {
  createSupplierReturn,
  getAllSupplierReturns
};