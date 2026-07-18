import EmptyState from "../../../components/ui/emptystate/EmptyState";
import type { Supplier } from "../types/supplier";

type Props = {
  suppliers: Supplier[];
  loading: boolean;

  onEdit: (supplier: Supplier) => void;
  onDelete: (supplier: Supplier) => void;
  onAddSupplier: () => void;
};

function SupplierTable({
  suppliers,
  loading,
  onEdit,
  onDelete,
  onAddSupplier,
}: Props) {

  if (loading) {
    return (
      <div className="py-10 text-center text-sm text-gray-500">
        Loading suppliers...
      </div>
    );
  }

  if (!suppliers.length) {
    return (
      <EmptyState
        title="No Suppliers"
        description="Add your first supplier to get started."
        actionLabel="Add Supplier"
        onAction={onAddSupplier}
      />
    );
  }

  return (

    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

      <div className="overflow-x-auto">

        <table className="w-full table-auto text-sm">

          <thead className="bg-gray-50 border-b">

            <tr>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Supplier
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Phone
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Address
              </th>

              <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {suppliers.map((supplier) => (

              <tr
                key={supplier.id}
                className="
                  border-b
                  last:border-none
                  hover:bg-indigo-50/40
                  transition-all
                  duration-200
                "
              >

                {/* Supplier */}

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
                        bg-amber-100
                        font-semibold
                        text-amber-700
                      "
                    >

                      {supplier.name.charAt(0).toUpperCase()}

                    </div>

                    <div>

                      <p className="font-medium text-gray-900">
                        {supplier.name}
                      </p>

                      <p className="text-xs text-gray-500">
                        Business Supplier
                      </p>

                    </div>

                  </div>

                </td>

                {/* Phone */}

                <td className="px-5 py-4">

                  {supplier.phone ? (

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

                      {supplier.phone}

                    </span>

                  ) : (

                    <span className="text-gray-400">
                      —
                    </span>

                  )}

                </td>

                {/* Address */}

                <td className="px-5 py-4 max-w-xs">

                  {supplier.address ? (

                    <span
                      className="
                        text-gray-600
                        truncate
                        block
                      "
                      title={supplier.address}
                    >

                      {supplier.address}

                    </span>

                  ) : (

                    <span className="text-gray-400">
                      —
                    </span>

                  )}

                </td>

                {/* Actions */}

                <td className="px-5 py-4">

                  <div className="flex justify-center gap-2">

                    <button
                      onClick={() => onEdit(supplier)}
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

                    <button
                      onClick={() => onDelete(supplier)}
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

export default SupplierTable;