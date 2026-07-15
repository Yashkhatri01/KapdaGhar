import InventorySelector from "../../../components/shared/inventoryselector/InventorySelector";
import type { useCart } from "../../sales/hooks/useCart";

import type { InventoryItem } from "../../../components/shared/inventoryselector/useInventorySelector";

type Props = {
  cartHook: ReturnType<typeof useCart>;
  items: InventoryItem[];
  loading: boolean;
};



function ExchangeCart({
  cartHook,
  items,
  loading,
}: Props) {

  const {
  cart,
  addItem,
  increaseQty,
  decreaseQty,
  removeItem,
  totals,
} = cartHook;
 

  return (
    <div className="bg-white border rounded-lg p-5 space-y-5">

      <h2 className="font-semibold">
        Exchange Items
      </h2>

      <InventorySelector
  items={items}
  loading={loading}
  onSelect={addItem}
/>

      {cart.length === 0 ? (

        <div className="text-sm text-gray-500">
          No exchange items selected.
        </div>

      ) : (

        <table className="w-full text-sm">

          <thead>

            <tr className="border-b">

              <th className="text-left py-2">
                Item
              </th>

              <th>
                Qty
              </th>

              <th>
                Price
              </th>

              <th>
                Total
              </th>

              <th></th>

            </tr>

          </thead>

          <tbody>

            {cart.map((item) => (

              <tr
                key={item.inventory_id}
                className="border-b"
              >

                <td className="py-3">

                  <div className="font-medium">
                    {item.item_name}
                  </div>

                  <div className="text-xs text-gray-500">
                    {[item.brand, item.size, item.color]
                      .filter(Boolean)
                      .join(" • ")}
                  </div>

                </td>

                <td>

                  <div className="flex items-center justify-center gap-2">

                    <button
                      onClick={() =>
                        decreaseQty(item.inventory_id)
                      }
                    >
                      -
                    </button>

                    {item.quantity}

                    <button
                      onClick={() =>
                        increaseQty(item.inventory_id)
                      }
                    >
                      +
                    </button>

                  </div>

                </td>

                <td className="text-center">
                  ₹{item.selling_price}
                </td>

                <td className="text-center">
                  ₹{item.quantity * item.selling_price}
                </td>

                <td>

                  <button
                    onClick={() =>
                      removeItem(item.inventory_id)
                    }
                    className="text-red-600"
                  >
                    Remove
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      )}

      <div className="flex justify-end">

        <div className="font-semibold">
          Exchange Total : ₹{totals.subtotal}
        </div>

      </div>

    </div>
  );

}

export default ExchangeCart;