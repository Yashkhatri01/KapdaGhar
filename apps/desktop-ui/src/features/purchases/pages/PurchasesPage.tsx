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
import Button from "../../../components/ui/button/Button";

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

  <Button
  onClick={() => navigate("/purchases/history")}
>
  📜 Purchase History
</Button>

</div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* LEFT */}
<div
  className="
    bg-white
    rounded-2xl
    border
    border-gray-200
    shadow-sm
    hover:shadow-lg
    transition-all
    duration-300
    overflow-hidden

    h-fit
    lg:sticky
    lg:top-6
  "
>
  <div className="p-6">

    {/* HEADER */}
    <div>
      <h2 className="text-lg font-semibold">
        📦 Purchase Entry
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        Supplier select karke inventory purchase karein.
      </p>
    </div>

    {/* DIVIDER */}
    <div
      className="
        mt-4
        h-px
        bg-gradient-to-r
        from-transparent
        via-blue-200/70
        to-transparent
      "
    />

    {/* SUPPLIER */}
    <div
      className="
        mt-6
        rounded-xl
        border
        border-gray-200
        bg-gray-50
        p-5
      "
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">
          Supplier
        </h3>

        {supplier && (
          <span
            className="
              rounded-full
              bg-green-100
              px-3
              py-1
              text-xs
              font-medium
              text-green-700
            "
          >
            Selected
          </span>
        )}
      </div>

      <SupplierSelector
        onSelect={setSupplier}
      />
    </div>

    {/* INVENTORY */}
    <div
      className="
        mt-5
        rounded-xl
        border
        border-gray-200
        bg-gray-50
        p-5
      "
    >
      <h3 className="mb-3 text-sm font-semibold text-gray-700">
        Inventory Item
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

    {/* QUICK SUMMARY */}
    <div className="grid grid-cols-2 gap-4 mt-5">

      <div
        className="
          rounded-xl
          border
          bg-white
          p-4
        "
      >
        <div className="text-xs text-gray-500">
          Items
        </div>

        <div className="mt-1 text-xl font-bold text-gray-900">
          {totals.totalQty}
        </div>
      </div>

      <div
        className="
          rounded-xl
          border
          bg-white
          p-4
        "
      >
        <div className="text-xs text-gray-500">
          Purchase Total
        </div>

        <div className="mt-1 text-xl font-bold text-gray-900">
          ₹{totals.subtotal}
        </div>
      </div>

    </div>

  </div>
</div>

        {/* RIGHT */}

<div
  className="
    bg-white
    rounded-2xl

    border
    border-gray-200

    shadow-sm
    hover:shadow-xl

    transition-all
    duration-300

    lg:sticky
    lg:top-6

    overflow-hidden
  "
>

  <div className="p-6">

          <h2 className="text-lg font-semibold">
  📦 Current Purchase
</h2>

<p className="mt-1 text-sm text-gray-500">
  Selected inventory items aur pricing yahan manage karein.
</p>

<div
  className="
    mt-4
    h-px
    bg-gradient-to-r
    from-transparent
    via-blue-200/70
    to-transparent
  "
