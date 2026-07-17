import api from "../../../config/api";

export type DashboardSummary = {
  sales: {
    total_sales: number;
    total_revenue: number;
    average_bill: number;
  };

  purchases: {
    total_purchases: number;
    total_purchase_amount: number;
  };

  profit: {
    revenue: number;
    cost: number;
    gross_profit: number;
    margin: number;
  };

  inventory: {
    inventory_value: number;
  };
};

export type SalesTrend = {
  label: string;
  total_sales: number;
  revenue: number;
};

export type TopProduct = {
  item_name: string;
  brand: string;
  size: string;
  color: string;
  quantity: number;
  revenue: number;
};

export type LowStockItem = {
  id: number;
  item_name: string;
  brand: string;
  size: string;
  color: string;
  stock: number;
  min_stock: number;
};

export type DeadStockItem = {
  id: number;
  item_name: string;
  brand: string;
  size: string;
  color: string;
  stock: number;
  last_sale: string | null;
};

export async function getDashboardSummary() {
  const res = await api.get("/reports/dashboard");
  return res.data.data as DashboardSummary;
}

export async function getSalesTrend() {
  const res = await api.get("/reports/sales-trend");
  return res.data.data as SalesTrend[];
}

export async function getTopProducts() {
  const res = await api.get("/reports/top-products");
  return res.data.data as TopProduct[];
}

export async function getLowStock() {
  const res = await api.get("/reports/low-stock");
  return res.data.data as LowStockItem[];
}

export async function getDeadStock() {
  const res = await api.get("/reports/dead-stock");
  return res.data.data as DeadStockItem[];
}

export type RevenuePurchase = {

  label:string;

  revenue:number;

  purchase:number;

};

export async function getRevenueVsPurchase(){

  const response =
    await api.get(
      "/reports/revenue-vs-purchase"
    );

  return response.data.data;

}