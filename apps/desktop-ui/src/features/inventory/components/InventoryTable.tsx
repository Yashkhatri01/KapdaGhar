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
    <div className="overflow-x-auto bg-white rounded-lg border">
      <table className="w-full text-sm">

        <thead className="bg-gray-50 text-left text-gray-600">
          <tr>
            <th className="p-3">Item</th>
            <th className="p-3">Category</th>
            <th className="p-3">Brand</th>
            <th className="p-3">Stock</th>
            <th className="p-3">Purchase</th>
            <th className="p-3">Selling</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => {
            const lowStock = item.stock <= (item.min_stock ?? 0);

            return (
              <tr
  key={item.id}
  className="
    border-t
    transition-all duration-150
    hover:bg-blue-50/30
    hover:shadow-sm
    cursor-pointer
  "
>

                {/* ITEM */}
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    {lowStock && (
                      <AlertTriangle
                        size={14}
                        className="text-amber-500"
                      />
                    )}
                    <span className="font-medium">
                      {item.item_name}
                    </span>
                  </div>
                </td>

                <td className="p-3">{item.category || "-"}</td>
                <td className="p-3">{item.brand || "-"}</td>

                <td className="p-3">
                  <span
                    className={
                      lowStock
                        ? "text-red-600 font-semibold"
                        : "text-gray-700"
                    }
                  >
                    {item.stock}
                  </span>
                </td>

                <td className="p-3">
                  ₹{item.purchase_price}
                </td>

                <td className="p-3">
                  ₹{item.selling_price}
                </td>

                {/* ACTIONS */}
                <td className="p-3">
                  <div className="flex gap-3">

                    {/* EDIT */}
                    <button
                      onClick={() => onEditStock(item)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Edit
                    </button>

                    {/* DELETE */}
                    {onDelete && (
                      <button
                        onClick={() => onDelete?.(item.id)}
                        className="text-red-600 hover:text-red-800 font-medium"
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