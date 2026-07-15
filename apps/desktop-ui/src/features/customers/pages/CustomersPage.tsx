import { useState } from "react";

import PageHeader from "../../../components/shared/pageheader/PageHeader";
import Toolbar from "../../../components/shared/toolbar/Toolbar";
import ConfirmDialog from "../../../components/ui/confirmdialog/ConfirmDialog";

import CustomerTable from "../components/CustomerTable";
import CustomerModal from "../components/CustomerModal";

import { useCustomers } from "../hooks/useCustomers";

function CustomersPage() {
  const {
    customers,
    loading,

    search,
    setSearch,

    selectedCustomer,

    isModalOpen,

    
    setCustomerToDelete,

    openCreateModal,
    openEditModal,
    closeModal,

    handleCreate,
    handleUpdate,
    handleDelete,
  } = useCustomers();

  // Local confirmation dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <PageHeader
        title="Customers"
        subtitle="Manage your customers (Grahak)"
      />

      {/* TOOLBAR */}
      <Toolbar
        search={search}
        onSearch={setSearch}
        placeholder="Search Customer Name or Phone..."
        actionText="Add Customer"
        onAction={openCreateModal}
      />

      {/* TABLE */}
      <CustomerTable
        customers={customers}
        loading={loading}
        onEdit={openEditModal}
        onDelete={(id) => {
          const customer = customers.find((c) => c.id === id);

          if (!customer) return;

          setCustomerToDelete(customer);
          setConfirmOpen(true);
        }}
      />

      {/* ADD / EDIT MODAL */}
      <CustomerModal
        open={isModalOpen}
        customer={selectedCustomer}
        onClose={closeModal}
        onSave={async (data) => {
          if (selectedCustomer) {
            await handleUpdate(data);
          } else {
            await handleCreate(data);
          }
        }}
      />

      {/* DELETE CONFIRMATION */}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Customer"
        message="Are you sure you want to delete this customer?"
        confirmText="Yes, Delete"
        cancelText="Cancel"
        onCancel={() => {
          setConfirmOpen(false);
          setCustomerToDelete(null);
        }}
        onConfirm={async () => {
          await handleDelete();
          setConfirmOpen(false);
        }}
      />

    </div>
  );
}

export default CustomersPage;