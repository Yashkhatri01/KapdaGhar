import Modal from "../../../components/ui/modal/Modal";

type Props = {
  open: boolean;
  data: any;
  onClose: () => void;
};

function ViewSupplierReturnModal({
  open,
  data,
  onClose,
}: Props) {

  if (!data) return null;

  const header = data.header ?? data;

  const items =
    data.items ?? [];

  return (

    <Modal
      isOpen={open}
      title={`Supplier Return #${header.id}`}
      onClose={onClose}
    >

      <div className="space-y-6">

        {/* Header */}

        <div className="grid grid-cols-2 gap-5">

          <div>

            <p className="text-sm text-gray-500">
              Purchase
            </p>

            <p className="font-medium">
              #{header.purchase_id}
            </p>

          </div>

          <div>

            <p className="text-sm text-gray-500">
              Supplier
            </p>

            <p className="font-medium">
              {header.supplier_name}
            </p>

          </div>

          <div>

            <p className="text-sm text-gray-500">
              Date
            </p>

            <p className="font-medium">
              {new Date(
                header.created_at
              ).toLocaleString()}
            </p>

          </div>

          <div>

            <p className="text-sm text-gray-500">
              Total Return Value
            </p>

            <p className="font-semibold text-red-600">
              ₹{header.total}
            </p>

          </div>

        </div>

        {/* Items */}

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
                  Unit Cost
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

                      {item.brand || "-"}

                      {" | "}

                      {item.size || "-"}

                      {" | "}

                      {item.color || "-"}

                    </div>

                  </td>

                  <td className="px-3 py-2 text-right">
                    {item.quantity}
                  </td>

                  <td className="px-3 py-2 text-right">
                    ₹{item.unit_cost}
                  </td>

                  <td className="px-3 py-2 text-right font-medium">
                    ₹{item.total}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </Modal>

  );

}

export default ViewSupplierReturnModal;