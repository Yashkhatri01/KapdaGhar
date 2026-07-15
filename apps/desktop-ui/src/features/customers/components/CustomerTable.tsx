import type { Customer } from "../types/customer";

type Props = {
  customers: Customer[];
  loading: boolean;

  onEdit: (customer: Customer) => void;
  onDelete?: (id: number) => void;
};

function CustomerTable({
  customers,
  loading,
  onEdit,
  onDelete,
}: Props) {
  if (loading) {
    return (
      <div className="p-6 text-sm text-gray-500">
        Loading customers...
      </div>
    );
  }

  if (!customers.length) {
    return (
      <div className="p-6 text-sm text-gray-400">
        No customers found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg border">
      <table className="w-full text-sm">

        <thead className="bg-gray-50 text-left text-gray-600">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Phone</th>
            <th className="p-3">Added On</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((customer) => (
            <tr
              key={customer.id}
              className="border-t hover:bg-gray-50"
            >
              <td className="p-3 font-medium">
                {customer.name}
              </td>

              <td className="p-3">
                {customer.phone || "-"}
              </td>

              <td className="p-3">
                {new Date(customer.created_at).toLocaleDateString()}
              </td>

              <td className="p-3">
                <div className="flex gap-3">

                  <button
                    onClick={() => onEdit(customer)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>

                  {onDelete && (
                    <button
                      onClick={() => onDelete(customer.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  )}

                </div>
              </td>

            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}

export default CustomerTable;