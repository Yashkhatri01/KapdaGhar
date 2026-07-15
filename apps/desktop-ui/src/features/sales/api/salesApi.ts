import api from "../../../config/api";

export async function createSale(payload: any) {
  const res = await api.post("/sales", payload);
  return res.data.data;
}

export async function getSales() {
  const res = await api.get("/sales");
  return res.data.data;
}

export async function getSale(id: number) {
  const res = await api.get(`/sales/${id}`);
  return res.data.data;
}

export async function updateSale(
  id: number,
  data: any
) {
  const res = await api.put(
    `/sales/${id}`,
    data
  );

  return res.data.data;
}

export async function getSaleItems(id: number) {
  const res = await api.get(`/sales/${id}/items`);
  return res.data.data;
}

export async function deleteSale(id: number) {
  const res = await api.delete(`/sales/${id}`);
  return res.data.data;
}