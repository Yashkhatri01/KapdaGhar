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
import Button from "../../../components/ui/button/Button";

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
  <Button
leftIcon={<History size={18}/>}

rightIcon={<ArrowRight size={16}/>}

onClick={()=>navigate("/sales/history")}
>
Sales History
</Button>


</div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

  {/* LEFT SIDE - POS WORKSPACE */}
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

  {/* HEADER */}
  <div className="p-6">
    <h2 className="text-lg font-semibold">
      ➕ Sale Entry (Product Search)
    </h2>

    <p className="text-sm text-gray-500 mt-1">
      Item search karke sale me add karein
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

  {/* SEARCH AREA (EXPANDED FEEL) */}
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
    <ItemSelector onSelect={addItem} />
  </div>

  {/* QUICK SUMMARY (BALANCE UX) */}
  <div className="grid grid-cols-2 gap-4 mt-5">

    <div
  className="
    rounded-xl
    border
    bg-white
    p-4
  "
>
      <div className="text-gray-500 text-xs">Items</div>
      <div className="mt-1 text-xl font-bold text-gray-900">{totals.totalQty}</div>
    </div>

    <div
      className="
        rounded-xl
        border
        bg-white
        p-4
      "
    >
      <div className="text-gray-500 text-xs">Subtotal</div>
      <div className="mt-1 text-xl font-bold text-gray-900">₹{totals.subtotal}</div>


      </div>
    </div>

  </div>

</div>

  {/* RIGHT SIDE */}
  <div className="flex flex-col gap-4">

    {/* 👤 CUSTOMER SECTION (TOP) */}
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
    p-6
  "
>

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

          <div
  className="
    mt-4
    rounded-xl
    border
    border-green-200
    bg-gradient-to-r
    from-green-50
    to-emerald-50
    p-4
    animate-[fadeIn_.25s_ease]
  "
