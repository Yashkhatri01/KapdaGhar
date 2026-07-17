import api from "../../../config/api";

export type DashboardData = {

  summary: {

    todaySales: number;
    todayBills: number;
    todayProfit: number;
    cashBalance: number;
    lowStockCount: number;

  };

  recentSales: {

    id: number;
    created_at: string;
    customer_name: string;
    grand_total: number;

  }[];

  lowStock: {

    id: number;
    item_name: string;
    brand: string;
    stock: number;
    min_stock: number;

  }[];

};

export async function getDashboardData() {

  const res =
    await api.get("/reports/dashboard-home");

  return res.data.data;

}