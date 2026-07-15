import Modal from "../../../components/ui/modal/Modal";

type Props = {
  open: boolean;
  data: any;
  onClose: () => void;
};

function ViewCustomerReturnModal({
  open,
  data,
  onClose,
}: Props) {

  if (!data) return null;

  const header = data.return ?? data;

  const items =
    data.items ??
    data.return_items ??
    [];

  const exchangeItems =
    data.exchange_items ??
    [];

  return (

    <Modal
      isOpen={open}
      title={`Customer Return #${header.id} • Sale #${header.sale_id}`}
      onClose={onClose}
    >

      <div className="space-y-6">

        {/* BASIC DETAILS */}

        <div className="grid grid-cols-2 gap-5">

          <div>

            <p className="text-sm text-gray-500">
              Sale
            </p>

            <p className="font-medium">
              #{header.sale_id}
            </p>

          </div>

          <div>

            <p className="text-sm text-gray-500">
              Customer
            </p>

            <p className="font-medium">
              {header.customer_name ??
                "Walk-in Customer"}
            </p>

          </div>

          <div>

  <p className="text-sm text-gray-500">
    Return Type
  </p>

  <span
    className={`inline-flex mt-1 px-2 py-1 rounded text-xs font-medium ${
      header.status === "EXCHANGED"
        ? "bg-blue-100 text-blue-700"
        : "bg-green-100 text-green-700"
    }`}
  >
    {header.status === "EXCHANGED"
      ? "Exchange"
      : "Refund"}
  </span>

</div>

          <div>

            <p className="text-sm text-gray-500">
              Amount
            </p>

            <p
              className={`font-semibold ${
                header.status === "EXCHANGED"
                  ? "text-blue-700"
                  : "text-green-700"
              }`}
            >
              ₹{header.total}
            </p>

          </div>

        </div>

        {/* RETURN ITEMS */}

        <div>

          <h3 className="font-semibold mb-3">
            Returned Items
          </h3>

          <table className="w-full border">

            <thead className="bg-gray-50">

              <tr>

                <th className="text-left px-3 py-2">
                  Item
                </th>

                <th className="text-right px-3 py-2">
                  Qty
                </th>

                <th className="text-right px-3 py-2">
                  Price
                </th>

                <th className="text-right px-3 py-2">
                  Total
                </th>

              </tr>

            </thead>

            <tbody>

              {items.map((item: any) => (

                <tr
                  key={item.id}
                  className="border-t"
                >

                  <td className="px-3 py-2">

                  <div className="font-medium">
                    {item.item_name}
                  </div>

                  <div className="text-xs text-gray-500">

                    {[item.brand, item.size, item.color]
                      .filter(Boolean)
                      .join(" • ")}

                  </div>
                    
                </td>

                  <td className="text-right px-3 py-2">

                    {item.quantity}

                  </td>

                  <td className="text-right px-3 py-2">

                    ₹{item.unit_price}

                  </td>

                  <td className="text-right px-3 py-2">

                    ₹{item.total}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* EXCHANGE ITEMS */}

        {header.return_type ===
          "EXCHANGE" && (

          <div>

            <h3 className="font-semibold mb-3">
              Exchange Items
            </h3>

            <table className="w-full border">

              <thead className="bg-gray-50">

                <tr>

                  <th className="text-left px-3 py-2">
                    Item
                  </th>

                  <th className="text-right px-3 py-2">
                    Qty
                  </th>

                  <th className="text-right px-3 py-2">
                    Price
                  </th>

                  <th className="text-right px-3 py-2">
                    Total
                  </th>

                </tr>

              </thead>

              <tbody>

                {exchangeItems.map(
                  (item: any) => (

                    <tr
                      key={item.id}
                      className="border-t"
                    >

                      <td className="px-3 py-2">
                        {item.item_name}
                      </td>

                      <td className="text-right px-3 py-2">
                        {item.quantity}
                      </td>

                      <td className="text-right px-3 py-2">
                        ₹{item.selling_price}
                      </td>

                      <td className="text-right px-3 py-2">
                        ₹{item.total}
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </Modal>

  );

}

export default ViewCustomerReturnModal;