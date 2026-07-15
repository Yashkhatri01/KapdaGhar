const { get } = require("../db/database");

/**
 * Sales Summary
 */
async function getSalesSummary() {

  return await get(
    `
    SELECT
      COUNT(*) AS total_sales,

      COALESCE(
        SUM(grand_total),
        0
      ) AS total_revenue,

      COALESCE(
        AVG(grand_total),
        0
      ) AS average_bill

    FROM sales
    `
  );

}

/**
 * Purchase Summary
 */
async function getPurchaseSummary() {

  return await get(
    `
    SELECT
      COUNT(*) AS total_purchases,

      COALESCE(
        SUM(total),
        0
      ) AS total_purchase_amount

    FROM purchases
    `
  );

}

/**
 * Profit Summary
 */
async function getProfitSummary() {

  return await get(
    `
    SELECT

      COALESCE(
        SUM(
          sale_items.selling_price
          *
          sale_items.quantity
        ),
        0
      ) AS revenue,

      COALESCE(
        SUM(
          inventory.purchase_price
          *
          sale_items.quantity
        ),
        0
      ) AS cost,

      COALESCE(
        SUM(
          (
            sale_items.selling_price
            -
            inventory.purchase_price
          )
          *
          sale_items.quantity
        ),
        0
      ) AS gross_profit

    FROM sale_items

    INNER JOIN inventory

      ON inventory.id =
      sale_items.inventory_id
    `
  );

}

module.exports = {
  getSalesSummary,
  getPurchaseSummary,
  getProfitSummary
};