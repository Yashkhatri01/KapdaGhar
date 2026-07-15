import Button from "../../../components/ui/button/Button";

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
      <div className="bg-white border rounded-lg p-6">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg overflow-hidden">

      <table className="w-full">

        <thead className="bg-gray-50">

          <tr className="text-left">

            <th className="px-4 py-3">
              Return #
            </th>

            <th className="px-4 py-3">
              Date
            </th>

            <th className="px-4 py-3">
              Sale
            </th>

            <th className="px-4 py-3">
              Customer
            </th>

            <th className="px-4 py-3">
              Status
            </th>

            <th className="px-4 py-3 text-right">
              Amount
            </th>

            <th className="px-4 py-3 text-center">
              Action
            </th>

          </tr>

        </thead>

        <tbody>

          {returns.length === 0 && (

            <tr>

              <td
                colSpan={7}
                className="text-center py-8 text-gray-500"
              >
                No customer returns found.
              </td>

            </tr>

          )}

          {returns.map((r) => (

            <tr
              key={r.id}
              className="border-t hover:bg-gray-50"
            >

              <td className="px-4 py-3">
                #{r.id}
              </td>

              <td className="px-4 py-3">
                {new Date(r.created_at).toLocaleDateString(
                  "en-IN",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }
                )}
              </td>

              <td className="px-4 py-3">
                #{r.sale_id}
              </td>

              <td className="px-4 py-3">

                {r.customer_name ??
                  "Walk-in Customer"}

              </td>

              <td className="px-4 py-3">

                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
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

              <td className="px-4 py-3 text-right font-medium">
                ₹{r.total}
              </td>

              <td className="px-4 py-3 text-center">

                <Button
                  variant="outline"
                  className="px-3 py-1 text-xs"
                  onClick={() => onView(r.id)}
                >
                  View
                </Button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default CustomerReturnsTable;