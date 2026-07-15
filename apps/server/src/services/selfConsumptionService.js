const { run, get, all, exec } = require("../db/database");

async function createSelfConsumption(data) {

  const {
    remarks,
    items
  } = data;

  try {

    await exec("BEGIN TRANSACTION");

    let totalCost = 0;

    // Calculate Total Cost
    for (const item of items) {

      const inventory = await get(
        `
        SELECT
          purchase_price,
          stock
        FROM inventory
        WHERE id = ?
        `,
        [item.inventory_id]
      );

      if (!inventory) {
        throw new Error(
          `Inventory item ${item.inventory_id} not found.`
        );
      }

      if (inventory.stock < item.quantity) {
        throw new Error(
          `Insufficient stock for inventory item ${item.inventory_id}.`
        );
      }

      totalCost +=
        inventory.purchase_price *
        item.quantity;

    }

    // Create Header
    const result = await run(
      `
      INSERT INTO self_consumptions
      (
        total_cost,
        remarks
      )
      VALUES (?, ?)
      `,
      [
        totalCost,
        remarks || null
      ]
    );

    const selfConsumptionId = result.lastID;

    // Process Items
    for (const item of items) {

      const inventory = await get(
        `
        SELECT
          purchase_price
        FROM inventory
        WHERE id = ?
        `,
        [item.inventory_id]
      );

      const unitCost =
        inventory.purchase_price;

      const total =
        unitCost *
        item.quantity;

      // Insert Item
      await run(
        `
        INSERT INTO self_consumption_items
        (
          self_consumption_id,
          inventory_id,
          quantity,
          unit_cost,
          total
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
          selfConsumptionId,
          item.inventory_id,
          item.quantity,
          unitCost,
          total
        ]
      );

      // Reduce Stock
      const update = await run(
        `
        UPDATE inventory
        SET stock = stock - ?
        WHERE id = ?
        AND stock >= ?
        `,
        [
          item.quantity,
          item.inventory_id,
          item.quantity
        ]
      );

      if (update.changes === 0) {
        throw new Error(
          `Insufficient stock for inventory item ${item.inventory_id}.`
        );
      }

      // Inventory Transaction
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
          "SELF_CONSUMPTION",
          item.quantity,
          "self_consumptions",
          selfConsumptionId,
          remarks || "Self Consumption"
        ]
      );

    }

    await exec("COMMIT");

    return {
      self_consumption_id: selfConsumptionId,
      total_cost: totalCost
    };

  } catch (err) {

    try {
      await exec("ROLLBACK");
    } catch (_) {}

    throw err;

  }

}

async function getAllSelfConsumptions() {

  return await all(
    `
    SELECT *
    FROM self_consumptions
    ORDER BY id DESC
    `
  );

}

async function getSelfConsumptionItems(id) {
  return await all(
    `
    SELECT *
    FROM self_consumption_items
    WHERE self_consumption_id = ?
    ORDER BY id
    `,
    [id]
  );
}

module.exports = {
  createSelfConsumption,
  getAllSelfConsumptions,
  getSelfConsumptionItems
};