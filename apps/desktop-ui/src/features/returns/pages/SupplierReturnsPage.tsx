import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, History } from "lucide-react";
import { useToast } from "../../../contexts/ToastContext";
import PageHeader from "../../../components/shared/pageheader/PageHeader";
import PurchaseSelector from "../../../components/shared/purchaseselector/PurchaseSelector";
import SupplierReturnItemsTable from "../components/SupplierReturnItemsTable";

import {
  getPurchase,
  getPurchaseItems,
} from "../../purchases/api/purchaseApi";

import {
  createSupplierReturn,
} from "../api/returnsApi";

import Button from "../../../components/ui/button/Button";
import ConfirmDialog from "../../../components/ui/confirmdialog/ConfirmDialog";

function SupplierReturnsPage() {
  const navigate = useNavigate();

  const [selectedPurchase, setSelectedPurchase] =
    useState<any>(null);

  const [purchaseItems, setPurchaseItems] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [returnItems, setReturnItems] =
    useState<any[]>([]);

  const toast = useToast();

  const [showConfirm, setShowConfirm] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const totalReturnQty = returnItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const returnValue = returnItems.reduce(
    (sum, item) => {
      const purchaseItem = purchaseItems.find(
        (i: any) =>
          i.purchase_item_id ===
          item.purchase_item_id
      );

      if (!purchaseItem) return sum;

      return (
        sum +
        purchaseItem.unit_cost *
          item.quantity
      );
    },
    0
  );

  async function handlePurchaseSelect(
    purchase: any
  ) {
    if (!purchase) {
      setSelectedPurchase(null);
      setPurchaseItems([]);
      return;
    }

    setLoading(true);

    try {
      const fullPurchase =
        await getPurchase(purchase.id);

      const items =
        await getPurchaseItems(
          purchase.id
        );


      setSelectedPurchase(
        fullPurchase.purchase
      );

      setPurchaseItems(items);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveReturn() {
    if (!selectedPurchase) return;

    if (returnItems.length === 0) {
      toast.warning({
  title: "No Items Selected",
  description: "Please select at least one item.",
});
      return;
    }

    setShowConfirm(true);
  }

  async function confirmSaveReturn() {
    try {
      setSaving(true);

      await createSupplierReturn({
        purchase_id:
          selectedPurchase.id,

        items: returnItems,
      });

      toast.success({
  title: "Return Saved",
  description: "Supplier return recorded successfully.",
});

      setShowConfirm(false);

      setSelectedPurchase(null);

      setPurchaseItems([]);

      setReturnItems([]);
    } finally {
      setSaving(false);
    }
  }



    return (
    <div className="space-y-6">

      <PageHeader
        title="Supplier Returns"
        subtitle="Supplier ko return hone wala maal process karein"
      />

      <div className="flex justify-end">
        <Button
          onClick={() =>
            navigate("/returns/supplier/history")
          }
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <History size={16} />
          Supplier Returns History
          <ArrowRight size={16} />
        </Button>
      </div>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <p className="text-sm font-medium text-blue-900">
          💡 Tip
        </p>

        <p className="mt-1 text-sm text-blue-700">
          Is page par sirf naye supplier returns
          process hote hain. Pehle se save ki hui
          supplier returns dekhne ke liye
          <span className="font-medium">
            {" "}
            Supplier Returns History
          </span>{" "}
          button use karein.
        </p>
      </div>

      <div className="bg-white border rounded-lg p-5">

        <h2 className="font-semibold mb-4">
          Select Purchase
        </h2>

        <PurchaseSelector
          onSelect={handlePurchaseSelect}
        />

        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-medium text-amber-900">
            Supplier se jis purchase ka maal
            wapas bhejna hai us purchase ko
            select karein.
          </p>

          <p className="mt-1 text-sm text-amber-700">
            Sirf us purchase me aaye hue items
            hi return kiye ja sakte hain.
          </p>
        </div>

      </div>

      {loading && (
        <div className="text-sm text-gray-500">
          Loading purchase details...
        </div>
      )}

      {selectedPurchase && (

        <SupplierReturnItemsTable
          items={purchaseItems}
          onChange={setReturnItems}
        />

      )}

      {selectedPurchase && (

        <div className="bg-white border rounded-lg p-5 space-y-5">

          <h2 className="font-semibold">
            Return Summary
          </h2>

          <div className="grid grid-cols-2 gap-5">

            <div>

              <p className="text-sm text-gray-500">
                Selected Quantity
              </p>

              <p className="text-xl font-semibold">
                {totalReturnQty}
              </p>

            </div>

            <div>

              <p className="text-sm text-gray-500">
                Return Value
              </p>

              <p className="text-xl font-semibold text-red-600">
                ₹{returnValue}
              </p>

            </div>

          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">

            <p className="text-sm text-blue-700">
              Usually ye amount supplier ki next
              payment ya bill me adjust ho
              jaata hai.
            </p>

          </div>

          <div className="flex justify-end border-t pt-4">

            <Button
              onClick={handleSaveReturn}
              disabled={
                returnItems.length === 0
              }
            >
              Save Return
            </Button>

          </div>

        </div>

      )}

      <ConfirmDialog
        open={showConfirm}
        type="info"
        title="Save Supplier Return?"
        message="Ye supplier return permanently save ho jayega. Continue?"
        confirmText="Save"
        cancelText="Cancel"
        loading={saving}
        onConfirm={confirmSaveReturn}
        onCancel={() =>
          setShowConfirm(false)
        }
      />

    </div>
  );
}

export default SupplierReturnsPage;