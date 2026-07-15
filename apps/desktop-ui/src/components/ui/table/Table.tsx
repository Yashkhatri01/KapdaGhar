import type { ReactNode } from "react";

type TableProps = {
  headers: string[];
  children: ReactNode;
};

function Table({
  headers,
  children,
}: TableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full text-sm">

        <thead className="bg-gray-50">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="px-4 py-3 text-left font-semibold text-gray-700"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {children}
        </tbody>

      </table>
    </div>
  );
}

export default Table;