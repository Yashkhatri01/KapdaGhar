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
  purchase_price: number;
  selling_price: number;
};

export function useInventorySelector() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadItems() {
    setLoading(true);

    try {
      const res = await api.get("/inventory");
      setItems(res.data.data);
    } finally {
      setLoading(false);
    }
  }

  function selectItemById(id: number) {
  return items.find((item) => item.id === id) ?? null;
}

  useEffect(() => {
    loadItems();
  }, []);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();

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
  items,
  query,
  setQuery,
  loading,
  filteredItems,
  refreshItems: loadItems,
  selectItemById,
};
}