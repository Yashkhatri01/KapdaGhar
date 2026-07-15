type PurchaseItem = {
  id: number;

  item_name: string;
  brand?: string;
  size?: string;
  color?: string;

  quantity: number;

  unit_cost: number;
  total: number;
};

type Props = {
  open: boolean;
  purchase: any;
  items: PurchaseItem[];
  onClose: () => void;
};

function PurchaseItemsModal({
  open,
  purchase,
  items,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-lg shadow-xl w-[700px] max-w-[95%]">

        <div className="flex justify-between items-center border-b p-4">

          <h2 className="text-lg font-semibold">
            Purchase #{purchase?.id} Details
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-xl"
          >
            ×
          </button>

        </div>

        <div className="p-4 max-h-[500px] overflow-y-auto">

          {/* PURCHASE INFO */}

          <div className="grid grid-cols-3 gap-4 mb-5 text-sm">

            <div>

              <p className="text-gray-500">
                Supplier
              </p>

              <p className="font-medium">
                {purchase?.supplier_name || "Walk-in Supplier"}
              </p>

            </div>

            <div>

              <p className="text-gray-500">
                Date
              </p>

              <p className="font-medium">
                {new Date(purchase?.created_at).toLocaleString()}
              </p>

            </div>

            <div>

              <p className="text-gray-500">
                Total
              </p>

              <p className="font-bold text-green-600">
                ₹{purchase?.total}
              </p>

            </div>

          </div>

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
                  Purchase Price
                </th>

                <th>
                  Total
                </th>

              </tr>

            </thead>

            <tbody>

              {items.map((item) => (

                <tr
                  key={item.id}
                  className="border-b"
                >

                  <td className="py-2">

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

                  <td className="text-center">
                    ₹{item.unit_cost}
                  </td>

                  <td className="text-center font-semibold">
                    ₹{item.total}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          <div className="border-t mt-5 pt-4 flex justify-end">

            <div className="text-right">

              <p className="text-gray-500 text-sm">
                Purchase Total
              </p>

              <p className="text-2xl font-bold text-green-600">
                ₹{purchase?.total}
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default PurchaseItemsModal;