import { useEffect, useMemo, useState } from "react";

import {
  getPurchases,
} from "../../../features/purchases/api/purchaseApi";

type Purchase = {
  id: number;

  supplier_name?: string | null;

  total: number;

  created_at: string;
};

type Props = {
  onSelect: (
    purchase: Purchase | null
  ) => void;
};

function PurchaseSelector({
  onSelect,
}: Props) {
  const [purchases, setPurchases] =
    useState<Purchase[]>([]);

  const [query, setQuery] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    async function loadPurchases() {

      setLoading(true);

      try {

        const data =
          await getPurchases();

        setPurchases(
          Array.isArray(data)
            ? data
            : []
        );

      } finally {

        setLoading(false);

      }
    }

    loadPurchases();

  }, []);

  const filteredPurchases =
    useMemo(() => {

      const q =
        query.trim().toLowerCase();

      if (!q) return [];

      return purchases.filter(
        (purchase) => {

          const supplier =
            purchase.supplier_name ??
            "walk-in supplier";

          const date =
            new Date(
              purchase.created_at
            ).toLocaleDateString();

          const dateTime =
            new Date(
              purchase.created_at
            ).toLocaleString();

          return (
            purchase.id
              .toString()
              .includes(q) ||

            supplier
              .toLowerCase()
              .includes(q) ||

            date
              .toLowerCase()
              .includes(q) ||

            dateTime
              .toLowerCase()
              .includes(q)
          );
        }
      );
    }, [query, purchases]);

  return (
    <div className="space-y-2">

      <input
        className="w-full border rounded p-2"
        placeholder="🔍 Search Purchase ID / Supplier..."
        value={query}
        onChange={(e) =>
          setQuery(e.target.value)
        }
      />

      {loading && (
        <div className="text-sm text-gray-500">
          Loading purchases...
        </div>
      )}

      {query &&
        filteredPurchases.length >
          0 && (

          <div className="border rounded bg-white max-h-60 overflow-auto">

            {filteredPurchases.map(
              (purchase) => (

                <div
                  key={purchase.id}
                  onClick={() => {
                    onSelect(
                      purchase
                    );

                    setQuery("");
                  }}
                  className="cursor-pointer hover:bg-gray-100 p-2 border-b last:border-b-0"
                >

                  <div className="flex justify-between">

                    <span className="font-medium">
                      Purchase #
                      {purchase.id}
                    </span>

                    <span className="text-blue-600 font-medium">
                      ₹
                      {purchase.total}
                    </span>

                  </div>

                  <div className="text-xs text-gray-600">

                    {purchase.supplier_name ??
                      "No Supplier"}

                  </div>

                  <div className="text-xs text-gray-400">

                    {new Date(
                      purchase.created_at
                    ).toLocaleString()}

                  </div>

                </div>
              )
            )}

          </div>
        )}

      {query &&
        !loading &&
        filteredPurchases.length ===
          0 && (

          <div className="text-sm text-gray-500">
            No purchases found.
          </div>

        )}

    </div>
  );
}

export default PurchaseSelector;