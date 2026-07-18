import { useEffect, useState } from "react";
import {
  getPurchase,
  getPurchaseItems,
  updatePurchase,
} from "../api/purchaseApi";
import { getPurchases } from "../api/purchaseApi";
import type { Inventory } from "../../inventory/types/inventory";
import PageHeader from "../../../components/shared/pageheader/PageHeader";
import SupplierSelector from "../../../components/shared/supplierselector/SupplierSelector";
import InventorySelector from "../../../components/shared/inventoryselector/InventorySelector";
import InventoryModal from "../../inventory/components/InventoryModal";
import { usePurchaseCart } from "../hooks/usePurchaseCart";
import { createInventory } from "../../inventory/api/inventoryApi";
import type { Supplier } from "../../suppliers/types/supplier";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { getInventory } from "../../inventory/api/inventoryApi";
import { useToast } from "../../../contexts/ToastContext";


function PurchasesPage() {
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const { id: editPurchaseId } = useParams();
  const {
  cart,
  addItem,
  addNewInventoryItem,

  increaseQty,
  decreaseQty,
  removeItem,

  updateUnitCost,
  updateSellingPrice,
  loadCart,
  clearCart,

  totals,

  checkout,
  loading,
} = usePurchaseCart();

  const [inventoryModalOpen, setInventoryModalOpen] = useState(false);
  
  const [inventoryItems, setInventoryItems] = useState<Inventory[]>([]);
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [purchasesLoading, setPurchasesLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  async function loadInventory() {
  try {
    setInventoryLoading(true);

    const data = await getInventory();
    setInventoryItems(data);

  } finally {
    setInventoryLoading(false);
  }
}

async function loadPurchases() {
  try {
    setPurchasesLoading(true);

    const data = await getPurchases();

    setPurchases(Array.isArray(data) ? data : []);
  } finally {
    setPurchasesLoading(false);
  }
}

async function loadPurchaseForEdit(id: number) {
  const purchase = await getPurchase(id);
  const items = await getPurchaseItems(id);

  setSupplier(
    purchase?.supplier_id
      ? ({ id: purchase.supplier_id } as Supplier)
      : null
  );

  loadCart(
    items.map((item: any) => ({
      inventory_id: item.inventory_id,

      item_name: item.item_name,
      brand: item.brand,
      size: item.size,
      color: item.color,

      quantity: item.quantity,

      initialStock: 0,

      unit_cost: item.unit_cost,
      selling_price: item.selling_price,

      isNewItem: false,
    }))
  );
}

useEffect(() => {
  loadPurchases();
  loadInventory();
}, []);

useEffect(() => {
  if (editPurchaseId) {
    loadPurchaseForEdit(Number(editPurchaseId));
  }
}, [editPurchaseId]);

async function handleSubmit() {
  const payload = {
    supplier_id: supplier?.id || null,
    total: totals.subtotal,
    items: cart.map((item) => ({
      inventory_id: item.inventory_id,
      quantity: item.quantity,
      unit_cost: item.unit_cost,
      selling_price: item.selling_price,
      total: item.quantity * item.unit_cost,
      isNewItem: item.isNewItem || false,
      initialStock: item.quantity,
    })),
  };

  try {
    if (editPurchaseId) {
      await updatePurchase(Number(editPurchaseId), payload);
    } else {
      await checkout(supplier?.id || null);
    }

    clearCart();
    navigate("/purchases/history");

  } catch (err) {
    console.error(err);
    toast.error({
      title: "Save Failed",
      description: "Unable to save purchase.",
    });alert("Save failed");
  }
}

  return (
    <div className="space-y-6">

      <PageHeader
        title="Purchase Entry"
        subtitle="Supplier se maal kharid kar inventory me add karein"
      />

      <div className="flex justify-end">

  <button
    onClick={() => navigate("/purchases/history")}
    className="
      px-4 py-2
      bg-blue-700
      hover:bg-black
      text-white
      rounded-lg
      transition
    "
  >
    📜 Purchase History
  </button>

</div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* LEFT */}

        <div className="bg-white p-4 rounded border h-fit lg:sticky lg:top-6 flex flex-col gap-4">

          <div>
            <h2 className="text-lg font-semibold">
              ➕ Purchase Entry
            </h2>

            <p className="text-sm text-gray-500">
              Supplier select karke item add karein.
            </p>
          </div>

          {/* Supplier */}

          <div className="border rounded-lg p-4 bg-gray-50">

            <h3 className="font-medium mb-2">
              Supplier
            </h3>

            <SupplierSelector
              onSelect={setSupplier}
            />

            {supplier && (
              <div className="mt-3 rounded border bg-green-50 p-2">
                <div className="text-sm font-semibold text-green-700">
                  Selected Supplier
                </div>

                <div className="font-bold">
                  {supplier.name}
                </div>
              </div>
            )}

          </div>

          {/* Item */}

          <div className="border rounded-lg p-4 bg-gray-50">

            <h3 className="font-medium mb-2">
              Search Item
            </h3>

            <InventorySelector
              items={inventoryItems}
              loading={inventoryLoading}
              onSelect={addItem}
              onAddNewItem={() =>
                setInventoryModalOpen(true)
              }
            />

          </div>

          <div className="grid grid-cols-2 gap-3">

            <div className="border rounded p-3">

              <div className="text-xs text-gray-500">
                Items
              </div>

              <div className="font-bold">
                {totals.totalQty}
              </div>

            </div>

            <div className="border rounded p-3">

              <div className="text-xs text-gray-500">
                Total
              </div>

              <div className="font-bold">
                ₹{totals.subtotal}
              </div>

            </div>

          </div>

        </div>

        {/* RIGHT */}

        <div className="bg-white border rounded p-4">

          <h2 className="font-semibold mb-4">
            Purchase Items
          </h2>

          {cart.length === 0 ? (
            <p className="text-gray-400 text-sm">
              👈 Left side se item select karein.
            </p>
          ) : (
            <div className="space-y-3">

              {cart.map((item) => (

                <div
                  key={item.inventory_id}
                  className="border-b pb-3 flex justify-between items-center"
                >

                  <div>

                    <div className="font-medium">
                      {item.item_name}
                    </div>

                    <div className="text-xs text-gray-500">
                      {item.brand} {item.size} {item.color}
                    </div>

                  </div>

                  <div className="flex gap-3">

  <div>
    <label className="text-xs text-gray-500 block">
      Purchase Price
    </label>

    <input
      type="number"
      min={0}
      value={item.unit_cost}
      onChange={(e) =>
        updateUnitCost(
          item.inventory_id,
          e.target.value
        )
      }
      className="border rounded px-2 py-1 w-24"
    />
  </div>

  <div>
    <label className="text-xs text-gray-500 block">
      Selling Price
    </label>

    <input
      type="number"
      min={0}
      value={item.selling_price}
      onChange={(e) =>
        updateSellingPrice(
          item.inventory_id,
          e.target.value
        )
      }
      className="border rounded px-2 py-1 w-24"
    />
  </div>

</div>

                  <div className="flex items-center gap-2">

                    <button
                      onClick={() =>
                        decreaseQty(item.inventory_id)
                      }
                      className="px-2 border rounded"
                    >
                      -
                    </button>

                    <span>
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        increaseQty(item.inventory_id)
                      }
                      className="px-2 border rounded"
                    >
                      +
                    </button>

                    <button
                      onClick={() =>
                        removeItem(item.inventory_id)
                      }
                      className="text-red-500"
                    >
                      Remove
                    </button>

                  </div>

                  <div className="font-semibold">
                    ₹{item.quantity * item.unit_cost}
                  </div>

                </div>

              ))}

              <div className="flex justify-between items-center mt-5">

                <div>

                  <div>
                    Total Items : {totals.totalQty}
                  </div>

                  <div>
                    Purchase Total : ₹{totals.subtotal}
                  </div>

                </div>

                <div className="flex gap-3">

  <button
    onClick={clearCart}
    className="border rounded px-4 py-2"
  >
    Clear
  </button>

  <button
  disabled={loading || cart.length === 0}
  onClick={async () => {
    if (cart.length === 0) {
          toast.warning({
      title: "Purchase cart empty hai.",
      description: "Please add at least one item before continuing.",
    });
      return;
    }

    try {
      if (editPurchaseId) {
        await handleSubmit(); // update mode
        toast.success({
          title: "Purchase Updated",
          description: "Purchase updated successfully.",
        });
      } else {
        await checkout(supplier?.id ?? null); // create mode
        toast.success({
          title: "Purchase Saved",
          description: "Purchase recorded successfully.",
        });
      }

      clearCart();
      navigate("/purchases/history");
    } catch (err) {
      console.error(err);
      toast.error({
        title: "Purchase save nahi ho payi.",
        description: "Unable to save purchase.",
      });
    }
  }}
  className="bg-black text-white rounded px-4 py-2 disabled:opacity-50"
>
  {loading
    ? "Saving..."
    : editPurchaseId
      ? "Update Purchase"
      : "Save Purchase"}
</button>

</div>

              </div>

              

            </div>
          )}

        </div>

      </div>

            {/* RECENT PURCHASES SECTION START */}
<div className="bg-white p-4 rounded border">

  <div className="flex items-center justify-between mb-3">
    <h2 className="font-semibold">
      Recent Purchases
    </h2>

    <span className="text-xs text-gray-400">
      📦 Detailed history ke liye Purchase History page check karein
    </span>
  </div>

  {purchasesLoading ? (
    <p>Loading...</p>
  ) : purchases.length === 0 ? (
    <p className="text-sm text-gray-400">
      Abhi tak koi purchase nahi hui.
    </p>
  ) : (
    <div className="space-y-1">

      {purchases.map((purchase: any, index: number) => (

        <div
          key={purchase.id}
          className="border-b py-2 flex justify-between hover:bg-gray-50 transition"
        >

          <span className="text-sm">
            Purchase #{index + 1}
          </span>

          <span className="font-medium">
            ₹{purchase.total}
          </span>

        </div>

      ))}

    </div>
  )}

  {purchases.length > 0 && (
    <div className="mt-3 text-xs text-gray-500">
      💡 Tip: Har purchase ka full breakdown, supplier aur items
      "Purchase History" section me available hoga.
    </div>
  )}

</div>
{/* RECENT PURCHASES SECTION END */}

      <InventoryModal
  open={inventoryModalOpen}
  item={null}
  onClose={() => setInventoryModalOpen(false)}
  onSave={async (data) => {
  try {

    const createdItem = await createInventory(data);

    addNewInventoryItem(createdItem);

    await loadInventory();

    setInventoryModalOpen(false);

          toast.success({
        title: "Item Added",
        description: "Item successfully inventory me add ho gaya.",
      });

  } catch (err) {
    console.error(err);
    toast.error({
      title: "Save Failed",
      description: "Unable to save inventory item.",
    });
  } finally {
    
  }
}}
/>

    </div>
  );
}

export default PurchasesPage;