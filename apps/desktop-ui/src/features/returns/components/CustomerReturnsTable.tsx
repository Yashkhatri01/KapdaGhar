import { Eye } from "lucide-react";
type Props = {
  returns: any[];
  loading: boolean;
  onView: (id: number) => void;
};

function CustomerReturnsTable({
  returns,
  loading,
  onView,
}: Props) {
  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 text-sm text-gray-500">
        Loading customer returns...
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
              Sale
            </th>

            <th className="px-5 py-3 font-semibold">
              Customer
            </th>

            <th className="px-5 py-3 font-semibold">
              Status
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
                colSpan={7}
                className="py-10 text-center text-gray-400"
              >
                No customer returns found.
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

              <td className="px-5 py-4 font-semibold text-gray-800">
                #{r.id}
              </td>

              <td className="px-5 py-4 text-gray-500 whitespace-nowrap">
                {new Date(r.created_at).toLocaleDateString(
                  "en-IN",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }
                )}
              </td>

              <td className="px-5 py-4 font-medium">
                #{r.sale_id}
              </td>

              <td className="px-5 py-4">

                {r.customer_name ? (

                  <span className="inline-flex items-center gap-2 font-medium">
                    👤 {r.customer_name}
                  </span>

                ) : (

                  <span className="inline-flex items-center gap-2 text-gray-500">
                    🚶 Walk-in Customer
                  </span>

                )}

              </td>

              <td className="px-5 py-4">

                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    r.status === "EXCHANGED"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {r.status === "EXCHANGED"
                    ? "Exchange"
                    : "Refund"}
                </span>

              </td>

              <td className="px-5 py-4 text-right font-semibold text-gray-900">
                ₹{r.total}
              </td>

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

export default CustomerReturnsTable;