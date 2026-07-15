import api from "../../../config/api";
import type { Inventory } from "../types/inventory";

export async function getInventory(search?: string) {
  const res = await api.get("/inventory", {
    params: { search },
  });

  // SAFE GUARD
  return res.data?.data ?? [];
}

export async function createInventory(data: Partial<Inventory>) {
  const res = await api.post("/inventory", data);
  return res.data.data;
}

export async function updateInventory(id: number, data: Partial<Inventory>) {
  const res = await api.put(`/inventory/${id}`, data);
  return res.data.data;
}

export async function updateStock(payload: {
  id: number;
  stock: number;
}) {
  const res = await api.put("/inventory/stock", payload);
  return res.data.data;
}

export async function deleteInventory(id: number) {
  const res = await api.delete(`/inventory/${id}`);
  return res.data.data;
}