import type { Supplier } from "../../suppliers/types/supplier";
import type { InventoryItem } from "../../../components/shared/inventoryselector/useInventorySelector";

export type PurchaseItem = {
  inventory_id: number;

  item_name: string;

  quantity: number;

  unit_cost: number;

  total: number;
};

export type PurchaseDraft = {
  supplier: Supplier | null;

  items: PurchaseItem[];
};

export type SelectedInventoryItem = InventoryItem;