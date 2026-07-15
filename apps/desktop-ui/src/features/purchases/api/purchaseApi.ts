import api from "../../../config/api";

export type PurchaseItemPayload = {
  inventory_id: number;

  quantity: number;

  unit_cost: number;
  selling_price: number;

  total: number;

  isNewItem: boolean;
  initialStock: number;
};

export type PurchasePayload = {
  supplier_id: number | null;
  total: number;
  items: PurchaseItemPayload[];
};

export async function createPurchase(
  payload: PurchasePayload
) {
  const res = await api.post("/purchases", payload);

  return res.data.data;
}

export async function getPurchases() {
  const res = await api.get("/purchases");
  return res.data.data;
}

export async function getPurchaseItems(id: number) {
  const res = await api.get(`/purchases/${id}/items`);
  return res.data.data;
}

export async function deletePurchase(id: number) {
  const res = await api.delete(`/purchases/${id}`);
  return res.data;
}

export async function getPurchase(id: number) {
  const res = await api.get(`/purchases/${id}`);
  return res.data.data;
}

export async function updatePurchase(
  id: number,
  payload: PurchasePayload
) {
  const res = await api.put(
    `/purchases/${id}`,
    payload
  );

  return res.data.data;
}