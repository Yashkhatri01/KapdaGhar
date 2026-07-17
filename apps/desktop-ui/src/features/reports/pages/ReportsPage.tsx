import { useEffect, useState } from "react";

import PageHeader from "../../../components/shared/pageheader/PageHeader";

import SummaryCards from "../components/SummaryCards";
import SalesTrendChart from "../components/SalesTrendChart";
import RevenuePurchaseChart from "../components/RevenuePurchaseChart";
import TopProductsCard from "../components/TopProductsCard";
import LowStockCard from "../components/LowStockCard";
import DeadStockCard from "../components/DeadStockCard";

import {

  getDashboardSummary,
  getSalesTrend,
  getRevenueVsPurchase,
  getTopProducts,
  getLowStock,
  getDeadStock,

  type DashboardSummary,
  type SalesTrend,
  type RevenuePurchase,
  type TopProduct,
  type LowStockItem,
  type DeadStockItem,

} from "../api/reportsApi";

function ReportsPage() {



  const [summary, setSummary] =
    useState<DashboardSummary | null>(null);

  const [trend, setTrend] =
    useState<SalesTrend[]>([]);

  const [topProducts, setTopProducts] =
    useState<TopProduct[]>([]);

  const [lowStock, setLowStock] =
    useState<LowStockItem[]>([]);

  const [deadStock, setDeadStock] =
    useState<DeadStockItem[]>([]);

  const [comparison, setComparison] =
  useState<RevenuePurchase[]>([]);

  useEffect(() => {

    loadDashboard();

  }, []);

  async function loadDashboard() {

    try {


      const [

  dashboard,

  salesTrend,

  comparisonData,

  top,

  low,

  dead,

] = await Promise.all([

        getDashboardSummary(),

        getSalesTrend(),

        getRevenueVsPurchase(),

        getTopProducts(),

        getLowStock(),

        getDeadStock(),

      ]);

      setSummary(dashboard);

      setTrend(salesTrend);

      setComparison(comparisonData);

      setTopProducts(top);

      setLowStock(low);

      setDeadStock(dead);

    }

    finally {

    }

  }

  return (

    <div className="space-y-6">

      <PageHeader
        title="Reports"
        subtitle="Business performance aur inventory insights"
      />

      {summary && (

  <SummaryCards

    revenue={summary.sales.total_revenue}

    purchases={
      summary.purchases.total_purchase_amount
    }

    profit={
      summary.profit.gross_profit
    }

    margin={
      summary.profit.margin
    }

    inventoryValue={
      summary.inventory.inventory_value
    }

  />

)}

    <SalesTrendChart
  data={trend}
/>

<RevenuePurchaseChart
  data={comparison}
/>

<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

  <TopProductsCard
    products={topProducts}
  />

  <LowStockCard
    items={lowStock}
  />

  <DeadStockCard
    items={deadStock}
  />

</div>



    </div>

  );

}

export default ReportsPage;