export interface Supplier {
  id: number;
  name: string;
  phone: string | null;
  address: string | null;
  created_at: string;
}

export interface SupplierPayload {
  name: string;
  phone?: string;
  address?: string;
}