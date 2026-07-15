import Card from "../../../components/ui/card/Card";
import Button from "../../../components/ui/button/Button";
import StatCard from "../../../components/shared/statcard/StatCard";
import QuickActionCard from "../../../components/shared/quickactioncard/QuickActionCard";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Wallet,
  AlertTriangle,
  IndianRupee,
  PackagePlus,
  Users,
  Truck,
  FileText,
} from "lucide-react";

function DashboardPage() {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const navigate = useNavigate();

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex items-start justify-between">

        <div>

          <h1 className="text-4xl font-bold text-gray-900">
            Good Morning, Santosh Ji 👋
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

        <Button>
          + New Sale
        </Button>

      </div>

      {/* Summary Cards */}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Today's Sales"
          subtitle="Aaj ki Bikri"
          value="₹0"
          icon={ShoppingBag}
          iconBg="bg-green-100"
          iconColor="text-green-700"
        />

        <StatCard
          title="Today's Profit"
          subtitle="Aaj ki Kamai"
          value="₹0"
          icon={IndianRupee}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-700"
        />

        <StatCard
          title="Cash in Shop"
          subtitle="Dukaan ka Cash"
          value="₹0"
          icon={Wallet}
          iconBg="bg-blue-100"
          iconColor="text-blue-700"
        />

        <StatCard
          title="Low Stock"
          subtitle="Kam Stock"
          value="0"
          icon={AlertTriangle}
          iconBg="bg-amber-100"
          iconColor="text-amber-700"
        />

      </div>

      {/* Recent Sales + Low Stock */}

      <div className="grid gap-6 xl:grid-cols-2">

        <Card>

          <h2 className="text-lg font-semibold">
            Recent Sales
          </h2>

          <p className="mt-2 text-sm text-gray-400">
            No sales today.
          </p>

        </Card>

        <Card>

          <h2 className="text-lg font-semibold">
            Low Stock Items
          </h2>

          <p className="mt-2 text-sm text-gray-400">
            No low stock items.
          </p>

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
            icon={PackagePlus}
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
            icon={FileText}
            onClick={() => navigate("/reports")}
          />

        </div>

      </Card>

    </div>
  );
}

export default DashboardPage;