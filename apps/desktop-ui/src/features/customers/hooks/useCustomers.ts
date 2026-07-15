import { useEffect, useMemo, useState } from "react";

import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../api/customerApi";

import type { Customer, CustomerPayload } from "../types/customer";

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);

  const [customerToDelete, setCustomerToDelete] =
    useState<Customer | null>(null);

  async function loadCustomers() {
    setLoading(true);

    try {
      const data = await getCustomers();
      setCustomers(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  async function handleCreate(payload: CustomerPayload) {
    await createCustomer(payload);
    await loadCustomers();
    setIsModalOpen(false);
  }

  async function handleUpdate(payload: CustomerPayload) {
    if (!selectedCustomer) return;

    await updateCustomer(selectedCustomer.id, payload);

    await loadCustomers();

    setSelectedCustomer(null);
    setIsModalOpen(false);
  }

  async function handleDelete() {
    if (!customerToDelete) return;

    await deleteCustomer(customerToDelete.id);

    await loadCustomers();

    setCustomerToDelete(null);
  }

  function openCreateModal() {
    setSelectedCustomer(null);
    setIsModalOpen(true);
  }

  function openEditModal(customer: Customer) {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  }

  function closeModal() {
    setSelectedCustomer(null);
    setIsModalOpen(false);
  }

  const filteredCustomers = useMemo(() => {
    const keyword = search.toLowerCase();

    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(keyword) ||
        (customer.phone ?? "").includes(search)
    );
  }, [customers, search]);

  return {
  loading,

  search,
  setSearch,

  customers: filteredCustomers,

  isModalOpen,

  selectedCustomer,

  customerToDelete,
  setCustomerToDelete,

  openCreateModal,
  openEditModal,
  closeModal,

  handleCreate,
  handleUpdate,
  handleDelete,
};
}