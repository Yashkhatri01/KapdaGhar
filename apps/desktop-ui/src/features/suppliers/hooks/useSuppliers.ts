import { useEffect, useMemo, useState } from "react";

import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../api/supplierApi";

import type {
  Supplier,
  SupplierPayload,
} from "../types/supplier";

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedSupplier, setSelectedSupplier] =
    useState<Supplier | null>(null);

  const [supplierToDelete, setSupplierToDelete] =
    useState<Supplier | null>(null);

  async function loadSuppliers() {
    setLoading(true);

    try {
      const data = await getSuppliers();
      setSuppliers(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSuppliers();
  }, []);

  async function handleCreate(
    payload: SupplierPayload
  ) {
    await createSupplier(payload);

    await loadSuppliers();

    setIsModalOpen(false);
  }

  async function handleUpdate(
    payload: SupplierPayload
  ) {
    if (!selectedSupplier) return;

    await updateSupplier(
      selectedSupplier.id,
      payload
    );

    await loadSuppliers();

    setSelectedSupplier(null);
    setIsModalOpen(false);
  }

  async function handleDelete() {
    if (!supplierToDelete) return;

    await deleteSupplier(supplierToDelete.id);

    await loadSuppliers();

    setSupplierToDelete(null);
  }

  function openCreateModal() {
    setSelectedSupplier(null);
    setIsModalOpen(true);
  }

  function openEditModal(
    supplier: Supplier
  ) {
    setSelectedSupplier(supplier);
    setIsModalOpen(true);
  }

  function closeModal() {
    setSelectedSupplier(null);
    setIsModalOpen(false);
  }

  const filteredSuppliers = useMemo(() => {
    const keyword = search.toLowerCase();

    return suppliers.filter(
      (supplier) =>
        supplier.name
          .toLowerCase()
          .includes(keyword) ||
        (supplier.phone ?? "").includes(search) ||
        (supplier.address ?? "")
          .toLowerCase()
          .includes(keyword)
    );
  }, [suppliers, search]);

  return {
    loading,

    search,
    setSearch,

    suppliers: filteredSuppliers,

    isModalOpen,

    selectedSupplier,

    supplierToDelete,
    setSupplierToDelete,

    openCreateModal,
    openEditModal,
    closeModal,

    handleCreate,
    handleUpdate,
    handleDelete,
  };
}