import { useEffect, useState } from "react";
import { getCustomers } from "../../../features/customers/api/customerApi";
import type { Customer } from "../../../features/customers/types/customer";

type Props = {
  onSelect: (customer: Customer | null) => void;
};

export default function CustomerSelector({ onSelect }: Props) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      const data = await getCustomers();
      setCustomers(Array.isArray(data) ? data : []);
    }

    load();
  }, []);

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-2">

      {/* SEARCH INPUT */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="🔍 Customer search (optional)"
        className="w-full border p-2 rounded"
      />

      {/* CLEAR OPTION */}
      <button
        onClick={() => onSelect(null)}
        className="text-sm text-gray-500 underline"
      >
        ❌ No Customer (Walk-in)
      </button>

      {/* LIST */}
      <div className="max-h-40 overflow-auto border rounded">
        {filtered.map((c) => (
          <div
            key={c.id}
            onClick={() => onSelect(c)}
            className="p-2 hover:bg-gray-100 cursor-pointer"
          >
            <div className="font-medium">{c.name}</div>
            {c.phone && (
              <div className="text-xs text-gray-500">
                {c.phone}
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}