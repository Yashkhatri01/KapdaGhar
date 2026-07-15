import { useItemSelector } from "./useItemSelector";
import type { InventoryItem } from "./useItemSelector";

type Props = {
  onSelect: (item: InventoryItem) => void;
};

function ItemSelector({ onSelect }: Props) {
  const { query, setQuery, loading, filteredItems } =
    useItemSelector();

  return (
    <div className="w-full space-y-2">

      {/* SEARCH BOX */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="🔍 Search Item (shirt, levi's, blue...)"
        className="w-full border p-2 rounded"
      />

      {/* LOADING */}
      {loading && (
        <div className="text-sm text-gray-500">
          Loading items...
        </div>
      )}

      {/* RESULTS */}
      {query && filteredItems.length > 0 && (
        <div className="border rounded bg-white max-h-60 overflow-auto">

          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelect(item)}
              className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between"
            >
              {/* LEFT INFO */}
              <div>
                <div className="font-medium">
                  {item.item_name} {item.brand && `(${item.brand})`}
                </div>

                <div className="text-xs text-gray-500">
                  {item.category || "-"} | {item.size || "-"} | {item.color || "-"}
                </div>
              </div>

              {/* RIGHT INFO */}
              <div className="text-right">
                <div className="text-sm font-semibold">
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

      {/* NO RESULTS */}
      {query && !loading && filteredItems.length === 0 && (
        <div className="text-sm text-gray-400">
          No items found
        </div>
      )}

    </div>
  );
}

export default ItemSelector;