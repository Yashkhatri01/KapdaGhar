import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Truck,
  Users,
  RotateCcw,
  BookOpen,
  BarChart3,
  Settings,
  Handshake,
} from "lucide-react";

export const navigation = [
  {
    title: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Inventory",
    subtitle: "Maal",
    path: "/inventory",
    icon: Package,
  },
  {
    title: "Sales",
    subtitle: "Bikri",
    path: "/sales",
    icon: ShoppingCart,
  },
  {
  title: "Purchases",
  subtitle: "Khareed",
  path: "/purchases",
  icon: Truck,
  },
  {
    title: "Suppliers",
    subtitle: "Supplier",
    path: "/suppliers",
    icon: Handshake,
  },
  {
    title: "Customers",
    subtitle: "Grahak",
    path: "/customers",
    icon: Users,
  },
  {
    title: "Returns",
    subtitle: "Wapsi",
    path: "/returns",
    icon: RotateCcw,
  },
  {
    title: "Cash Book",
    subtitle: "Hisaab",
    path: "/cashbook",
    icon: BookOpen,
  },
  {
    title: "Reports",
    subtitle: "Business Report",
    path: "/reports",
    icon: BarChart3,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  },
];