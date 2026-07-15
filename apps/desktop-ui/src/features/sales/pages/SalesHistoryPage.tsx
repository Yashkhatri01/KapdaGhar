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
  <button
    onClick={() => navigate("/sales")}
    className="
      flex items-center gap-2
      px-4 py-2
      bg-blue-700
      hover:bg-black
      text-white
      rounded-lg
      font-medium
      transition-all
      shadow-sm
      hover:shadow-md
    "
  >
    <ArrowLeft size={18} />
    Back to Sales
  </button>
</div>

      {/* SALES TABLE */}
      <div className="bg-white border rounded p-4">

        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : sales.length === 0 ? (
          <p className="text-sm text-gray-400">No sales found</p>
        ) : (
          <table className="w-full text-sm">

            <thead>
              <tr className="text-left border-b">
                <th className="p-2">ID</th>
                <th className="p-2">Amount</th>
                <th className="px-4 py-3 text-left">
                  Customer
                </th>
                <th className="p-2">Payment</th>
                <th className="p-2">Date</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>

            <tbody>
  {sales.map((s, index) => (
    <tr key={s.id} className="border-b">

      <td className="p-2">
        #{index + 1}
      </td>

      <td className="p-2 font-semibold">
        ₹{s.grand_total}
      </td>

      {/* 👤 CUSTOMER */}
      <td className="px-4 py-3">
        {s.customer_name ? (
          <span className="inline-flex items-center gap-2 font-medium">
            👤 {s.customer_name}
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 text-gray-500">
            🚶 Walk-in Customer
          </span>
        )}
      </td>

      <td className="p-2">
        {s.payment_method}
      </td>

      <td className="p-2 text-gray-500">
        {new Date(s.created_at).toLocaleString()}
      </td>

      <td className="p-2">
        <div className="flex gap-3">

          <button
            onClick={() => openSaleDetails(s)}
            className="text-blue-600 hover:underline"
          >
            View
          </button>

          <button
            onClick={() =>
              navigate(`/sales/edit/${s.id}`)
            }
            className="text-green-600 hover:underline"
          >
            Edit
          </button>

          <button
            onClick={() => setDeleteId(s.id)}
            className="text-red-600 hover:underline"
          >
            Delete
          </button>

        </div>
      </td>

    </tr>
  ))}
</tbody>

          </table>

          

          
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
      alert(err.message);
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