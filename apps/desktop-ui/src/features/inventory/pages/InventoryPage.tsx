import { useState } from "react";
import { useToast } from "../../../contexts/ToastContext";
import PageHeader from "../../../components/shared/pageheader/PageHeader";
import Toolbar from "../../../components/shared/toolbar/Toolbar";
import InventoryTable from "../components/InventoryTable";
import InventoryModal from "../components/InventoryModal";
import ConfirmDialog from "../../../components/ui/confirmdialog/ConfirmDialog";
import { useInventory } from "../hooks/useInventory";

function InventoryPage() {
  const {
  items,
  loading,
  search,
  setSearch,

  selectedItem,
  setSelectedItem,

  isModalOpen,
  setIsModalOpen,

  addItem,
  updateItem,
  deleteItem
} = useInventory();

  // ✅ delete confirmation state
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [tab, setTab] = useState("ACTIVE");
  const toast = useToast();
  const filteredItems = items.filter((item) => {
  if (tab === "ACTIVE") {
    return item.status === "ACTIVE" && item.stock > 0;
  }

  if (tab === "OUT_OF_STOCK") {
    return item.status === "OUT_OF_STOCK" || item.stock === 0;
  }

  return true;
});
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <PageHeader
        title="Inventory"
        subtitle="Manage your stock (Maal)"
      />

      <div className="flex gap-3 mb-5">

  {/* ACTIVE TAB */}
  <button
    onClick={() => setTab("ACTIVE")}
    className={`
      px-4 py-2 rounded-lg text-sm font-medium
      transition-all duration-200
      border
      ${
        tab === "ACTIVE"
          ? "bg-blue-50 text-blue-600 border-blue-200 shadow-md scale-[1.02]"
          : "bg-white text-gray-600 hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 hover:border-gray-300"
      }
    `}
  >
    🟢 In Stock
  </button>

  {/* OUT OF STOCK TAB */}
  <button
    onClick={() => setTab("OUT_OF_STOCK")}
    className={`
      px-4 py-2 rounded-lg text-sm font-medium
      transition-all duration-200
      border
      ${
        tab === "OUT_OF_STOCK"
          ? "bg-red-50 text-red-600 border-red-200 shadow-md"
          : "bg-white text-gray-600 hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 hover:border-gray-300"
      }
    `}
  >
    🔴 Out of Stock
  </button>

</div>

      {/* TOOLBAR */}
      <Toolbar
        search={search}
        onSearch={setSearch}
        placeholder="Search Item, Category, Brand..."
        actionText="Add Item"
        onAction={() => {
          setSelectedItem(null);
          setIsModalOpen(true);
        }}
      />

      {/* TABLE */}
      <InventoryTable
        items={filteredItems}
        loading={loading}
        onEditStock={(item) => {
          setSelectedItem(item);
          setIsModalOpen(true);
        }}

        // ✅ IMPORTANT: open confirm modal, DO NOT delete directly
        onDelete={(id) => setDeleteId(id)}
      />

      {/* MODAL (ADD / EDIT) */}
      <InventoryModal
        open={isModalOpen}
        item={selectedItem}
        onClose={() => setIsModalOpen(false)}
        onSave={async (data) => {
  try {
    if (selectedItem?.id) {
      await updateItem(selectedItem.id, {
  ...data,
  stock: Number(data.stock ?? 0),
  min_stock: Number(data.min_stock ?? 1),
  purchase_price: Number(data.purchase_price ?? 0),
  selling_price: Number(data.selling_price ?? 0),
});
    } else {
      await addItem({
        ...data,
        stock: Number(data.stock ?? 0),
        min_stock: Number(data.min_stock ?? 1),
        purchase_price: Number(data.purchase_price ?? 0),
        selling_price: Number(data.selling_price ?? 0),
      });
    }

    setIsModalOpen(false);
setSelectedItem(null);

toast.success({
  title: selectedItem
    ? "Item Updated"
    : "Item Added",
  description: selectedItem
    ? "Inventory updated successfully."
    : "New item added to inventory.",
});

} catch (err) {

  console.error("Save failed:", err);

  toast.error({
    title: "Save Failed",
    description: "Unable to save inventory item.",
  });

}
}}
      />

      {/* CONFIRM DELETE MODAL */}
      <ConfirmDialog
        open={deleteId !== null}
        title="Delete Inventory Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return;
                
          const id = deleteId;
          setDeleteId(null); // UI close first
                
          try {

  await deleteItem(id);

  toast.success({
    title: "Item Deleted",
    description: "Inventory item removed successfully.",
  });

} catch {

  toast.error({
    title: "Delete Failed",
    description: "Unable to delete inventory item.",
  });

}
        }}
      />

    </div>
  );
}

export default InventoryPage;