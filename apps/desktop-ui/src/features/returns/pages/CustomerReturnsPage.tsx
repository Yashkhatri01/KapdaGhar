import { useEffect, useState } from "react";
import ExchangeCart from "../components/ExchangeCart";
import PageHeader from "../../../components/shared/pageheader/PageHeader";
import SaleSelector from "../../../components/shared/saleselector/SaleSelector";
import CustomerReturnItemsTable from "../components/CustomerReturnItemsTable";
import {
  getSale,
  getSaleItems,
} from "../../sales/api/salesApi";
import Button from "../../../components/ui/button/Button";
import ConfirmDialog from "../../../components/ui/confirmdialog/ConfirmDialog";
import { useInventorySelector } from "../../../components/shared/inventoryselector/useInventorySelector";
import { createCustomerReturn } from "../api/returnsApi";
import { useCart } from "../../sales/hooks/useCart";
import { useNavigate } from "react-router-dom";
import { History, ArrowRight } from "lucide-react";


function CustomerReturnsPage() {
  const [selectedSale, setSelectedSale] =
    useState<any>(null);

  const [saleItems, setSaleItems] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);

  const exchangeCart = useCart();

  const [returnItems, setReturnItems] =
  useState<any[]>([]);

  const totalReturnQty = returnItems.reduce(
  (sum, item) => sum + item.quantity,
  0
);

  const navigate = useNavigate();

const [showConfirm, setShowConfirm] =
  useState(false);

const [saving, setSaving] =
  useState(false);

const inventorySelector =
  useInventorySelector();

const refundAmount = returnItems.reduce((sum, item) => {

  const saleItem = saleItems.find(
    (i) => i.sale_item_id === item.sale_item_id
  );

  if (!saleItem) return sum;

  return (
    sum +
    saleItem.selling_price * item.quantity
  );

}, 0);

const difference =
  exchangeCart.totals.subtotal -
  refundAmount;

  const [returnType, setReturnType] = useState<
    "REFUND" | "EXCHANGE"
  >("REFUND");

  

  async function handleSaleSelect(sale: any) {

  if (!sale) {
    setSelectedSale(null);
    setSaleItems([]);
    return;
  }

  setLoading(true);

  try {

    const fullSale = await getSale(sale.id);

    const items = await getSaleItems(sale.id);

    setSelectedSale(fullSale.sale);

    setSaleItems(items);


  } finally {

    setLoading(false);

  }

}

useEffect(() => {
  console.log("SELECTED SALE STATE =>", selectedSale);
}, [selectedSale]);

  async function handleSaveReturn() {

  if (!selectedSale) return;

  if (returnItems.length === 0) {
    alert("Select at least one item.");
    return;
  }

  setShowConfirm(true);

}

async function confirmSaveReturn() {



  try {

    setSaving(true);

  

    await createCustomerReturn({

  sale_id: selectedSale.id,

  items: returnItems,

  return_type: returnType,

  exchange_items:
    returnType === "EXCHANGE"
      ? exchangeCart.cart.map((item) => {

          const sellingPrice =
            item.custom_selling_price ??
            item.selling_price;

          return {

            inventory_id:
              item.inventory_id,

            quantity:
              item.quantity,

            selling_price:
              sellingPrice,

            total:
              sellingPrice *
              item.quantity,

          };

        })
      : [],

});

    alert("Customer Return Saved Successfully.");

setShowConfirm(false);

setSelectedSale(null);

setSaleItems([]);

setReturnItems([]);

setReturnType("REFUND");

  } finally {

    setSaving(false);

  }

}



  return (
    <div className="space-y-6">

      <PageHeader
        title="Customer Returns"
        subtitle="Customer ki returned items process karein"
      />

      <div className="flex justify-end">

  <Button
    onClick={() =>
      navigate("/returns/customer/history")
    }
    className="bg-blue-600 hover:bg-blue-700 text-white"
  >

    <History size={16} />

    Returns History

    <ArrowRight size={16} />

  </Button>

</div>

<div className="rounded-lg border border-amber-200 bg-amber-50 p-4">

  <p className="text-sm font-medium text-amber-900">
    💡 Tip
  </p>

  <p className="mt-1 text-sm text-amber-700">

    Is page par sirf naye customer returns process hote hain.

    Pehle se save ki hui returns dekhne ke liye
    <span className="font-medium">
      {" "}
      Returns History
    </span>
    {" "}button use karein.

  </p>

</div>


      <div className="bg-white border rounded-lg p-5">

        <h2 className="font-semibold mb-4">
          Select Sale
        </h2>

        <SaleSelector
          onSelect={handleSaleSelect}
        />

        <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">

          <p className="text-sm text-blue-900 font-medium">
            Pehle jis sale ka return lena hai usse select karein.
          </p>

          <p className="text-sm text-blue-700 mt-1">
            Sirf wahi items return ho sakti hain jo us sale me bechi gayi thi.
            Agar customer exchange chahta hai to pehle return items select karein,
            uske baad naye items choose karein.
          </p>

</div>

      </div>

      {selectedSale && (

      <CustomerReturnItemsTable
        items={saleItems}
        onChange={setReturnItems}
        
      />

      )}

      {loading && (
        <div className="text-sm text-gray-500">
          Loading sale details...
        </div>
      )}

      {selectedSale && (

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
        Refund Amount
      </p>

      <p className="text-xl font-semibold text-green-700">
        ₹{refundAmount}
      </p>

      <div>

  <p className="text-sm text-gray-500">
    Difference
  </p>

  <p
    className={`text-xl font-semibold ${
      difference > 0
        ? "text-red-600"
        : difference < 0
        ? "text-green-600"
        : ""
    }`}
  >

    {difference > 0
      ? `Customer Pays ₹${difference}`
      : difference < 0
      ? `Refund ₹${Math.abs(
          difference
        )}`
      : "Even Exchange"}

  </p>

</div>

    </div>

  </div>

  <div className="space-y-3">

    <p className="font-medium">
      Return Type
    </p>

    <label className="flex items-center gap-2">

      <input
        type="radio"
        checked={returnType === "REFUND"}
        onChange={() =>
          setReturnType("REFUND")
        }
      />

      Refund

    </label>

    <label className="flex items-center gap-2">

      <input
        type="radio"
        checked={returnType === "EXCHANGE"}
        onChange={() =>
          setReturnType("EXCHANGE")
        }
      />

      Exchange

    </label>

    {returnType === "EXCHANGE" && (

  <ExchangeCart
  cartHook={exchangeCart}
  items={inventorySelector.items}
  loading={inventorySelector.loading}
/>

)}

    
  </div>

  <div className="flex justify-end pt-4 border-t">
  <Button
    onClick={handleSaveReturn}
    disabled={
  returnItems.length === 0 ||
  (
    returnType === "EXCHANGE" &&
    exchangeCart.cart.length === 0
  )
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
  title="Save Customer Return?"
  message="Ye return permanently save ho jayega. Continue?"
  confirmText="Save"
  cancelText="Cancel"
  loading={saving}
  onConfirm={confirmSaveReturn}
  onCancel={() => setShowConfirm(false)}
/>

    </div>
  );


}



export default CustomerReturnsPage;