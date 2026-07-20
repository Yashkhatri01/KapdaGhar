import {
  Package,
  Search,
  AlertCircle,
} from "lucide-react";

import { useItemSelector } from "./useItemSelector";
import type { InventoryItem } from "./useItemSelector";

type Props = {
  onSelect: (item: InventoryItem) => void;
};

function ItemSelector({ onSelect }: Props) {
  const {
    query,
    setQuery,
    loading,
    filteredItems,
  } = useItemSelector();

  function handleSelect(item: InventoryItem) {
    onSelect(item);

    // clear search after adding item
    setQuery("");
  }

  return (
    <div className="w-full space-y-3">

      {/* SEARCH */}

      <div className="relative">

        <Search
          size={18}
          className="
            absolute
            left-3
            top-1/2
            -translate-y-1/2
            text-gray-400
          "
        />

        <input
          value={query}
          onChange={(e) =>
            setQuery(e.target.value)
          }
          placeholder="Search Item, Brand, Color..."
          className="
            w-full
            rounded-xl
            border
            border-gray-300
            bg-white
            pl-10
            pr-4
            py-3

            transition-all
            duration-200

            focus:border-blue-500
            focus:ring-4
            focus:ring-blue-100
            outline-none
          "
        />

      </div>

      {/* LOADING */}

      {loading && (
        <div
          className="
            rounded-xl
            border
            bg-gray-50
            p-4
            text-sm
            text-gray-500
          "
        >
          Loading items...
        </div>
      )}

      {/* RESULTS */}

      {query &&
        filteredItems.length > 0 && (
          <div
            className="
              animate-[fadeIn_.18s]

              overflow-y-auto
              max-h-80

              rounded-xl
              border

              bg-white

              shadow-lg
            "
          >
            {filteredItems.map((item) => (

              <button
                key={item.id}
                type="button"
                onClick={() =>
                  handleSelect(item)
                }
                className="
                  w-full

                  flex
                  justify-between
                  items-center

                  gap-4

                  px-4
                  py-3

                  border-b
                  last:border-b-0

                  hover:bg-blue-50

                  transition-all
                  duration-200

                  text-left
                "
              >

                {/* LEFT */}

                <div className="flex gap-3">

                  <Package
                    size={18}
                    className="
                      text-blue-600
                      mt-1
                      shrink-0
                    "
                  />

                  <div>

                    <div className="font-semibold">
                      {item.item_name}

                      {item.brand &&
                        ` (${item.brand})`}
                    </div>

                    <div
                      className="
                        text-xs
                        text-gray-500
                        mt-1
                      "
                    >
                      {item.category || "-"} •{" "}
                      {item.size || "-"} •{" "}
                      {item.color || "-"}
                    </div>

                  </div>

                </div>

                {/* RIGHT */}

                <div className="text-right">

                  <div
                    className="
                      text-lg
                      font-bold
                      text-blue-700
                    "
                  >
                    ₹{item.selling_price}
                  </div>

                  <div
                    className={`
                      mt-1
                      inline-flex
                      rounded-full
                      px-2
                      py-1
                      text-xs
                      font-medium

                      ${
                        item.stock > 5
                          ? "bg-green-100 text-green-700"
                          : item.stock > 0
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }
                    `}
                  >
                    Stock {item.stock}
                  </div>

                </div>

              </button>

            ))}
          </div>
        )}

      {/* EMPTY */}

      {query &&
        !loading &&
        filteredItems.length === 0 && (
          <div
            className="
              animate-[fadeIn_.18s]

              rounded-xl
              border

              bg-gray-50

              py-8

              text-center
            "
          >
            <AlertCircle
              className="
                mx-auto
                mb-2
                text-gray-400
              "
              size={26}
            />

            <div className="font-medium">
              No items found
            </div>

            <div
              className="
                text-sm
                text-gray-500
                mt-1
              "
            >
              Try another keyword.
            </div>

          </div>
        )}

    </div>
  );
}

export default ItemSelector;