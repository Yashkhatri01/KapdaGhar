import { useEffect, useState } from "react";
import PageHeader from "../../../components/shared/pageheader/PageHeader";
import {
  getSales,
  getSaleItems,
  deleteSale,
} from "../api/salesApi";
import SaleItemsModal from "../components/SaleItemsModal";
import ConfirmDialog from "../../../components/ui/confirmdialog/ConfirmDialog";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useToast } from "../../../contexts/ToastContext";
import Button from "../../../components/ui/button/Button";

type Sale = {
  id: number;

  customer_id?: number;

  customer_name?: string | null;

  subtotal: number;
  discount: number;
  tax: number;
  grand_total: number;

  payment_method: string;
  created_at: string;
};

type SaleItem = {
  id: number;
  item_name: string;
  brand?: string;
  size?: string;
  color?: string;
  quantity: number;
  selling_price: number;
  total: number;
};

function SalesHistoryPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [selectedSaleItems, setSelectedSaleItems] = useState<SaleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteSuccessOpen, setDeleteSuccessOpen] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  async function loadSales() {
    setLoading(true);
    try {
      const data = await getSales();
      setSales(data || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSales();
  }, []);

  async function openSaleDetails(sale: Sale) {
  const items = await getSaleItems(sale.id);

  setSelectedSale(sale);
  setSelectedSaleItems(items || []);
  setModalOpen(true);
}

  return (
    <div className="space-y-6">

      <PageHeader
        title="Sales History"
        subtitle="Pichli saari Bikri ka record"
      />

      <div className="flex justify-end">
  <Button
  onClick={() => navigate("/sales")}
  className="flex items-center gap-2"
>
  <ArrowLeft size={18} />
  Back to Sales
</Button>
</div>

      {/* SALES TABLE */}

<div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

  {loading ? (

    <div className="p-8 text-center text-sm text-gray-500">
      Loading...
    </div>

  ) : sales.length === 0 ? (

    <div className="p-8 text-center text-sm text-gray-400">
      No sales found
    </div>

  ) : (

    <div className="overflow-x-auto">

      <table className="w-full table-auto text-sm">

        <thead className="bg-gray-50 border-b">

          <tr>

            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              ID
            </th>

            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              Amount
            </th>

            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              Customer
            </th>

            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              Payment
            </th>

            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              Date
            </th>

            <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
              Action
            </th>

          </tr>

        </thead>

        <tbody>

          {sales.map((s, index) => (

            <tr
              key={s.id}
              className="
                border-b
                last:border-none
                hover:bg-indigo-50/40
                transition-all
                duration-200
              "
            >

              <td className="px-5 py-4">

                <span
                  className="
                    inline-flex
                    rounded-full
                    bg-indigo-100
                    px-3
                    py-1
                    text-xs
                    font-semibold
                    text-indigo-700
                  "
                >
                  #{index + 1}
                </span>

              </td>

              <td className="px-5 py-4">

                <span className="font-semibold text-gray-900">
                  ₹{s.grand_total}
                </span>

              </td>

              {/* CUSTOMER */}

              <td className="px-5 py-4">

                {s.customer_name ? (

                  <span className="inline-flex items-center gap-2 font-medium text-gray-800">

                    👤 {s.customer_name}

                  </span>

                ) : (

                  <span className="inline-flex items-center gap-2 text-gray-500">

                    🚶 Walk-in Customer

                  </span>

                )}

              </td>

              <td className="px-5 py-4">

                <span
                  className={`
                    inline-flex
                    rounded-full
                    px-3
                    py-1
                    text-xs
                    font-medium

                    ${
                      s.payment_method === "CASH"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-emerald-100 text-emerald-700"
                    }
                  `}
                >

                  {s.payment_method}

                </span>

              </td>

              <td className="px-5 py-4 text-gray-500 whitespace-nowrap">

                {new Date(s.created_at).toLocaleString()}

              </td>

              <td className="px-5 py-4">

                <div className="flex justify-center gap-2">

                  <button
                    onClick={() => openSaleDetails(s)}
                    className="
                      rounded-lg
                      border
                      border-blue-200
                      bg-blue-50
                      px-3
                      py-1.5
                      text-xs
                      font-medium
                      text-blue-700
                      transition-all
                      duration-200
                      hover:-translate-y-0.5
                      hover:bg-blue-100
                    "
                  >
                    View
                  </button>

                  <button
                    onClick={() =>
                      navigate(`/sales/edit/${s.id}`)
                    }
                    className="
                      rounded-lg
                      border
                      border-green-200
                      bg-green-50
                      px-3
                      py-1.5
                      text-xs
                      font-medium
                      text-green-700
                      transition-all
                      duration-200
                      hover:-translate-y-0.5
                      hover:bg-green-100
                    "
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => setDeleteId(s.id)}
                    className="
                      rounded-lg
                      border
                      border-red-200
                      bg-red-50
                      px-3
                      py-1.5
                      text-xs
                      font-medium
                      text-red-700
                      transition-all
                      duration-200
                      hover:-translate-y-0.5
                      hover:bg-red-100
                    "
                  >
                    Delete
                  </button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  )}


        <ConfirmDialog
  open={deleteId !== null}
  title="Delete Sale"
  message="Are you sure you want to delete this sale? This action cannot be undone."
  confirmText="Yes, Delete"
  cancelText="Cancel"
  type="danger"
  onCancel={() => setDeleteId(null)}
  onConfirm={async () => {
    if (!deleteId) return;

    const id = deleteId;

    setDeleteId(null);

    try {
      await deleteSale(id);
      await loadSales(); // 🔥 IMPORTANT
      
      setDeleteSuccessOpen(true);
    } catch (err: any) {
      toast.error({
        title: "Operation Failed",
        description: err.message,
      });
    }
  }}
/>

<ConfirmDialog
  open={deleteSuccessOpen}
  title="Sale Deleted"
  message="Sale successfully delete ho gayi hai."
  confirmText="OK"
  cancelText={undefined}
  type="info"
  onCancel={() => setDeleteSuccessOpen(false)}
  onConfirm={() => setDeleteSuccessOpen(false)}
/>



      </div>

      <SaleItemsModal
  open={modalOpen}
  sale={selectedSale}
  items={selectedSaleItems}
  onClose={() => {
    setModalOpen(false);
    setSelectedSale(null);
    setSelectedSaleItems([]);
  }}
/>

    </div>
  );
}

export default SalesHistoryPage;