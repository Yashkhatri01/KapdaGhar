const { run, get, all, exec } = require("../db/database");
const INVENTORY_MOVEMENTS = require("../constants/inventoryMovements");



/**
 * Validate sale exists and fetch it
 */
async function getSaleById(sale_id) {
  const sale = await get(
    `SELECT * FROM sales WHERE id = ?`,
    [sale_id]
  );

  if (!sale) {
    throw new Error("Sale not found");
  }

  return sale;
}

/**
 * Get sale items for validation
 */
async function getSaleItems(sale_id) {
  return await all(
    `
    SELECT
      si.id AS sale_item_id,

      si.inventory_id,

      si.quantity,

      si.selling_price,

      si.total,

      i.item_name,
      i.brand,
      i.size,
      i.color,

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
    [sale_id]
  );
}

/**
 * Get total already returned quantity for a sale_item
 */
async function getAlreadyReturnedQty(sale_item_id) {
  const row = await get(
    `
    SELECT COALESCE(SUM(quantity), 0) as total
    FROM customer_return_items
    WHERE sale_item_id = ?
    `,
    [sale_item_id]
  );

  return row.total;
}


async function getCustomerReturns() {

  const data = await all(
    `
    SELECT
      cr.id,
      cr.created_at,
      cr.sale_id,
      cr.customer_id,
      c.name AS customer_name,
      cr.total,
      cr.status

    FROM customer_returns cr

    LEFT JOIN customers c
      ON cr.customer_id = c.id

    ORDER BY cr.id DESC
    `
  );

  console.log("CUSTOMER RETURNS =>", data);

  return data;
}

async function getCustomerReturnById(id) {

  const header = await get(
    `
    SELECT
      cr.*,
      c.name AS customer_name

    FROM customer_returns cr

    LEFT JOIN customers c
      ON c.id = cr.customer_id

    WHERE cr.id = ?
    `,
    [id]
  );

  if (!header) {
    throw new Error("Return not found");
  }

  const returnedItems = await all(
    `
    SELECT
      cri.*,
      i.item_name,
      i.brand,
      i.size,
      i.color

    FROM customer_return_items cri

    JOIN inventory i
      ON i.id = cri.inventory_id

    WHERE customer_return_id = ?
    `,
    [id]
  );

  const exchangeItems = await all(
    `
    SELECT
      cei.*,
      i.item_name,
      i.brand,
      i.size,
      i.color

    FROM customer_return_exchange_items cei

    JOIN inventory i
      ON i.id = cei.inventory_id

    WHERE customer_return_id = ?
    `,
    [id]
  );

  return {
  return: header,
  items: returnedItems,
  exchange_items: exchangeItems,
};

}

/**
 * Main function: Create Customer Return
 */
async function createCustomerReturn(data) {

  const {
  sale_id,
  items,
  notes,
  return_type,
  exchange_items = [],
} = data;

  await exec("BEGIN TRANSACTION");

  try {
    // 1. Validate sale
    const sale = await getSaleById(sale_id);

    // 2. Get sale items
    const saleItems = await getSaleItems(sale_id);


    // Map for quick lookup
    const saleItemMap = new Map();
    for (const si of saleItems) {
      saleItemMap.set(si.sale_item_id, si);
    }

    // 3. Validate all return items first
    for (const item of items) {
      const saleItem = saleItemMap.get(item.sale_item_id);

      if (!saleItem) {
        throw new Error(`Invalid sale item: ${item.sale_item_id}`);
      }

      if (saleItem.quantity < item.quantity) {
        throw new Error(
          `Return quantity exceeds sold quantity for item ${item.sale_item_id}`
        );
      }

      const alreadyReturned = await getAlreadyReturnedQty(item.sale_item_id);

      if (alreadyReturned + item.quantity > saleItem.quantity) {
        throw new Error(
          `Return limit exceeded for sale item ${item.sale_item_id}`
        );
      }
    }

    // 4. Create return header
    const result = await run(
      `
      INSERT INTO customer_returns
      (sale_id, customer_id, total, status, notes)
      VALUES (?, ?, ?, ?, ?)
      `,
      [
  sale_id,
  sale.customer_id,
  0,
  return_type === "EXCHANGE"
    ? "EXCHANGED"
    : "REFUNDED",
  notes || null,
]
    );

    const returnId = result.lastID;

    let grandTotal = 0;

        // 5. Process each return item
    for (const item of items) {

      const saleItem = saleItemMap.get(item.sale_item_id);

      const alreadyReturned = await getAlreadyReturnedQty(item.sale_item_id);

      const remainingAllowed = saleItem.quantity - alreadyReturned;

      if (item.quantity > remainingAllowed) {
        throw new Error(
          `Not enough remaining quantity to return for sale_item_id ${item.sale_item_id}`
        );
      }

      const unitPrice = saleItem.selling_price;
      const itemTotal = unitPrice * item.quantity;

      grandTotal += itemTotal;

      // Insert return item
      await run(
        `
        INSERT INTO customer_return_items
        (
          customer_return_id,
          sale_item_id,
          inventory_id,
          quantity,
          unit_price,
          total
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          returnId,
          item.sale_item_id,
          saleItem.inventory_id,
          item.quantity,
          unitPrice,
          itemTotal
        ]
      );

      // Increase inventory stock
      await run(
        `
        UPDATE inventory
        SET stock = stock + ?
        WHERE id = ?
        `,
        [
          item.quantity,
          saleItem.inventory_id
        ]
      );

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
          saleItem.inventory_id,
          INVENTORY_MOVEMENTS.CUSTOMER_RETURN,
          item.quantity,
          "customer_returns",
          returnId,
          "Customer return processed"
        ]
      );
    }

    // 6. Update total
    await run(
      `
      UPDATE customer_returns
      SET total = ?
      WHERE id = ?
      `,
      [grandTotal, returnId]
    );

    if (return_type === "EXCHANGE") {

  for (const item of exchange_items) {

    const inventory = await get(
      `
      SELECT *
      FROM inventory
      WHERE id = ?
      `,
      [item.inventory_id]
    );

    if (!inventory) {
      throw new Error(
        `Inventory ${item.inventory_id} not found`
      );
    }

    if (inventory.stock < item.quantity) {
      throw new Error(
        `${inventory.item_name} stock insufficient`
      );
    }

    await run(
      `
      UPDATE inventory
      SET stock = stock - ?
      WHERE id = ?
      `,
      [
        item.quantity,
        item.inventory_id,
      ]
    );

    await run(
`
INSERT INTO customer_return_exchange_items
(
  customer_return_id,
  inventory_id,
  quantity,
  selling_price,
  total
)
VALUES (?, ?, ?, ?, ?)
`,
[
  returnId,
  item.inventory_id,
  item.quantity,
  item.selling_price,
  item.total
]
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
        INVENTORY_MOVEMENTS.SALE,
        item.quantity,
        "customer_returns",
        returnId,
        "Exchange item issued",
      ]
    );

  }

}


    // 7. Commit transaction
await exec("COMMIT");

return {
  return_id: returnId,
  sale_id,
  customer_id: sale.customer_id,

  total: grandTotal,

  status:
    return_type === "EXCHANGE"
      ? "EXCHANGED"
      : "REFUNDED",
};

  } catch (err) {
    await exec("ROLLBACK");
    throw err;
  }
}

/**
 * List all returns
 */
async function getAllReturns() {
  return await all(
    `
    SELECT *
    FROM customer_returns
    ORDER BY id DESC
    `
  );
}

module.exports = {
  createCustomerReturn,
  getAllReturns,
  getCustomerReturns,
  getCustomerReturnById,
};