/>

          {cart.length === 0 ? (
            <div
  className="
    mt-6
    flex
    flex-col
    items-center
    justify-center

    rounded-3xl

    bg-gradient-to-br
    from-slate-50
    to-blue-50/70

    py-12
    px-6

    text-center

    transition-all
    duration-300

    hover:-translate-y-0.5
    hover:shadow-md
  "
>

  <div
    className="
      mb-4

      flex
      h-14
      w-14

      items-center
      justify-center

      rounded-2xl

      bg-white

      text-2xl

      shadow-sm
    "
  >
    📦
  </div>

  <h3 className="font-semibold text-gray-800">
    Purchase Cart Empty
  </h3>

  <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
    Left side se inventory item select karke purchase banana shuru karein.
  </p>

</div>
          ) : (
            <div className="space-y-3">

              {cart.map((item) => (

                <div
  key={item.inventory_id}
  className="
    group

    rounded-2xl

    bg-white

    p-5

    transition-all
    duration-300

    hover:-translate-y-0.5
    hover:shadow-lg

    space-y-5
  "
>

                  <div className="flex justify-between items-start gap-5">

  <div className="min-w-0 flex-1">

    <h3 className="font-semibold text-gray-900 truncate">
      {item.item_name}
      {item.brand && ` (${item.brand})`}
    </h3>

    <p className="mt-1 text-xs text-gray-500">
      {item.size || "-"} • {item.color || "-"}
    </p>

  </div>

  <div className="text-right">

    <div className="text-xs text-gray-500">
      Item Total
    </div>

    <div className="mt-1 text-xl font-bold text-blue-700">
      ₹{item.quantity * item.unit_cost}
    </div>

  </div>

</div>

                  <div className="grid grid-cols-2 gap-4">

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
      className="
mt-1
w-full

rounded-xl

border

px-3
py-2

text-sm

transition

focus:border-blue-400
focus:ring-4
focus:ring-blue-100
outline-none
"
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
      className="
mt-1
w-full

rounded-xl

border

px-3
py-2

text-sm

transition

focus:border-blue-400
focus:ring-4
focus:ring-blue-100
outline-none
"
    />
  </div>

  

</div>



                  <div className="flex items-center justify-between">

                    <button
  onClick={() =>
    decreaseQty(item.inventory_id)
  }
  className="
h-9
w-9

flex
items-center
justify-center

rounded-xl

border
border-gray-200

bg-white

text-lg
font-semibold
text-gray-700

shadow-sm

transition-all
duration-200

hover:border-blue-300
hover:bg-blue-50
hover:text-blue-700
hover:shadow

active:scale-95
"
>
  −
</button>

                    <span
  className="
    w-10
    text-center
    font-semibold
  "
>
                      {item.quantity}
                    </span>

                    <button
  onClick={() =>
    increaseQty(item.inventory_id)
  }
  className="
h-9
w-9

flex
items-center
justify-center

rounded-xl

border
border-gray-200

bg-white

text-lg
font-semibold
text-gray-700

shadow-sm

transition-all
duration-200

hover:border-blue-300
hover:bg-blue-50
hover:text-blue-700
hover:shadow

active:scale-95
"
>
  +
</button>

                    <Button
variant="secondary"
onClick={() =>
removeItem(item.inventory_id)
}
className="
!border-red-200
!text-red-600

hover:!bg-red-50
"
>
Remove
</Button>

                  </div>
                  

                </div>
                

              ))}

              <div className="flex justify-between items-center mt-5">

               <div className="space-y-1">

  <div className="text-sm text-gray-500">
    Total Items
  </div>

  <div className="text-xl font-bold">
    {totals.totalQty}
  </div>

  <div className="pt-2 text-sm text-gray-500">
    Purchase Total
  </div>

  <div className="text-2xl font-bold text-blue-700">
    ₹{totals.subtotal}
  </div>

</div>

                <div className="flex items-center gap-3">

  <Button
  variant="secondary"
  onClick={clearCart}
>
  Clear
</Button>

  <Button
loading={loading}
disabled={cart.length===0}
onClick={async()=>{

  if(cart.length===0){

    toast.warning({
      title:"Purchase cart empty hai.",
      description:"Please add at least one item before continuing.",
    });

    return;
  }

  try{

    if(editPurchaseId){

      await handleSubmit();

      toast.success({
        title:"Purchase Updated",
        description:"Purchase updated successfully.",
      });

    }else{

      await checkout(supplier?.id ?? null);

      toast.success({
        title:"Purchase Saved",
        description:"Purchase recorded successfully.",
      });

    }

    clearCart();

    navigate("/purchases/history");

  }catch(err){

    console.error(err);

    toast.error({
      title:"Purchase save nahi ho payi.",
      description:"Unable to save purchase.",
    });

  }

}}
className="
rounded-xl

bg-blue-600

font-medium

transition

hover:bg-blue-700
"
>
  {loading
    ? "Saving..."
    : editPurchaseId
      ? "Update Purchase"
      : "Save Purchase"}
</Button>

</div>



              </div>

              

            </div>
          )}

        </div>

        </div>

      </div>

            {/* RECENT PURCHASES SECTION START */}
<div
  className="
    bg-white
    rounded-2xl
    border
    border-gray-200
    shadow-sm

    hover:shadow-lg
    transition-all
    duration-300

    overflow-hidden
  "
>

<div className="p-6">

  <div className="flex items-start justify-between">

  <div>

    <h2 className="text-lg font-semibold text-gray-900">
      Recent Purchases
    </h2>

    <p className="mt-1 text-sm text-gray-500">
      Last few purchases recorded
    </p>

  </div>

  <div
    className="
      rounded-full
      bg-blue-50
      px-3
      py-1

      text-xs
      font-medium
      text-blue-600
    "
  >
    {purchases.length} Purchases
  </div>

</div>

<div
  className="
    mt-5
    h-px
    bg-gradient-to-r
    from-transparent
    via-blue-200/70
    to-transparent
  "
/>

  {purchasesLoading ? (
    <div className="py-8 text-center text-gray-500">
  Loading recent purchases...
</div>
  ) : purchases.length === 0 ? (
    <div
  className="
    mt-6

    py-10

    rounded-2xl

    border-2
    border-dashed
    border-gray-200

    bg-gray-50

    text-center
  "
>

  <div className="text-2xl">
    📦
  </div>

  <div className="mt-3 font-medium text-gray-700">
    Abhi tak koi purchase nahi hui.
  </div>

  <div className="mt-1 text-sm text-gray-500">
    Purchase hone par yahan dikhegi.
  </div>

</div>
  ) : (
    <div className="mt-5 space-y-3">

      {purchases.map((purchase: any, index: number) => (

        <div
          key={purchase.id}
          className="
flex
items-center
justify-between

rounded-xl

border
border-gray-200

px-4
py-3

transition-all
duration-200

hover:border-blue-200
hover:bg-blue-50
hover:shadow-sm
"
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
    <div
  className="
    mt-6

    rounded-xl

    bg-blue-50

    px-4
    py-3

    text-sm
    text-blue-700
  "
>
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
    </div>
  );
}

export default PurchasesPage;