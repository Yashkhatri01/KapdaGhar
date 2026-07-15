import { useEffect, useState } from "react";

type SaleItem = {
  sale_item_id: number;

  inventory_id: number;

  item_name: string;

  brand?: string;
  size?: string;
  color?: string;

  quantity: number;

  selling_price: number;

  total: number;

  already_returned: number;

  remaining_quantity: number;
};

type ReturnItem = {
  sale_item_id: number;

  inventory_id: number;

  quantity: number;
};

type Props = {
  items: SaleItem[];

  onChange: (items: ReturnItem[]) => void;
};

function CustomerReturnItemsTable({
  items,
  onChange,
}: Props) {

  const [returnQty, setReturnQty] =
    useState<Record<number, number>>({});

    useEffect(() => {
      setReturnQty({});
    }, [items]);

  useEffect(() => {

    const payload = items
      .filter(
        (item) =>
          (returnQty[item.sale_item_id] || 0) > 0
      )
      .map((item) => ({
        
        sale_item_id: item.sale_item_id,
        inventory_id: item.inventory_id,
        quantity:
          returnQty[item.sale_item_id],
      }));

    onChange(payload);

  }, [returnQty, items]);

  function updateQty(
    saleItemId: number,
    value: string,
    max: number
  ) {

    let qty = Number(value);

    if (isNaN(qty)) qty = 0;

    if (qty < 0) qty = 0;

    if (qty > max) qty = max;

    setReturnQty((prev) => ({
      ...prev,
      [saleItemId]: qty,
    }));

  }

  if (items.length === 0) {

    return (
      <div className="bg-white border rounded-lg p-5 text-gray-500">
        No items found.
      </div>
    );

  }

  return (

    <div className="bg-white border rounded-lg overflow-hidden">

      <div className="px-5 py-4 border-b">

        <h2 className="font-semibold">
          Return Items
        </h2>

      </div>

      <table className="w-full text-sm">

        <thead className="bg-gray-50">

          <tr>

            <th className="text-left px-4 py-3">
              Item
            </th>

            <th className="text-center">
              Sold
            </th>

            <th className="text-center">
              Returned
            </th>

            <th className="text-center">
              Remaining
            </th>

            <th className="text-center">
              Return Qty
            </th>

          </tr>

        </thead>

        <tbody>

          {items.map((item) => {

  const currentQty =
    returnQty[item.sale_item_id] || 0;

  const displayedReturned =
    item.already_returned + currentQty;

  const displayedRemaining =
    item.quantity - displayedReturned;

  return (

    <tr
              key={item.sale_item_id}
              className="border-t"
            >

              <td className="px-4 py-3">

                <div className="font-medium">
                  {item.item_name}
                </div>

                <div className="text-xs text-gray-500">

                  {[item.brand, item.size, item.color]
                    .filter(Boolean)
                    .join(" • ")}

                </div>

              </td>

              <td className="text-center">
                {item.quantity}
              </td>

              <td className="text-center text-orange-600">
                {displayedReturned}
              </td>

              <td className="text-center text-green-600 font-medium">
                {displayedRemaining}
              </td>

              <td className="text-center">

                <input
                  type="number"
                  min={0}
                  max={item.quantity - item.already_returned}
                  value={
                    returnQty[item.sale_item_id] || 0
                  }
                  onChange={(e) =>
                    updateQty(
                      item.sale_item_id,
                      e.target.value,
                      item.quantity - item.already_returned
                    )
                  }
                  className="w-20 border rounded px-2 py-1 text-center"
                />
                

              </td>

            </tr>

                    );

        })}

        </tbody>

      </table>

    </div>

  );

}

export default CustomerReturnItemsTable;