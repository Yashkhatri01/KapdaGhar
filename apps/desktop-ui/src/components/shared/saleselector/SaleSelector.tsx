import { useEffect, useMemo, useState } from "react";

import { getSales } from "../../../features/sales/api/salesApi";

type Sale = {
  id: number;

  customer_name?: string | null;

  grand_total: number;

  created_at: string;
};

type Props = {
  onSelect: (sale: Sale | null) => void;
};

function SaleSelector({ onSelect }: Props) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadSales() {
      setLoading(true);

      try {
        const data = await getSales();
        setSales(Array.isArray(data) ? data : []);
      } finally {
        setLoading(false);
      }
    }

    loadSales();
  }, []);

  const filteredSales = useMemo(() => {
  const q = query.trim().toLowerCase();

  if (!q) return [];

  return sales.filter((sale) => {
    const customer =
      sale.customer_name ?? "walk-in customer";

    const date = new Date(
      sale.created_at
    ).toLocaleDateString();

    const dateTime = new Date(
      sale.created_at
    ).toLocaleString();

    return (
      sale.id.toString().includes(q) ||
      customer.toLowerCase().includes(q) ||
      date.toLowerCase().includes(q) ||
      dateTime.toLowerCase().includes(q)
    );
  });
}, [query, sales]);

  return (
    <div className="space-y-2">

      <input
        className="w-full border rounded p-2"
        placeholder="🔍 Search Sale ID / Customer..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {loading && (
        <div className="text-sm text-gray-500">
          Loading sales...
        </div>
      )}

      {query && filteredSales.length > 0 && (
        <div className="border rounded bg-white max-h-60 overflow-auto">

          {filteredSales.map((sale) => (
            <div
  key={sale.id}
  onClick={() => {
    onSelect(sale);
    setQuery("");
  }}
  className="cursor-pointer hover:bg-gray-100 p-2 border-b last:border-b-0"
>
  <div className="flex justify-between">

    <span className="font-medium">
      Sale #{sale.id}
    </span>

    <span className="text-green-600 font-medium">
      ₹{sale.grand_total}
    </span>

  </div>

  <div className="text-xs text-gray-600">
    {sale.customer_name ??
      "🚶 Walk-in Customer"}
  </div>

  <div className="text-xs text-gray-400">
    {new Date(
      sale.created_at
    ).toLocaleString()}
  </div>

</div>
          ))}

        </div>
      )}

      {query &&
        !loading &&
        filteredSales.length === 0 && (
          <div className="text-sm text-gray-500">
            No sales found.
          </div>
        )}

    </div>
  );
}

export default SaleSelector;