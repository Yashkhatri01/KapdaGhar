import {
  ArrowDownCircle,
  ArrowUpCircle,
} from "lucide-react";

import type {
  CashbookEntry,
} from "../api/cashbookApi";

type Props = {
  entries: CashbookEntry[];

  loading: boolean;
};

function CashbookTable({
  entries,
  loading,
}: Props) {
  if (loading) {
    return (
      <div className="bg-white border rounded-lg p-6">
        Loading cashbook...
      </div>
    );
  }

  function getSource(entry: CashbookEntry) {
    switch (entry.reference_type) {

case "sales":
  return `Sale #${entry.reference_id}`;

case "purchases":
  return `Purchase #${entry.reference_id}`;

case "customer_returns":
  return `Customer Return #${entry.reference_id}`;

case "supplier_returns":
  return `Supplier Return #${entry.reference_id}`;

default:
  return "-";

}
  }

  return (
    <div className="bg-white border rounded-lg overflow-hidden">

      <table className="w-full">

        <thead className="bg-gray-50">

          <tr className="text-left">

            <th className="px-4 py-3">
              Date
            </th>

            <th className="px-4 py-3">
              Time
            </th>

            <th className="px-4 py-3">
              Type
            </th>

            <th className="px-4 py-3">
              Source
            </th>

            <th className="px-4 py-3">
              Description
            </th>

            <th className="px-4 py-3 text-right">
              Amount
            </th>

          </tr>

        </thead>

        <tbody>

          {entries.length === 0 && (
            <tr>

              <td
                colSpan={6}
                className="text-center py-8 text-gray-500"
              >
                No transactions found.
              </td>

            </tr>
          )}

          {entries.map((entry) => {

            const isIncome =
              entry.transaction_type ===
              "INCOME";

            return (

              <tr
                key={entry.id}
                className="border-t hover:bg-gray-50"
              >

                <td className="px-4 py-3">
                  {new Date(
                    entry.created_at
                  ).toLocaleDateString()}
                </td>

                <td className="px-4 py-3 text-gray-600">
                  {new Date(
                    entry.created_at
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>

                <td className="px-4 py-3">

                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                      isIncome
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >

                    {isIncome ? (
                      <ArrowDownCircle size={14} />
                    ) : (
                      <ArrowUpCircle size={14} />
                    )}

                    {isIncome
                      ? "Income"
                      : "Expense"}

                  </span>

                </td>

                <td className="px-4 py-3 font-medium">
                  {getSource(entry)}
                </td>

                <td className="px-4 py-3 text-gray-600">
                  {entry.description}
                </td>

                <td
                  className={`px-4 py-3 text-right font-semibold ${
                    isIncome
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >

                  {isIncome ? "+" : "-"}

                  ₹
                  {entry.amount.toLocaleString()}

                </td>

              </tr>

            );

          })}

        </tbody>

      </table>

    </div>
  );
}

export default CashbookTable;