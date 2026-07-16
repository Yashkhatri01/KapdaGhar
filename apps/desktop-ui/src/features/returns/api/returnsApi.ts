import api from "../../../config/api";

/* -----------------------------
   Sales
------------------------------ */

export async function getSales() {
  const res = await api.get("/sales");

  return res.data.data;
}

export async function getSale(id: number) {
  const res = await api.get(`/sales/${id}`);

  return res.data.data;
}

export async function getSaleItems(id: number) {
  const res = await api.get(`/sales/${id}/items`);

  return res.data.data;
}

/* -----------------------------
   Customer Returns
------------------------------ */

export type CustomerReturnItemPayload = {
  sale_item_id: number;
  quantity: number;
};

export type CustomerReturn = {

  id: number;

  sale_id: number;

  customer_name: string | null;

  total: number;

  status:
    | "REFUNDED"
    | "EXCHANGED";

  created_at: string;

};

export type ExchangeItem = {
  inventory_id: number;
  quantity: number;
  selling_price: number;
  total: number;
};

export type CustomerReturnPayload = {
  sale_id: number;

  items: {
    sale_item_id: number;
    inventory_id: number;
    quantity: number;
  }[];

  return_type: "REFUND" | "EXCHANGE";

  exchange_items?: ExchangeItem[];

  notes?: string;
};

export async function createCustomerReturn(
  payload: CustomerReturnPayload
) {
  const res = await api.post(
    "/customer-returns",
    payload
  );

  return res.data.data;
}

export async function getCustomerReturns() {
  const res = await api.get("/customer-returns");
  return res.data.data;
}

export async function getCustomerReturn(id: number) {
  const res = await api.get(
    `/customer-returns/${id}`
  );

  return res.data.data;
}

/* -----------------------------
   Supplier Returns
------------------------------ */

export type SupplierReturnPayload = {
  purchase_id: number;

  items: {
    purchase_item_id: number;
    inventory_id: number;
    quantity: number;
  }[];
};

export async function createSupplierReturn(
  payload: SupplierReturnPayload
) {
  const res = await api.post(
    "/supplier-returns",
    payload
  );

  return res.data.data;
}

export async function getSupplierReturns() {
  const res = await api.get(
    "/supplier-returns"
  );

  return res.data.data;
}

export async function getSupplierReturn(
  id: number
) {
  const res = await api.get(
    `/supplier-returns/${id}`
  );

  return res.data.data;
}