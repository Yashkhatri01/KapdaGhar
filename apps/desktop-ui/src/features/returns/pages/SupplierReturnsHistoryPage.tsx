import { useEffect, useState } from "react";

import PageHeader from "../../../components/shared/pageheader/PageHeader";

import SupplierReturnsTable from "../components/SupplierReturnsTable";
import ViewSupplierReturnModal from "../components/ViewSupplierReturnModal";

import {
  getSupplierReturns,
  getSupplierReturn,
} from "../api/returnsApi";

function SupplierReturnsHistoryPage() {

  const [returns, setReturns] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [selectedReturn, setSelectedReturn] =
    useState<any>(null);

  const [viewOpen, setViewOpen] =
    useState(false);

  async function loadReturns() {

    setLoading(true);

    try {

      const data =
        await getSupplierReturns();

      setReturns(data || []);

    } finally {

      setLoading(false);

    }

  }

  async function openReturnDetails(
    id: number
  ) {

    const data =
      await getSupplierReturn(id);

    setSelectedReturn(data);

    setViewOpen(true);

  }

  useEffect(() => {

    loadReturns();

  }, []);

  return (

    <div className="space-y-6">

      <PageHeader
        title="Supplier Returns History"
        subtitle="Supplier ko kiye gaye sabhi returns dekhein"
      />

      <SupplierReturnsTable
        returns={returns}
        loading={loading}
        onView={openReturnDetails}
      />

      <ViewSupplierReturnModal
        open={viewOpen}
        data={selectedReturn}
        onClose={() =>
          setViewOpen(false)
        }
      />

    </div>

  );

}

export default SupplierReturnsHistoryPage;