import api from "../../../config/api";
import type { Supplier, SupplierPayload } from "../types/supplier";

export async function getSuppliers(): Promise<Supplier[]> {
  const response = await api.get("/suppliers");
  return response.data.data;
}

export async function createSupplier(
  payload: SupplierPayload
): Promise<Supplier> {
  const response = await api.post("/suppliers", payload);
  return response.data.data;
}

export async function updateSupplier(
  id: number,
  payload: SupplierPayload
): Promise<Supplier> {
  const response = await api.put(`/suppliers/${id}`, payload);
  return response.data.data;
}

export async function deleteSupplier(id: number): Promise<void> {
  await api.delete(`/suppliers/${id}`);
}