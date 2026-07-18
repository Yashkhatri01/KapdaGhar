import type { Inventory } from "../types/inventory";
import { AlertTriangle } from "lucide-react";


type Props = {
  items: Inventory[];
  loading: boolean;

  onEditStock: (item: Inventory) => void;
  onDelete?: (id: number) => void;
};

function InventoryTable({
  items,
  loading,
  onEditStock,
  onDelete,
}: Props) {
  if (loading) {
    return (
      <div className="p-6 text-sm text-gray-500">
        Loading inventory...
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="p-6 text-sm text-gray-400">
        No inventory items found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">



      <table className="w-full table-auto text-sm">

        <thead className="bg-gray-50 text-gray-600">

          <tr>

            <th className="px-5 py-4 text-left font-semibold">
              Item
            </th>

            <th className="px-5 py-4 text-left font-semibold">
              Category
            </th>

            <th className="px-5 py-4 text-left font-semibold">
              Brand
            </th>

            <th className="px-5 py-4 text-left font-semibold">
              Stock
            </th>

            <th className="px-5 py-4 text-left font-semibold">
              Purchase
            </th>

            <th className="px-5 py-4 text-left font-semibold">
              Selling
            </th>

            <th className="px-5 py-4 text-left font-semibold">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {items.map((item) => {

            const lowStock =
              item.stock <= (item.min_stock ?? 0);

            return (

              <tr
                key={item.id}
                className="
                  border-t
                  transition-all
                  duration-200
                  hover:bg-indigo-50/40
                "
              >

                {/* ITEM */}

                <td className="px-5 py-4">

                  <div className="flex items-center gap-2">

                    {lowStock && (

                      <AlertTriangle
                        size={15}
                        className="text-amber-500 shrink-0"
                      />

                    )}

                    <span className="font-medium text-gray-900">
                      {item.item_name}
                    </span>

                  </div>

                </td>

                {/* CATEGORY */}

                <td className="px-5 py-4 text-gray-600">
                  {item.category || "-"}
                </td>

                {/* BRAND */}

                <td className="px-5 py-4 text-gray-600">
                  {item.brand || "-"}
                </td>

                {/* STOCK */}

                <td className="px-5 py-4">

                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                      lowStock
                        ? "bg-red-100 text-red-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {item.stock}
                  </span>

                </td>

                {/* PURCHASE */}

                <td className="px-5 py-4 font-medium text-gray-700">
                  ₹{item.purchase_price}
                </td>

                {/* SELLING */}

                <td className="px-5 py-4 font-semibold text-gray-900">
                  ₹{item.selling_price}
                </td>

                {/* ACTIONS */}

<td className="px-5 py-4">

  <div className="flex items-center gap-2">

    <button
      onClick={() => onEditStock(item)}
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
      Edit
    </button>

    {onDelete && (

      <button
        onClick={() => onDelete(item.id)}
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

    )}

  </div>

</td>

              </tr>

            );

          })}

        </tbody>

      </table>

    </div>
  );
}

export default InventoryTable;