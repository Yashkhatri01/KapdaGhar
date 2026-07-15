
type Props = {
  open: boolean;
  purchasePrice: number;
  sellingPrice: number;
  onEdit: () => void;
  onSaveAnyway: () => void;
};

function LowSellingPriceModal({
  open,
  purchasePrice,
  sellingPrice,
  onEdit,
  onSaveAnyway,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-lg shadow-xl w-[420px] max-w-[95%]">

        {/* HEADER */}
<div className="flex justify-between items-start border-b px-6 py-5">

  <div>

    <div className="flex items-center gap-2">

      <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-xl">
        ⚠️
      </div>

      <div>

        <h2 className="text-lg font-semibold text-gray-900">
          Low Selling Price
        </h2>

        <p className="text-sm text-gray-500">
          Profit negative ho sakta hai.
        </p>

      </div>

    </div>

  </div>

  <button
    onClick={onSaveAnyway}
    className="text-gray-400 hover:text-black text-2xl transition"
  >
    ×
  </button>

</div>

        {/* BODY */}
<div className="px-6 py-5 space-y-5">

  <div className="rounded-lg border bg-yellow-50">

    <div className="flex justify-between px-4 py-3 border-b">

      <span className="text-gray-600">
        Purchase Price
      </span>

      <span className="font-semibold">
        ₹{purchasePrice}
      </span>

    </div>

    <div className="flex justify-between px-4 py-3">

      <span className="text-gray-600">
        Selling Price
      </span>

      <span className="font-semibold text-red-600">
        ₹{sellingPrice}
      </span>

    </div>

  </div>

  <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600 leading-6">

    Aap jo selling price enter kar rahe hain woh purchase price se kam hai.

    <br />
    <br />

    Agar ye clearance sale, damaged item ya special case hai to aap fir bhi item save kar sakte hain.

  </div>

</div>

        {/* FOOTER */}
<div className="border-t px-6 py-4 flex justify-end gap-3">

  <button
    type="button"
    onClick={onEdit}
    className="px-5 py-2 rounded-md border border-gray-300 bg-white hover:bg-gray-100 transition"
  >
    Edit
  </button>

  <button
    type="button"
    onClick={onSaveAnyway}
    className="px-5 py-2 rounded-md bg-amber-500 hover:bg-amber-600 text-white transition"
  >
    Save Anyway
  </button>

</div>

      </div>

    </div>
  );
}

export default LowSellingPriceModal;