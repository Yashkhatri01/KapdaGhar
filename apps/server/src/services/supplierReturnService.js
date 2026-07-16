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
    SELECT

      pi.id AS purchase_item_id,

      pi.inventory_id,

      pi.quantity,

      pi.unit_cost,

      pi.total,

      i.item_name,
      i.brand,
      i.size,
      i.color,

      COALESCE(r.returned_qty,0)
        AS already_returned,

      (
        pi.quantity -
        COALESCE(r.returned_qty,0)
      ) AS remaining_quantity

    FROM purchase_items pi

    LEFT JOIN inventory i
      ON pi.inventory_id = i.id

    LEFT JOIN (

      SELECT
        purchase_item_id,
        SUM(quantity) returned_qty

      FROM supplier_return_items

      GROUP BY purchase_item_id

    ) r

    ON pi.id = r.purchase_item_id

    WHERE pi.purchase_id = ?

    ORDER BY pi.id
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

async function getSupplierReturns() {

  return await all(
    `
    SELECT

      sr.id,

      sr.purchase_id,

      sr.supplier_id,

      s.name AS supplier_name,

      sr.total,

      sr.created_at

    FROM supplier_returns sr

    LEFT JOIN suppliers s

      ON sr.supplier_id=s.id

    ORDER BY sr.id DESC
    `
  );

}

async function getSupplierReturnById(id){

  const header=await get(
`
SELECT

sr.*,

s.name supplier_name

FROM supplier_returns sr

LEFT JOIN suppliers s

ON s.id=sr.supplier_id

WHERE sr.id=?

`,
[id]
);

if(!header){

throw new Error(
"Supplier Return not found"
);

}

const items=await all(
`
SELECT

sri.*,

i.item_name,

i.brand,

i.size,

i.color

FROM supplier_return_items sri

JOIN inventory i

ON i.id=sri.inventory_id

WHERE supplier_return_id=?

`,
[id]
);

return{

header,

items

};

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
          purchaseItemMap.set(
      item.purchase_item_id,
      item
    );
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
    "INCOME",
    grandTotal,
    `Supplier Return #${supplierReturnId}`,
    "supplier_returns",
    supplierReturnId,
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


module.exports={
createSupplierReturn,
getSupplierReturns,
getSupplierReturnById
};