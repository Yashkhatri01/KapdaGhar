import { useEffect, useMemo, useState } from "react";

import { getSuppliers } from "../../../features/suppliers/api/supplierApi";
import type { Supplier } from "../../../features/suppliers/types/supplier";

type Props = {
  onSelect: (supplier: Supplier) => void;
};

function SupplierSelector({ onSelect }: Props) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="space-y-2">

      <input
        className="w-full border rounded p-2"
        placeholder="🔍 Search Supplier..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {loading && (
        <div className="text-sm text-gray-500">
          Loading suppliers...
        </div>
      )}

      {query && filteredSuppliers.length > 0 && (
        <div className="border rounded bg-white max-h-60 overflow-auto">

          {filteredSuppliers.map((supplier) => (
            <div
              key={supplier.id}
              onClick={() => onSelect(supplier)}
              className="cursor-pointer hover:bg-gray-100 p-2"
            >
              <div className="font-medium">
                {supplier.name}
              </div>

              <div className="text-xs text-gray-500">
                {supplier.phone}
              </div>
            </div>
          ))}

        </div>
      )}

      {query && !loading && filteredSuppliers.length === 0 && (
        <div className="text-sm text-gray-500">
          No suppliers found.
        </div>
      )}

    </div>
  );
}

export default SupplierSelector;