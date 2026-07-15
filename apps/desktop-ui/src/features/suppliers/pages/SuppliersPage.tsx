import { useState } from "react";

import PageHeader from "../../../components/shared/pageheader/PageHeader";
import Toolbar from "../../../components/shared/toolbar/Toolbar";
import ConfirmDialog from "../../../components/ui/confirmdialog/ConfirmDialog";

import SupplierTable from "../components/SupplierTable";
import SupplierModal from "../components/SupplierModal";

import { useSuppliers } from "../hooks/useSuppliers";

function SuppliersPage() {
  const {
    loading,

    search,
    setSearch,

    suppliers,

    isModalOpen,

    selectedSupplier,

    setSupplierToDelete,
    

    openCreateModal,
    openEditModal,
    closeModal,

    handleCreate,
    handleUpdate,
    handleDelete,
  } = useSuppliers();

  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Suppliers"
        subtitle="Manage your suppliers"
      />

      <Toolbar
        search={search}
        onSearch={setSearch}
        placeholder="Search supplier..."
        actionText="Add Supplier"
        onAction={openCreateModal}
      />

      <SupplierTable
        suppliers={suppliers}
        loading={loading}
        onAddSupplier={openCreateModal}
        onEdit={openEditModal}
        onDelete={(supplier) => {
          setSupplierToDelete(supplier);
          setConfirmOpen(true);
        }}
      />

      <SupplierModal
        open={isModalOpen}
        supplier={selectedSupplier}
        onClose={closeModal}
        onSave={(data) => {
          if (selectedSupplier) {
            handleUpdate(data);
          } else {
            handleCreate(data);
          }
        }}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Supplier"
        message="Are you sure you want to delete this supplier?"
        confirmText="Delete"
        cancelText="Cancel"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={async () => {
          try {
            await handleDelete();
            setConfirmOpen(false);
          } catch (err) {
            console.error(err);
          }
        }}
      />
    </div>
  );
}

export default SuppliersPage;