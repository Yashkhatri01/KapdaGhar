import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Search, Store, X } from "lucide-react";

import { getSuppliers } from "../../../features/suppliers/api/supplierApi";
import type { Supplier } from "../../../features/suppliers/types/supplier";

type Props = {
  onSelect: (supplier: Supplier | null) => void;
};

function SupplierSelector({ onSelect }: Props) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectedSupplier, setSelectedSupplier] =
    useState<Supplier | null>(null);

  useEffect(() => {
    async function loadSuppliers() {
      setLoading(true);

      try {
        const data = await getSuppliers();
        setSuppliers(data);
      } finally {
        setLoading(false);
      }
    }

    loadSuppliers();
  }, []);

  const filteredSuppliers = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return [];

    return suppliers.filter((supplier) => {
      return (
        supplier.name.toLowerCase().includes(q) ||
        supplier.phone?.toLowerCase().includes(q)
      );
    });
  }, [query, suppliers]);

  function handleSelect(supplier: Supplier) {
    setSelectedSupplier(supplier);
    onSelect(supplier);
    setQuery("");
  }

  function clearSupplier() {
    setSelectedSupplier(null);
    onSelect(null);
    setQuery("");
  }

  return (
    <div className="space-y-3">

      {/* Selected Supplier */}
      {selectedSupplier ? (
        <div
          className="
            animate-[fadeIn_.25s]
            rounded-xl
            border
            border-green-200
            bg-green-50
            p-4
          "
        >
          <div className="flex items-start justify-between">

            <div className="flex gap-3">

              <CheckCircle2
                className="text-green-600 mt-0.5"
                size={20}
              />

              <div>

                <div className="text-sm text-green-700 font-medium">
                  Supplier Selected
                </div>

                <div className="font-semibold text-lg text-green-900">
                  {selectedSupplier.name}
                </div>

                {selectedSupplier.phone && (
                  <div className="text-sm text-green-700 mt-1">
                    {selectedSupplier.phone}
                  </div>
                )}

              </div>

            </div>

            <button
  onClick={clearSupplier}
  className="
    flex
    h-9
    w-9

    items-center
    justify-center

    rounded-xl

    border
    border-gray-200

    bg-white

    text-red-500

    shadow-sm

    transition-all
    duration-200

    hover:bg-red-50
    hover:border-red-300
    hover:text-red-600

    active:scale-95
  "
  title="Clear Supplier"
>
  <X size={18} />
</button>

          </div>
        </div>
      ) : (
        <>
          {/* Search */}
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
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Supplier..."
              className="
                w-full
                rounded-xl
                border
                border-gray-300
                bg-white
                pl-10
                pr-4
                py-2.5
                text-sm
                transition
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-100
                outline-none
              "
            />

          </div>


          {loading && (
            <div className="text-sm text-gray-500">
              Loading suppliers...
            </div>
          )}

          {query && filteredSuppliers.length > 0 && (
            <div
              className="
                animate-[fadeIn_.18s]
                rounded-xl
                border
                bg-white
                max-h-60
                overflow-y-auto
                shadow-md
              "
            >
              {filteredSuppliers.map((supplier) => (
                <button
                  key={supplier.id}
                  type="button"
                  onClick={() => handleSelect(supplier)}
                  className="
                    w-full
                    flex
                    items-start
                    gap-3
                    text-left
                    px-4
                    py-3
                    hover:bg-blue-50
                    transition
                    border-b
                    last:border-b-0
                  "
                >
                  <Store
                    size={18}
                    className="text-blue-600 mt-1"
                  />

                  <div>

                    <div className="font-medium">
                      {supplier.name}
                    </div>

                    {supplier.phone && (
                      <div className="text-xs text-gray-500 mt-1">
                        {supplier.phone}
                      </div>
                    )}

                  </div>

                </button>
              ))}
            </div>
          )}

          {query &&
            !loading &&
            filteredSuppliers.length === 0 && (
              <div
                className="
                  text-sm
                  text-gray-500
                  text-center
                  py-5
                  border
                  rounded-xl
                  bg-gray-50
                "
              >
                No suppliers found.
              </div>
            )}
        </>
      )}
    </div>
  );
}

export default SupplierSelector;