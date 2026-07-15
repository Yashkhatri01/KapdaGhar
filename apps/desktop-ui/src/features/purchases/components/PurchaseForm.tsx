import { useState } from "react";

import SupplierSelector from "../../../components/shared/supplierselector/SupplierSelector";
import InventorySelector from "../../../components/shared/inventoryselector/InventorySelector";

import type { Supplier } from "../../suppliers/types/supplier";
import type { InventoryItem } from "../../../components/shared/inventoryselector/useInventorySelector";

function PurchaseForm() {
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  return (
    <div className="space-y-6">

      {/* Supplier */}

      <div>
        <h3 className="font-medium mb-2">
          Supplier
        </h3>

        <SupplierSelector
          onSelect={setSupplier}
        />

        {supplier && (
          <div className="mt-2 rounded border bg-gray-50 p-2 text-sm">
            Selected Supplier:
            <span className="font-semibold ml-2">
              {supplier.name}
            </span>
          </div>
        )}
      </div>

      {/* Inventory */}

      <div>
        <h3 className="font-medium mb-2">
          Item
        </h3>

        <InventorySelector
          onSelect={setSelectedItem}
        />

        {selectedItem && (
          <div className="mt-2 rounded border bg-gray-50 p-2 text-sm">
            Selected Item:
            <span className="font-semibold ml-2">
              {selectedItem.item_name}
            </span>
          </div>
        )}
      </div>

    </div>
  );
}

export default PurchaseForm;