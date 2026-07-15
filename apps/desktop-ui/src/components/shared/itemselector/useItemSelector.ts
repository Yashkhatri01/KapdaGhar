import { useEffect, useMemo, useState } from "react";
import api from "../../../config/api";

export type InventoryItem = {
  id: number;
  item_name: string;
  category?: string;
  brand?: string;
  size?: string;
  color?: string;
  stock: number;
  selling_price: number;
};

export function useItemSelector() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // load inventory once
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await api.get("/inventory");
        setItems(res.data.data);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // frontend search (fast version)
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
  }, [query, items]);

  return {
    query,
    setQuery,
    loading,
    filteredItems,
  };
}