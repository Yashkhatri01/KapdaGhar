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
import { useToast } from "../../../contexts/ToastContext";
import Button from "../../../components/ui/button/Button";

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
  const toast = useToast();
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
        <Button
  onClick={() => navigate("/purchases")}
  className="flex items-center gap-2"
>
  <ArrowLeft size={18} />
  Back to Purchases
</Button>
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
          Supplier
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

      {purchases.map((p, index) => (

        <tr
          key={p.id}
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
              ₹{p.total}
            </span>

          </td>

          <td className="px-5 py-4">

            {p.supplier_name ? (

              <span className="inline-flex items-center gap-2 font-medium text-gray-800">

                🏭 {p.supplier_name}

              </span>

            ) : (

              <span className="inline-flex items-center gap-2 text-gray-500">

                Unknown Supplier

              </span>

            )}

          </td>

          <td className="px-5 py-4 text-gray-500 whitespace-nowrap">

            {new Date(
              p.created_at
            ).toLocaleString()}

          </td>

          <td className="px-5 py-4">

            <div className="flex justify-center gap-2">

              <button
                onClick={() =>
                  openPurchaseDetails(p)
                }
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
                  navigate(`/purchases/edit/${p.id}`)
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
                onClick={() =>
                  setDeleteId(p.id)
                }
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
      toast.error({
  title: "Operation Failed",
  description: err.message,
});
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