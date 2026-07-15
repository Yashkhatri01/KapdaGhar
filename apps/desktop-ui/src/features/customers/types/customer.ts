export interface Customer {
  id: number;
  name: string;
  phone?: string | null;
  created_at: string;
}

export interface CustomerPayload {
  name: string;
  phone: string;
}