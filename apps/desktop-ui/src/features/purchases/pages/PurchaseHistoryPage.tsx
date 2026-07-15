import { useEffect, useState } from "react";
import PageHeader from "../../../components/shared/pageheader/PageHeader";
import {
  getPurchases,
  getPurchaseItems,
  deletePurchase,
} from "../api/purchaseApi";

import ConfirmDialog from "../../../components/ui/confirmdialog/ConfirmDialog";
import PurchaseItemsModal from "../components/PurchaseItemsModal";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";


type Purchase = {
  id: number;

  supplier_id?: number;
  supplier_name?: string | null;

  total: number;

  created_at: string;
};

type PurchaseItem = {
  id: number;

  item_name: string;

  brand?: string;
  size?: string;
  color?: string;

  quantity: number;

  unit_cost: number;

  total: number;
};

function PurchaseHistoryPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [selectedPurchaseItems, setSelectedPurchaseItems] = useState<PurchaseItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] =
    useState<Purchase | null>(null);

  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [deleteSuccessOpen, setDeleteSuccessOpen] =
  useState(false);


  async function loadPurchases() {
    setLoading(true);

    try {
      const data = await getPurchases();
      setPurchases(data || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPurchases();
  }, []);

  async function openPurchaseDetails(
    purchase: Purchase
  ) {
    const items = await getPurchaseItems(
      purchase.id
    );

    setSelectedPurchase(purchase);
    setSelectedPurchaseItems(items || []);
    setModalOpen(true);
  }

  return (
    <div className="space-y-6">

      <PageHeader
        title="Purchase History"
        subtitle="Pichli saari Purchases ka record"
      />

      <div className="flex justify-end">
        <button
          onClick={() => navigate("/purchases")}
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
          Back to Purchases
        </button>
      </div>

      <div className="bg-white border rounded p-4">

        {loading ? (
          <p className="text-sm text-gray-500">
            Loading...
          </p>
        ) : purchases.length === 0 ? (
          <p className="text-sm text-gray-400">
            No purchases found
          </p>
        ) : (

          <table className="w-full text-sm">

            <thead>
              <tr className="text-left border-b">
                <th className="p-2">ID</th>
                <th className="p-2">Amount</th>
                <th className="px-4 py-3">
                  Supplier
                </th>
                <th className="p-2">Date</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>

            <tbody>

  {purchases.map((p, index) => (

    <tr
      key={p.id}
      className="border-b"
    >

      <td className="p-2">
        #{index + 1}
      </td>

      <td className="p-2 font-semibold">
        ₹{p.total}
      </td>

      <td className="px-4 py-3">

        {p.supplier_name ? (
          <span className="inline-flex items-center gap-2 font-medium">
            🏭 {p.supplier_name}
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 text-gray-500">
            Unknown Supplier
          </span>
        )}

      </td>

      <td className="p-2 text-gray-500">
        {new Date(
          p.created_at
        ).toLocaleString()}
      </td>

      <td className="p-2">

        <div className="flex gap-3">

          <button
            onClick={() =>
              openPurchaseDetails(p)
            }
            className="text-blue-600 hover:underline"
          >
            View
          </button>

          <button
            onClick={() => navigate(`/purchases/edit/${p.id}`)}
            className="text-green-600 hover:underline"
          >
            Edit
          </button>

          <button
            onClick={() =>
              setDeleteId(p.id)
            }
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

      </div>

            <PurchaseItemsModal
        open={modalOpen}
        purchase={selectedPurchase}
        items={selectedPurchaseItems}
        onClose={() => {
          setModalOpen(false);
          setSelectedPurchase(null);
          setSelectedPurchaseItems([]);
        }}
      />

      <ConfirmDialog
  open={deleteId !== null}
  title="Delete Purchase"
  message="Are you sure you want to delete this purchase? This action cannot be undone."
  confirmText="Yes, Delete"
  cancelText="Cancel"
  type="danger"
  onCancel={() => setDeleteId(null)}
  onConfirm={async () => {
    if (!deleteId) return;

    const id = deleteId;

    setDeleteId(null);

    try {
      await deletePurchase(id);

      await loadPurchases();

      setDeleteSuccessOpen(true);

    } catch (err: any) {
      alert(err.message);
    }
  }}
/>

<ConfirmDialog
  open={deleteSuccessOpen}
  title="Purchase Deleted"
  message="Purchase successfully delete ho gayi hai."
  confirmText="OK"
  cancelText={undefined}
  type="info"
  onCancel={() => setDeleteSuccessOpen(false)}
  onConfirm={() => setDeleteSuccessOpen(false)}
/>

    </div>
  );
}

export default PurchaseHistoryPage;