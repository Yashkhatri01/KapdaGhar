import { Eye } from "lucide-react";

type Props = {
  returns: any[];
  loading: boolean;
  onView: (id: number) => void;
};

function SupplierReturnsTable({
  returns,
  loading,
  onView,
}: Props) {

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 text-sm text-gray-500">
        Loading supplier returns...
      </div>
    );
  }

  return (

    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">

      <table className="w-full table-auto text-sm">

        <thead className="bg-gray-50 border-b border-gray-200">

          <tr className="text-left text-gray-600">

            <th className="px-5 py-3 font-semibold">
              Return #
            </th>

            <th className="px-5 py-3 font-semibold">
              Date
            </th>

            <th className="px-5 py-3 font-semibold">
              Purchase
            </th>

            <th className="px-5 py-3 font-semibold">
              Supplier
            </th>

            <th className="px-5 py-3 text-right font-semibold">
              Amount
            </th>

            <th className="px-5 py-3 text-center font-semibold">
              Action
            </th>

          </tr>

        </thead>

        <tbody>

          {returns.length === 0 && (

            <tr>

              <td
                colSpan={6}
                className="py-10 text-center text-gray-400"
              >
                No supplier returns found.
              </td>

            </tr>

          )}

          {returns.map((r) => (

            <tr
              key={r.id}
              className="
                border-b
                last:border-none
                hover:bg-indigo-50/40
                transition-all
                duration-200
              "
            >

              {/* Return ID */}

              <td className="px-5 py-4 font-semibold text-gray-800">
                #{r.id}
              </td>

              {/* Date */}

              <td className="px-5 py-4 whitespace-nowrap text-gray-500">

                {new Date(
                  r.created_at
                ).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}

              </td>

              {/* Purchase */}

              <td className="px-5 py-4 font-medium">
                #{r.purchase_id}
              </td>

              {/* Supplier */}

              <td className="px-5 py-4">

                <span className="inline-flex items-center gap-2 font-medium">

                  🏭 {r.supplier_name}

                </span>

              </td>

              {/* Amount */}

              <td className="px-5 py-4 text-right font-semibold text-gray-900 tabular-nums">
                ₹{r.total}
              </td>

              {/* Action */}

              <td className="px-5 py-4">

                <div className="flex justify-center">

                  <button
  onClick={() => onView(r.id)}
  className="
    inline-flex
    items-center
    gap-1.5
    rounded-lg
    bg-indigo-50
    px-3
    py-1.5
    text-xs
    font-semibold
    text-indigo-700
    transition-all
    duration-200
    hover:bg-indigo-100
    hover:shadow-sm
    active:scale-95
  "
>
  <Eye size={14} />
  View
</button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}

export default SupplierReturnsTable;