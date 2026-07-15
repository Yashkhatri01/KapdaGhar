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
      <div className="p-6 text-sm text-gray-500">
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
    <div className="overflow-x-auto rounded-lg border bg-white">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-left text-gray-600">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Phone</th>
            <th className="p-3">Address</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {suppliers.map((supplier) => (
            <tr
              key={supplier.id}
              className="border-t hover:bg-gray-50"
            >
              <td className="p-3 font-medium">
                {supplier.name}
              </td>

              <td className="p-3">
                {supplier.phone || "-"}
              </td>

              <td className="p-3">
                {supplier.address || "-"}
              </td>

              <td className="p-3">
                <div className="flex gap-3">
                  <button
                    onClick={() => onEdit(supplier)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(supplier)}
                    className="text-red-600 hover:underline"
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
  );
}

export default SupplierTable;