export interface Inventory {
  id: number; // ✅ MUST be required
  item_name: string;
  category?: string;
  brand?: string;
  size?: string;
  color?: string;
  purchase_price: number;
  selling_price: number;
  stock: number;
  min_stock?: number;
  barcode?: string;
  status: "ACTIVE" | "OUT_OF_STOCK";
}