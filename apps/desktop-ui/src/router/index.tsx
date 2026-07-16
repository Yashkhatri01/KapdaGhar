import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import SalesPage from "../features/sales/pages/SalesPage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import InventoryPage from "../features/inventory/pages/InventoryPage";
import CustomersPage from "../features/customers/pages/CustomersPage";
import SuppliersPage from "../features/suppliers/pages/SuppliersPage";
import SalesHistoryPage from "../features/sales/pages/SalesHistoryPage";
import PurchasesPage from "../features/purchases/pages/PurchasesPage";
import PurchaseHistoryPage from "../features/purchases/pages/PurchaseHistoryPage";
import ReturnsPage from "../features/returns/pages/ReturnsPage";
import CustomerReturnsPage from "../features/returns/pages/CustomerReturnsPage";
import CustomerReturnsHistoryPage from "../features/returns/pages/CustomerReturnsHistoryPage";
import SupplierReturnsPage from "../features/returns/pages/SupplierReturnsPage";
import SupplierReturnsHistoryPage from "../features/returns/pages/SupplierReturnsHistoryPage";
import CashbookPage from "../features/cashbook/pages/CashbookPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />
      },
      {
        path: "inventory",
        element: <InventoryPage />
      },
      {
        path: "customers",
        element: <CustomersPage />,
      },
      {
        path: "suppliers",
        element: <SuppliersPage />,
      },

      // CREATE SALE
      {
        path: "sales",
        element: <SalesPage />,
      },

      // EDIT SALE
      {
        path: "sales/edit/:id",
        element: <SalesPage />,
      },

      {
        path: "sales/history",
        element: <SalesHistoryPage />,
      },

      {
        path: "purchases",
        element: <PurchasesPage />,
      },
      {
        path: "/purchases/history",
        element: <PurchaseHistoryPage />,
      },
      {
        path: "/purchases/edit/:id",
        element: <PurchasesPage />
      },
      // RETURNS
      {
        path: "returns",
        element: <ReturnsPage />,
      },
      {
        path: "returns/customer",
        element: <CustomerReturnsPage />,
      },
      {
        path: "returns/customer/history",
        element: <CustomerReturnsHistoryPage />,
      },
      {
        path: "returns/supplier",
        element: <SupplierReturnsPage />,
      },
      {
        path: "returns/supplier/history",
        element: <SupplierReturnsHistoryPage />,
      },
      {
        path: "cashbook",
        element: <CashbookPage />
      },

    ]
  }
]);

export default router;