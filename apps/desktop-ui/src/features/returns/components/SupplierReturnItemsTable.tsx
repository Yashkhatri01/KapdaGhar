import { useEffect, useState } from "react";

type PurchaseItem = {
  purchase_item_id: number;

  inventory_id: number;

  item_name: string;

  brand?: string;

  size?: string;

  color?: string;

  quantity: number;

  remaining_quantity: number;

  unit_cost: number;
};

type Props = {
  items: PurchaseItem[];

  onChange: (
    items: {
      purchase_item_id: number;
      inventory_id: number;
      quantity: number;
    }[]
  ) => void;
};

function SupplierReturnItemsTable({
  items,
  onChange,
}: Props) {
  const [selected, setSelected] = useState<
    Record<number, number>
  >({});

  useEffect(() => {
    const payload = Object.entries(selected)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => {
        const purchaseItem = items.find(
          (i) =>
            i.purchase_item_id === Number(id)
        );

        return {
          purchase_item_id: Number(id),
          inventory_id:
            purchaseItem!.inventory_id,
          quantity: qty,
        };
      });

    onChange(payload);
  }, [selected]);

  function updateQty(
    purchaseItemId: number,
    qty: number
  ) {
    setSelected((prev) => ({
      ...prev,
      [purchaseItemId]: qty,
    }));
  }

  return (
    <div className="bg-white border rounded-lg overflow-hidden">

      <table className="w-full">

        <thead className="bg-gray-50">

          <tr>

            <th className="px-4 py-3 text-left">
              Item
            </th>

            <th className="px-4 py-3 text-right">
              Purchased
            </th>

            <th className="px-4 py-3 text-right">
              Remaining
            </th>

            <th className="px-4 py-3 text-right">
              Unit Cost
            </th>

            <th className="px-4 py-3 text-center">
              Return Qty
            </th>

          </tr>

        </thead>

        <tbody>

          {items.map((item) => (

            <tr
              key={item.purchase_item_id}
              className="border-t"
            >

              <td className="px-4 py-3">

                <div className="font-medium">
                  {item.item_name}
                </div>

                <div className="text-xs text-gray-500">

                  {item.brand || "-"}

                  {" | "}

                  {item.size || "-"}

                  {" | "}

                  {item.color || "-"}

                </div>

              </td>

              <td className="px-4 py-3 text-right">

                {item.quantity}

              </td>

              <td className="px-4 py-3 text-right">

                {item.remaining_quantity}

              </td>

              <td className="px-4 py-3 text-right">

                ₹{item.unit_cost}

              </td>

              <td className="px-4 py-3 text-center">

                <input
                  type="number"
                  min={0}
                  max={
                    item.remaining_quantity
                  }
                  value={
                    selected[
                      item.purchase_item_id
                    ] || ""
                  }
                  onChange={(e) =>
                    updateQty(
                      item.purchase_item_id,
                      Number(
                        e.target.value
                      )
                    )
                  }
                  className="w-20 border rounded p-1 text-center"
                />

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default SupplierReturnItemsTable;