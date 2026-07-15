import PageHeader from "../../../components/shared/pageheader/PageHeader";
import ItemSelector from "../../../components/shared/itemselector/ItemSelector";
import { useCart } from "../hooks/useCart";
import { useEffect, useState } from "react";
import {
  getSales,
  getSale,
} from "../api/salesApi";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import { History, ArrowRight } from "lucide-react";
import ConfirmDialog from "../../../components/ui/confirmdialog/ConfirmDialog";
import CustomerSelector from "../../../components/shared/customerselector/CustomerSelector";

function SalesPage() {
  const {
  cart,
  addItem,
  increaseQty,
  decreaseQty,
  removeItem,
  clearCart,
  totals,
  checkout,

  paymentMethod,
  setPaymentMethod,
  loadCart,
  updateCustomSellingPrice,

} = useCart();

  const navigate = useNavigate();
  const { id } = useParams();

  const editingSaleId = id
    ? Number(id)
    : undefined;
  const [sales, setSales] = useState<any[]>([]);
  const [salesLoading, setSalesLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [saleInfoOpen, setSaleInfoOpen] = useState(false);
  const [saleError, setSaleError] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [customerName, setCustomerName] = useState<string | null>(null);
  

  async function loadSales() {
  try {
    setSalesLoading(true);

    const data = await getSales();
    setSales(Array.isArray(data) ? data : []);

  } finally {
    setSalesLoading(false);
  }
}

function checkLossWarning() {
  const warnings = [];

  for (const item of cart) {
    const selling = item.selling_price || 0;
    const purchase = item.purchase_price || 0;

    if (purchase > 0 && selling < purchase) {
      warnings.push({
        name: item.item_name,
        purchase,
        selling,
        loss: purchase - selling,
      });
    }
  }

  return warnings;
}

async function loadSaleForEdit() {
  if (!editingSaleId) return;
  const data = await getSale(editingSaleId);

console.log("EDIT RESPONSE", data);

loadCart(
  data.items,
  data.sale.payment_method
);

  try {
    const data = await getSale(editingSaleId);

    loadCart(
      data.items,
      data.sale.payment_method
    );

  } catch (err) {
    console.error(err);
  }
}

useEffect(() => {
  loadSales();

  if (editingSaleId) {
    loadSaleForEdit();
  }
}, [editingSaleId]);


  return (
    <div className="space-y-6">

      {/* HEADER */}
      <PageHeader
  title={
    editingSaleId
      ? "Edit Sale"
      : "Bikri (Sales)"
  }
  subtitle={
    editingSaleId
      ? "Purani sale update karein"
      : "Dukaan ki daily sale entry"
  }
/>

      <div className="flex justify-end">
  <button
  onClick={() => navigate("/sales/history")}
  className="
    flex items-center gap-2
    px-4 py-2
    bg-blue-600
    hover:bg-blue-700
    text-white
    rounded-lg
    font-medium
    transition-all
    shadow-sm
    hover:shadow-md
  "
>
  <History size={18} />
  Sales History
  <ArrowRight size={16} />
</button>


</div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

  {/* LEFT SIDE - POS WORKSPACE */}
<div className="bg-white p-4 rounded border h-fit lg:sticky lg:top-6 h-fit flex flex-col gap-4">

  {/* HEADER */}
  <div>
    <h2 className="text-lg font-semibold">
      ➕ Sale Entry (Product Search)
    </h2>

    <p className="text-sm text-gray-500 mt-1">
      Item search karke sale me add karein
    </p>
  </div>

  {/* SEARCH AREA (EXPANDED FEEL) */}
  <div className="p-4 border rounded-lg bg-gray-50">
    <ItemSelector onSelect={addItem} />
  </div>

  {/* QUICK SUMMARY (BALANCE UX) */}
  <div className="grid grid-cols-2 gap-3 text-sm">

    <div className="p-3 border rounded bg-white">
      <div className="text-gray-500 text-xs">Items</div>
      <div className="font-semibold">{totals.totalQty}</div>
    </div>

    <div className="p-3 border rounded bg-white">
      <div className="text-gray-500 text-xs">Subtotal</div>
      <div className="font-semibold">₹{totals.subtotal}</div>
    </div>

  </div>

</div>

  {/* RIGHT SIDE */}
  <div className="flex flex-col gap-4">

    {/* 👤 CUSTOMER SECTION (TOP) */}
    <div className="bg-white p-4 rounded border">

      <h2 className="text-lg font-semibold">
        👤 Customer (Optional)
      </h2>

      <p className="text-sm text-gray-500 mb-3">
        Agar customer known hai toh select karo, warna walk-in bhi allowed hai.
      </p>

      <CustomerSelector
        onSelect={(customer) => {
          setCustomerId(customer ? customer.id : null);
          setCustomerName(customer ? customer.name : null);
        }}
      />
      {customerName && (
        <div className="mt-3 p-3 rounded-lg bg-green-50 border border-green-200">

          <div className="text-sm font-semibold text-green-700">
            ✔ Customer Selected
          </div>

          <div className="text-lg font-bold text-green-900 mt-1">
            {customerName}
          </div>

        </div>
      )}

    </div>

    {/* 🧾 CART SECTION (BOTTOM) */}
    <div className="bg-white p-4 rounded border h-fit lg:sticky lg:top-6">

      <h2 className="font-semibold mb-3">
        Current Sale
      </h2>

      {cart.length === 0 ? (
        <p className="text-sm text-gray-400">
          👆 Upar se maal select karke sale shuru karein.
        </p>
      ) : (
        <div className="space-y-3 max-h-[430px] overflow-y-auto pr-2">

          {cart.map((item) => (
            <div
              key={item.inventory_id}
              className="flex justify-between items-center border-b pb-2"
            >

              <div>
                <div className="font-medium">
                  {item.item_name}
                  {item.brand && ` (${item.brand})`}
                </div>

                <div className="text-xs text-gray-500">
                  {item.size} {item.color}
                </div>
              </div>

              <div className="mt-2">
  <label className="text-xs text-gray-500">
    Selling Price (Optional)
  </label>

  <input
    type="number"
    min={0}
    placeholder={`Default ₹${item.selling_price}`}
    value={item.custom_selling_price ?? ""}
    onChange={(e) =>
      updateCustomSellingPrice(
        item.inventory_id,
        e.target.value
      )
    }
    className="
      mt-1
      w-28
      px-2
      py-1
      border
      rounded
      text-sm
      focus:outline-none
      focus:ring-2
      focus:ring-blue-200
    "
  />

  {item.custom_selling_price != null && (
    <p className="text-[11px] text-gray-500 mt-1">
      Effective Price: ₹
      {item.custom_selling_price}
    </p>
  )}
</div>

              <div className="flex items-center gap-2">

                <button
                  onClick={() => decreaseQty(item.inventory_id)}
                  className="px-2 border rounded"
                >
                  -
                </button>

                <span>{item.quantity}</span>

                <button
                  onClick={() => increaseQty(item.inventory_id)}
                  className="px-2 border rounded"
                >
                  +
                </button>

                <button
                  onClick={() => removeItem(item.inventory_id)}
                  className="text-red-500 text-sm ml-2"
                >
                  remove
                </button>

              </div>

              <div className="font-semibold">
                ₹
{item.quantity *
  (item.custom_selling_price ??
    item.selling_price)}
              </div>

            </div>
          ))}

        </div>
      )}

      {saleError && (
        <div className="mt-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
          {saleError}
        </div>
      )}

      {/* FOOTER ACTIONS */}
      {cart.length > 0 && (
        <div className="mt-5 flex justify-between items-center">

          <div className="text-sm text-gray-600">
            Total Items: {totals.totalQty} <br />
            Subtotal: ₹{totals.subtotal}
          </div>

          <div className="flex items-center gap-3">

            {/* PAYMENT METHOD */}
            <select
              value={paymentMethod}
              onChange={(e) =>
                setPaymentMethod(e.target.value as "CASH" | "UPI")
              }
              className="px-3 py-2 border rounded-lg"
            >
              <option value="CASH">💵 CASH</option>
              <option value="UPI">📱 UPI</option>
            </select>

            <button
              onClick={clearCart}
              className="px-3 py-2 border rounded-lg"
            >
              Clear
            </button>

            <button
              disabled={checkoutLoading}
              onClick={async () => {
                if (cart.length === 0) {
                  setSaleError("Cart empty hai.");
                  return;
                }

                const warnings = checkLossWarning();

                if (warnings.length > 0) {
                  const confirm = window.confirm(
                    "⚠️ Loss Warning detected. Continue?"
                  );
                  if (!confirm) return;
                }

                try {
                  setCheckoutLoading(true);
                  setSaleError(null);

                  await checkout(
                    {
                      customer_id: customerId || null,
                      payment_method: paymentMethod,
                    },
                    editingSaleId
                  );

                  await loadSales();

                  if (editingSaleId) {
                    navigate("/sales/history");
                  } else {
                    setSaleInfoOpen(true);
                  }

                } finally {
                  setCheckoutLoading(false);
                }
              }}
              className="px-4 py-2 bg-black text-white rounded-lg"
            >
              {checkoutLoading
                ? editingSaleId
                  ? "Updating..."
                  : "Saving..."
                : editingSaleId
                ? "Update Sale"
                : "Save Sale"}
            </button>

          </div>

        </div>
      )}

    </div>

  </div>

</div>

        {/* RECENT SALES SECTION START */}
<div className="bg-white p-4 rounded border">

  <div className="flex items-center justify-between mb-3">
    <h2 className="font-semibold">Recent Sales</h2>

    <span className="text-xs text-gray-400">
      📊 Detailed history ke liye Sales History page check karein
    </span>
  </div>

  {salesLoading ? (
    <p>Loading...</p>
  ) : sales.length === 0 ? (
    <p className="text-sm text-gray-400">
      Abhi tak koi sales nahi hui
    </p>
  ) : (
    <div className="space-y-1">
      {sales.map((sale: any, index: number) => (
        <div
          key={sale.id}
          className="border-b py-2 flex justify-between hover:bg-gray-50 transition"
        >
          <span className="text-sm">
            Sale #{index + 1}
          </span>

          <span className="font-medium">
            ₹{sale.grand_total}
          </span>
        </div>
      ))}
    </div>
  )}

  {/* UX FOOTER HINT */}
  {sales.length > 0 && (
    <div className="mt-3 text-xs text-gray-500">
      💡 Tip: Har sale ka full breakdown, items aur payment details
      “Sales History” section me available hai.
    </div>
  )}

</div>
{/* RECENT SALES SECTION END */}

      <ConfirmDialog
  open={saleInfoOpen}
  title={
  editingSaleId
    ? "Sale Updated"
    : "Sale Saved Successfully"
}

message={
  editingSaleId
    ? "Sale successfully update ho gayi hai."
    : "Bikri successfully save ho gayi hai."
}
  confirmText="OK"
  cancelText="Close"
  type="info"
  onCancel={() => setSaleInfoOpen(false)}
  onConfirm={() => setSaleInfoOpen(false)}
/>

    </div>
  );
}

export default SalesPage;