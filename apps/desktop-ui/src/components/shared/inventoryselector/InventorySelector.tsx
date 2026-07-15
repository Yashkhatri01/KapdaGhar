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
    <div className="w-full space-y-2">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="🔍 Search Item..."
        className="w-full border rounded p-2"
      />

      {loading && (
        <div className="text-sm text-gray-500">
          Loading items...
        </div>
      )}

      {query && filteredItems.length > 0 && (
        <div className="border rounded bg-white max-h-60 overflow-auto">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelect(item)}
              className="cursor-pointer hover:bg-gray-100 p-2 flex justify-between"
            >
              <div>
                <div className="font-medium">
                  {item.item_name}
                  {item.brand && ` (${item.brand})`}
                </div>

                <div className="text-xs text-gray-500">
                  {item.category || "-"} | {item.size || "-"} |{" "}
                  {item.color || "-"}
                </div>
              </div>

              <div className="text-right">
                <div className="font-semibold">
                  ₹{item.selling_price}
                </div>

                <div className="text-xs text-gray-500">
                  Stock: {item.stock}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {query && !loading && filteredItems.length === 0 && (
        <div className="border rounded bg-white">
          <div className="p-3 text-sm text-gray-500">
            No matching item found.
          </div>

          {onAddNewItem && (
            <button
              type="button"
              onClick={() => onAddNewItem(query)}
              className="w-full border-t px-3 py-2 text-left hover:bg-gray-50 text-blue-600 font-medium"
            >
              ➕ Add "{query}" to Inventory
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default InventorySelector;