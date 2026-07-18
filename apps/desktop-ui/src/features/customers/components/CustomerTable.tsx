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
      <div className="py-10 text-center text-sm text-gray-500">
        Loading customers...
      </div>
    );
  }

  if (!customers.length) {
    return (
      <div className="py-10 text-center text-sm text-gray-400">
        No customers found
      </div>
    );
  }

  return (

    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

      <div className="overflow-x-auto">

        <table className="w-full table-auto text-sm">

          <thead className="bg-gray-50 border-b">

            <tr>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Customer
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Phone
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Added On
              </th>

              <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {customers.map((customer) => (

              <tr
                key={customer.id}
                className="
                  border-b
                  last:border-none
                  hover:bg-indigo-50/40
                  transition-all
                  duration-200
                "
              >

                {/* Customer */}

                <td className="px-5 py-4">

                  <div className="flex items-center gap-3">

                    <div
                      className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        bg-indigo-100
                        font-semibold
                        text-indigo-700
                      "
                    >

                      {customer.name.charAt(0).toUpperCase()}

                    </div>

                    <div>

                      <p className="font-medium text-gray-900">
                        {customer.name}
                      </p>

                      <p className="text-xs text-gray-500">
                        Registered Customer
                      </p>

                    </div>

                  </div>

                </td>

                {/* Phone */}

                <td className="px-5 py-4">

                  {customer.phone ? (

                    <span
                      className="
                        inline-flex
                        rounded-full
                        bg-green-100
                        px-3
                        py-1
                        text-xs
                        font-medium
                        text-green-700
                      "
                    >

                      {customer.phone}

                    </span>

                  ) : (

                    <span className="text-gray-400">
                      —
                    </span>

                  )}

                </td>

                {/* Date */}

                <td className="px-5 py-4 text-gray-500 whitespace-nowrap">

                  {new Date(
                    customer.created_at
                  ).toLocaleDateString("en-IN", {

                    day: "2-digit",
                    month: "short",
                    year: "numeric",

                  })}

                </td>

                {/* Actions */}

                <td className="px-5 py-4">

                  <div className="flex justify-center gap-2">

                    <button
                      onClick={() => onEdit(customer)}
                      className="
                        rounded-lg
                        border
                        border-blue-200
                        bg-blue-50
                        px-3
                        py-1.5
                        text-xs
                        font-medium
                        text-blue-700
                        transition-all
                        duration-200
                        hover:-translate-y-0.5
                        hover:bg-blue-100
                      "
                    >
                      Edit
                    </button>

                    {onDelete && (

                      <button
                        onClick={() => onDelete(customer.id)}
                        className="
                          rounded-lg
                          border
                          border-red-200
                          bg-red-50
                          px-3
                          py-1.5
                          text-xs
                          font-medium
                          text-red-700
                          transition-all
                          duration-200
                          hover:-translate-y-0.5
                          hover:bg-red-100
                        "
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

    </div>

  );

}

export default CustomerTable;