>
            ✔ Customer Selected
          </div>

          <div className="text-lg font-bold text-green-900 mt-1">
            {customerName}
          </div>

        </div>
      )}

    </div>

    {/* 🧾 CART SECTION (BOTTOM) */}
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

      <h2 className="font-semibold mb-3">
        Current Sale
      </h2>

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
      mb-5

      flex
      h-16
      w-16

      items-center
      justify-center

      rounded-2xl

      bg-white

      text-3xl

      shadow-sm
    "
  >
    🛒
  </div>

  <h3 className="font-semibold text-gray-800">
    Sales Cart Empty
  </h3>


      <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
    👆 Upar se maal select karke sale shuru karein.
  </p>
    
  </div>
) : (
  <div className="space-y-3 max-h-[460px] overflow-y-auto pr-2">

    {cart.map((item) => (

      <div
        key={item.inventory_id}
        className="
          rounded-2xl
          border
          border-gray-200

          bg-white

          p-4

          transition-all
          duration-200

          hover:border-blue-200
          hover:shadow-md
        "
      >

        {/* TOP */}

        <div className="flex justify-between gap-4">

          <div className="min-w-0 flex-1">

            <h3 className="font-semibold text-gray-900 truncate">
              {item.item_name}
              {item.brand && ` (${item.brand})`}
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              {item.size || "-"} • {item.color || "-"}
            </p>

          </div>

          <div className="text-right shrink-0">

            <div className="text-xs text-gray-500">
              Item Total
            </div>

            <div className="text-xl font-bold text-blue-700">
              ₹
              {item.quantity *
                (item.custom_selling_price ??
                  item.selling_price)}
            </div>

          </div>

        </div>

        {/* PRICE */}

        <div className="mt-4">

          <div className="mt-4 flex items-center gap-3">
  <label className="text-xs font-medium text-gray-500 whitespace-nowrap">
    Custom Price (Optional)
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
      w-40
      rounded-xl
      border
      px-3
      py-2
      text-sm
      outline-none
      focus:border-blue-500
      focus:ring-4
      focus:ring-blue-100
    "
  />
</div>

          {item.custom_selling_price != null && (
            <p className="mt-1 text-xs text-blue-600">
              Effective Price ₹
              {item.custom_selling_price}
            </p>
          )}

        </div>

        {/* BOTTOM */}

        <div className="mt-4 flex items-center justify-between">

          <div className="flex items-center gap-2">

            <button
              onClick={() =>
                decreaseQty(item.inventory_id)
              }
              className="
                h-9
                w-9

                rounded-xl
                border

                transition

                hover:bg-gray-100
              "
            >
              −
            </button>

            <div
              className="
                w-10
                text-center
                font-semibold
              "
            >
              {item.quantity}
            </div>

            <button
              onClick={() =>
                increaseQty(item.inventory_id)
              }
              className="
                h-9
                w-9

                rounded-xl
                border

                transition

                hover:bg-gray-100
              "
            >
              +
            </button>

          </div>

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

  </div>
)}

      

      {saleError && (
        <div className="mt-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
          {saleError}
        </div>
      )}

      {/* FOOTER ACTIONS */}
      {cart.length > 0 && (
        <div
className="
mt-6

border-t

pt-5

flex
items-center
justify-between
"
>

          <div className="space-y-1">
  <div className="text-sm text-gray-500">
    Total Items
  </div>

  <div className="text-xl font-bold">
    {totals.totalQty}
  </div>

  <div className="text-sm text-gray-500 mt-2">
    Subtotal
  </div>

  <div className="text-2xl font-bold text-blue-700">
    ₹{totals.subtotal}
  </div>
</div>

          <div className="flex items-center gap-3">

            {/* PAYMENT METHOD */}
            <select
              value={paymentMethod}
              onChange={(e) =>
                setPaymentMethod(e.target.value as "CASH" | "UPI")
              }
              className="
rounded-xl
border
px-4
py-2
transition

hover:bg-gray-100
"
            >
              <option value="CASH">💵 CASH</option>
              <option value="UPI">📱 UPI</option>
            </select>

            <Button
  variant="secondary"
  onClick={clearCart}
>
  Clear
</Button>

            <Button
               loading={checkoutLoading}
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
              className="
rounded-xl

bg-blue-600

px-4
py-2

font-medium
text-white

transition

hover:bg-blue-700

disabled:opacity-50
"
            >
              {editingSaleId ? "Update Sale" : "Save Sale"}
</Button>

          </div>

        </div>
      )}

      </div>

    </div>

  </div>

</div>

        {/* RECENT SALES SECTION START */}

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

    {/* HEADER */}

    <div className="flex items-start justify-between">

      <div>

        <h2 className="text-lg font-semibold text-gray-900">
          Recent Sales
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Last few sales recorded today
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
        {sales.length} Sales
      </div>

    </div>

    {/* DIVIDER */}

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

    {/* CONTENT */}

    {salesLoading ? (

      <div className="py-8 text-center text-gray-500">
        Loading recent sales...
      </div>

    ) : sales.length === 0 ? (

      <div
        className="
          py-10

          text-center

          rounded-xl

          border-2
          border-dashed
          border-gray-200

          bg-gray-50
        "
      >
        <div className="text-lg">
          📦
        </div>

        <div className="mt-2 font-medium text-gray-700">
          No Sales Yet
        </div>

        <div className="mt-1 text-sm text-gray-500">
          Today's sales will appear here.
        </div>

      </div>

    ) : (

      <div className="mt-5 space-y-3">

        {sales.slice(0, 5).map(
          (sale: any, index: number) => (

            <div
              key={sale.id}
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

              <div>

                <div className="font-medium text-gray-900">
                  Sale #{index + 1}
                </div>

                <div className="mt-1 text-xs text-gray-500">
                  Payment • {sale.payment_method}
                </div>

              </div>

              <div className="text-right">

                <div
                  className="
                    text-lg
                    font-bold
                    text-blue-700
                  "
                >
                  ₹{sale.grand_total}
                </div>

              </div>

            </div>

          )
        )}

      </div>

    )}

    {/* FOOTER */}

    {sales.length > 0 && (

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
        💡 Complete sales history, items and payment details are available in
        <span className="font-semibold">
          {" "}
          Sales History
        </span>.
      </div>

    )}

  </div>

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