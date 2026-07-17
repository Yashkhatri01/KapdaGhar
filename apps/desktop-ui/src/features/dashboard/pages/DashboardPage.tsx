import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Card from "../../../components/ui/card/Card";
import Button from "../../../components/ui/button/Button";
import StatCard from "../../../components/shared/statcard/StatCard";
import QuickActionCard from "../../../components/shared/quickactioncard/QuickActionCard";

import {
  getDashboardData,
  type DashboardData,
} from "../api/dashboardApi";

import {
  ShoppingBag,
  Wallet,
  AlertTriangle,
  IndianRupee,
  PackagePlus,
  Users,
  Truck,
  Package,
  BarChart3,
} from "lucide-react";

function DashboardPage() {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const [dashboard,setDashboard] =
useState<DashboardData | null>(null);

const [loading,setLoading] =
useState(true);

useEffect(()=>{

  load();

},[]);

async function load(){

  try{

    setLoading(true);

    setDashboard(
      await getDashboardData()
    );

  }

  finally{

    setLoading(false);

  }

}

  const navigate = useNavigate();

  if (loading) {
  return (
    <div className="p-8 text-gray-500">
      Loading dashboard...
    </div>
  );
}

const hour = new Date().getHours();

let greeting = "Good Morning";

if (hour >= 12 && hour < 17) {

  greeting = "Good Afternoon";

}

else if (hour >= 17) {

  greeting = "Good Evening";

}

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex items-start justify-between">

        <div>

          <h1 className="text-4xl font-bold text-gray-900">
            {greeting}, SethJi 👋
          </h1>

          <p className="mt-2 text-lg text-gray-600">
            Welcome back to{" "}
            <span className="font-semibold">
              Chhaya Garments
            </span>
          </p>

          <p className="mt-1 text-sm text-gray-400">
            {today}
          </p>

        </div>

        <Button

        onClick={()=>navigate("/sales")}

        >

        + New Sale

        </Button>

      </div>

      {/* Summary Cards */}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Today's Sales"
          subtitle="Aaj ki Bikri"
          value={`₹${dashboard?.summary.todaySales ?? 0}`}
          icon={ShoppingBag}
          iconBg="bg-green-100"
          iconColor="text-green-700"
        />

        <StatCard
          title="Today's Profit"
          subtitle="Aaj ki Kamai"
          value={`₹${dashboard?.summary.todayProfit ?? 0}`}
          icon={IndianRupee}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-700"
        />

        <StatCard
          title="Cash in Shop"
          subtitle="Dukaan ka Cash"
          value={`₹${dashboard?.summary.cashBalance ?? 0}`}
          icon={Wallet}
          iconBg="bg-blue-100"
          iconColor="text-blue-700"
        />

        <StatCard
          title="Low Stock"
          subtitle="Kam Stock"
          value={`${dashboard?.summary.lowStockCount ?? 0}`}
          icon={AlertTriangle}
          iconBg="bg-amber-100"
          iconColor="text-amber-700"
        />

      </div>

      {/* Recent Sales + Low Stock */}

      <div className="grid gap-6 xl:grid-cols-2">

        <Card>

  <div className="flex items-center justify-between mb-4">

    <h2 className="text-lg font-semibold">

      Recent Sales

    </h2>

    <Button
      onClick={() => navigate("/sales/history")}
    >
      View All
    </Button>

  </div>

  {

    dashboard?.recentSales.length ? (

      <table className="w-full text-sm">

        <thead>

          <tr className="border-b text-gray-500">

            <th className="text-left py-2">

              Customer

            </th>

            <th className="text-center py-2">

              Bill

            </th>

            <th className="text-right py-2">

              Amount

            </th>

          </tr>

        </thead>

        <tbody>

          {

            dashboard.recentSales.map((sale) => (

              <tr
                key={sale.id}
                className="border-b last:border-0"
              >

                <td className="py-3">

                  {sale.customer_name || "Walk-in"}

                </td>

                <td className="text-center">

                  #{sale.id}

                </td>

                <td className="text-right font-semibold text-green-700">

                  ₹{sale.grand_total}

                </td>

              </tr>

            ))

          }

        </tbody>

      </table>

    ) : (

      <p className="text-sm text-gray-400">

        No recent sales

      </p>

    )

  }

</Card>

        <Card>

  <div className="flex items-center justify-between mb-4">

    <h2 className="text-lg font-semibold">

      Low Stock Items

    </h2>

    <Button
      onClick={() => navigate("/inventory")}
    >
      View Inventory
    </Button>

  </div>

  {

    dashboard?.lowStock.length ? (

      <table className="w-full text-sm">

        <thead>

          <tr className="border-b text-gray-500">

            <th className="text-left py-2">

              Item

            </th>

            <th className="text-center py-2">

              Brand

            </th>

            <th className="text-right py-2">

              Stock

            </th>

          </tr>

        </thead>

        <tbody>

          {

            dashboard.lowStock.map((item) => (

              <tr
                key={item.id}
                className="border-b last:border-0"
              >

                <td className="py-3">

                  {item.item_name}

                </td>

                <td className="text-center text-gray-500">

                  {item.brand || "-"}

                </td>

                <td className="text-right">

                  <span className="font-semibold text-red-600">

                    {item.stock}

                  </span>

                  <span className="text-gray-400">

                    {" / "}

                    {item.min_stock}

                  </span>

                </td>

              </tr>

            ))

          }

        </tbody>

      </table>

    ) : (

      <p className="text-sm text-gray-400">

        No low stock items

      </p>

    )

  }

</Card>

      </div>

      {/* Quick Actions */}

      <Card>

        <h2 className="mb-5 text-lg font-semibold">
          Quick Actions
        </h2>

        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">

          <QuickActionCard
            title="New Sale"
            subtitle="Nayi Sale"
            icon={ShoppingBag}
            onClick={() => navigate("/sales")}
          />
            
          <QuickActionCard
            title="New Purchase"
            subtitle="Nayi Purchase"
            icon={PackagePlus}
            onClick={() => navigate("/purchases")}
          />
            
          <QuickActionCard
            title="Inventory"
            subtitle="Maal"
            icon={Package}
            onClick={() => navigate("/inventory")}
          />
            
          <QuickActionCard
            title="Customers"
            subtitle="Grahak"
            icon={Users}
            onClick={() => navigate("/customers")}
          />
            
          <QuickActionCard
            title="Suppliers"
            subtitle="Supplier"
            icon={Truck}
            onClick={() => navigate("/suppliers")}
          />
            
          <QuickActionCard
            title="Reports"
            subtitle="Business Report"
            icon={BarChart3}
            onClick={() => navigate("/reports")}
          />

        </div>

      </Card>

    </div>
  );
}

export default DashboardPage;