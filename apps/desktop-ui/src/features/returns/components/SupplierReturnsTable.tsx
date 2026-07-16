import Button from "../../../components/ui/button/Button";
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
              Purchase
            </th>

            <th className="px-4 py-3">
              Supplier
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
                colSpan={6}
                className="py-8 text-center text-gray-500"
              >
                No supplier returns found.
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

                {new Date(
                  r.created_at
                ).toLocaleDateString()}

              </td>

              <td className="px-4 py-3">
                #{r.purchase_id}
              </td>

              <td className="px-4 py-3">

                {r.supplier_name}

              </td>

              <td className="px-4 py-3 text-right font-medium">

                ₹{r.total}

              </td>

              <td className="px-4 py-3 text-center">

                <Button
  onClick={() => onView(r.id)}
  className="bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:scale-95 text-white px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all duration-200"
>
  <Eye size={14} />
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

export default SupplierReturnsTable;