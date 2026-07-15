import api from "../../../config/api";
import type { Customer, CustomerPayload } from "../types/customer";

export async function getCustomers(): Promise<Customer[]> {
  const response = await api.get("/customers");

  const data = response.data?.data;

  return Array.isArray(data) ? data : [];
}

export async function createCustomer(
  payload: CustomerPayload
): Promise<Customer> {
  const response = await api.post("/customers", payload);
  return response.data.data;
}

export async function updateCustomer(
  id: number,
  payload: CustomerPayload
): Promise<Customer> {
  const response = await api.put(`/customers/${id}`, payload);
  return response.data.data;
}

export async function deleteCustomer(id: number): Promise<void> {
  await api.delete(`/customers/${id}`);
}