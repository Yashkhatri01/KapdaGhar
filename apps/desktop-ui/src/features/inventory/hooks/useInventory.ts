import { useEffect, useState } from "react";
import type { Inventory } from "../types/inventory";

import {
  getInventory,
  createInventory,
  updateInventory,
  updateStock,
  deleteInventory,
} from "../api/inventoryApi";

export function useInventory() {
  const [items, setItems] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [selectedItem, setSelectedItem] =
    useState<Inventory | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // LOAD
  const fetchInventory = async () => {
    setLoading(true);
    const data = await getInventory(search);
    setItems(data);
    setLoading(false);
  };

  // RELOAD when search changes
  useEffect(() => {
    fetchInventory();
  }, [search]);

  // CREATE
  const addItem = async (data: Partial<Inventory>) => {
    await createInventory(data);
    await fetchInventory();
  };

  // UPDATE FULL ITEM
  const updateItem = async (
    id: number,
    data: Partial<Inventory>
  ) => {
    await updateInventory(id, data);
    await fetchInventory();
  };

  // UPDATE STOCK ONLY
  const updateItemStock = async (
    id: number,
    stock: number
  ) => {
    await updateStock({ id, stock });
    await fetchInventory();
  };

  // DELETE
  const deleteItem = async (id: number) => {
    await deleteInventory(id);
    await fetchInventory();
  };

  return {
    items,
    loading,

    search,
    setSearch,

    selectedItem,
    setSelectedItem,

    isModalOpen,
    setIsModalOpen,

    fetchInventory,

    addItem,
    updateItem,
    updateItemStock,
    deleteItem,
  };
}