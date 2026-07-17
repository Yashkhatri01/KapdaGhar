const {
  get,
  all,
} = require("../db/database");

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

      ROUND(

  COALESCE(
    AVG(grand_total),
    0
  ),

  2

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

/**
 * Inventory Value
 */
async function getInventoryValue() {

  return await get(
    `
    SELECT

      COALESCE(
        SUM(
          stock *
          purchase_price
        ),
        0
      ) AS inventory_value

    FROM inventory
    `
  );

}

async function getDashboardSummary() {

  const [
    sales,
    purchases,
    profit,
    inventory
  ] = await Promise.all([

    getSalesSummary(),

    getPurchaseSummary(),

    getProfitSummary(),

    getInventoryValue()

  ]);

  return {

    sales,

    purchases,

    profit: {

      ...profit,

      margin:

        profit.revenue > 0

          ? Number(
              (
                (profit.gross_profit /
                  profit.revenue) *
                100
              ).toFixed(2)
            )

          : 0

    },

    inventory

  };

}

/**
 * Sales Trend
 */
async function getSalesTrend() {

  return await all(
    `
    SELECT

      CASE strftime('%m',created_at)

        WHEN '01' THEN 'Jan'
        WHEN '02' THEN 'Feb'
        WHEN '03' THEN 'Mar'
        WHEN '04' THEN 'Apr'
        WHEN '05' THEN 'May'
        WHEN '06' THEN 'Jun'
        WHEN '07' THEN 'Jul'
        WHEN '08' THEN 'Aug'
        WHEN '09' THEN 'Sep'
        WHEN '10' THEN 'Oct'
        WHEN '11' THEN 'Nov'
        WHEN '12' THEN 'Dec'

      END AS label,

      COUNT(*) AS total_sales,

      COALESCE(
        SUM(grand_total),
        0
      ) AS revenue

    FROM sales

    WHERE
      strftime('%Y',created_at)=
      strftime('%Y','now')

    GROUP BY
      strftime('%m',created_at)

    ORDER BY
      strftime('%m',created_at)
    `
  );

}

/**
 * Top Selling Products
 */
async function getTopProducts() {

  return await all(
    `
    SELECT

      i.item_name,

      i.brand,

      i.size,

      i.color,

      SUM(si.quantity) AS quantity,

      SUM(si.total) AS revenue

    FROM sale_items si

    JOIN inventory i

      ON i.id = si.inventory_id

    GROUP BY si.inventory_id

    ORDER BY quantity DESC

    LIMIT 5
    `
  );

}


/**
 * Low Stock
 */
async function getLowStockItems() {

  return await all(
    `
    SELECT

  id,

  item_name,

  brand,

  size,

  color,

  stock,

  min_stock

FROM inventory

WHERE

  status='ACTIVE'

  AND

  min_stock>0

  AND

  stock<=min_stock

ORDER BY

  stock ASC,

  item_name;
    `
  );

}


/**
 * Dead Stock
 */
async function getDeadStock() {

  return await all(
    `
    SELECT

      i.id,

      i.item_name,

      i.brand,

      i.size,

      i.color,

      i.stock,

      MAX(s.created_at) AS last_sale

    FROM inventory i

LEFT JOIN sale_items si
ON si.inventory_id=i.id

LEFT JOIN sales s
ON s.id=si.sale_id

WHERE
  i.status='ACTIVE'

  AND

  i.stock>0

GROUP BY i.id

HAVING

  last_sale IS NULL

  OR

  julianday('now')-julianday(last_sale)>=300

ORDER BY last_sale ASC;
    `
  );

}

/**
 * Revenue vs Purchase (Monthly)
 */
async function getRevenueVsPurchase() {

  const sales = await all(`
    SELECT

      strftime('%m', created_at) AS month,

      COALESCE(
        SUM(grand_total),
        0
      ) AS revenue

    FROM sales

    WHERE
      strftime('%Y', created_at)=strftime('%Y','now')

    GROUP BY month
  `);

  const purchases = await all(`
    SELECT

      strftime('%m', created_at) AS month,

      COALESCE(
        SUM(total),
        0
      ) AS purchase

    FROM purchases

    WHERE
      strftime('%Y', created_at)=strftime('%Y','now')

    GROUP BY month
  `);

  const monthNames = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  const result = [];

  for (let i = 1; i <= 12; i++) {

    const m = String(i).padStart(2,"0");

    result.push({

      label: monthNames[i-1],

      revenue:
        Number(
          sales.find(x=>x.month===m)?.revenue
        ) || 0,

      purchase:
        Number(
          purchases.find(x=>x.month===m)?.purchase
        ) || 0

    });

  }

  return result;

}


module.exports = {
  getSalesSummary,
  getPurchaseSummary,
  getDeadStock,
  getProfitSummary,
  getLowStockItems,
  getInventoryValue,
  getTopProducts,
  getSalesTrend,
  getDashboardSummary,
  getRevenueVsPurchase
};