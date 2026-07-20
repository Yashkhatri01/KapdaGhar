import { useMemo, useState } from "react";
import type { InventoryItem } from "./useInventorySelector";

type Props = {
  items: InventoryItem[];
  loading: boolean;
  onSelect: (item: InventoryItem) => void;
  onAddNewItem?: (query: string) => void;
};

function InventorySelector({
  items,
  loading,
  onSelect,
  onAddNewItem,
}: Props) {
  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => {
    const q = query.toLowerCase().trim();

    if (!q) return [];

    return items.filter((item) => {
      return (
        item.item_name?.toLowerCase().includes(q) ||
        item.brand?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q) ||
        item.size?.toLowerCase().includes(q) ||
        item.color?.toLowerCase().includes(q)
      );
    });
  }, [items, query]);

  return (
    <div className="w-full space-y-3">

      {/* Search */}

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="🔍 Search Item..."
        className="
          w-full
          rounded-xl
          border
          border-gray-200
          bg-white

          px-4
          py-3

          text-sm

          outline-none

          transition-all
          duration-200

          focus:border-blue-400
          focus:ring-4
          focus:ring-blue-100
        "
      />

      {/* Loading */}

      {loading && (
        <div
          className="
            rounded-xl
            border
            border-blue-100
            bg-blue-50

            px-4
            py-3

            text-sm
            text-blue-700
          "
        >
          Loading items...
        </div>
      )}

      {/* Results */}

      {query && filteredItems.length > 0 && (

        <div
          className="
            max-h-80
            overflow-y-auto

            rounded-2xl
            border
            border-gray-200

            bg-white

            shadow-sm
          "
        >

          {filteredItems.map((item) => (

            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item)}
              className="
                w-full

                border-b
                border-gray-100
                last:border-b-0

                px-4
                py-4

                text-left

                transition-all
                duration-200

                hover:bg-blue-50
                hover:border-blue-100
              "
            >

              <div className="flex items-start justify-between gap-4">

                <div className="min-w-0 flex-1">

                  <div className="font-semibold text-gray-900 truncate">
                    {item.item_name}
                    {item.brand && ` (${item.brand})`}
                  </div>

                  <div className="mt-1 text-xs text-gray-500">
                    {item.category || "-"} • {item.size || "-"} • {item.color || "-"}
                  </div>

                </div>

                <div className="text-right shrink-0">

                  <div className="text-lg font-bold text-blue-700">
                    ₹{item.selling_price}
                  </div>

                  <div
                    className={`
                      mt-1
                      text-xs
                      font-medium
                      ${
                        item.stock > 0
                          ? "text-green-600"
                          : "text-red-500"
                      }
                    `}
                  >
                    Stock : {item.stock}
                  </div>

                </div>

              </div>

            </button>

          ))}

        </div>

      )}

      {/* Empty */}

      {query && !loading && filteredItems.length === 0 && (

        <div
          className="
            rounded-2xl

            border-2
            border-dashed
            border-gray-200

            bg-gray-50

            overflow-hidden
          "
        >

          <div className="px-5 py-6 text-center">

            <div className="text-3xl mb-2">
              📦
            </div>

            <div className="font-semibold text-gray-800">
              No matching item found
            </div>

            <div className="mt-1 text-sm text-gray-500">
              "{query}" inventory me available nahi hai.
            </div>

          </div>

          {onAddNewItem && (

            <button
              type="button"
              onClick={() => onAddNewItem(query)}
              className="
                w-full

                border-t
                border-gray-200

                bg-white

                px-4
                py-3

                text-sm
                font-semibold
                text-blue-700

                transition-all
                duration-200

                hover:bg-blue-50
              "
            >
              ➕ "{query}" ko Inventory me Add karein
            </button>

          )}

        </div>

      )}

    </div>
  );
}

export default InventorySelector;