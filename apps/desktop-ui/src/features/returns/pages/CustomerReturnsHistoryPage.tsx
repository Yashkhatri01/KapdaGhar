import { useEffect, useState } from "react";

import PageHeader from "../../../components/shared/pageheader/PageHeader";

import CustomerReturnsTable from "../components/CustomerReturnsTable";
import ViewCustomerReturnModal from "../components/ViewCustomerReturnModal";

import {
  getCustomerReturns,
  getCustomerReturn,
} from "../api/returnsApi";

function CustomerReturnsHistoryPage() {

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
        await getCustomerReturns();

      setReturns(data || []);

    } finally {

      setLoading(false);

    }

  }

  async function openReturnDetails(
    id: number
  ) {

    const data =
      await getCustomerReturn(id);

    setSelectedReturn(data);

    setViewOpen(true);

  }

  useEffect(() => {
    loadReturns();

  }, []);

  return (

    <div className="space-y-6">

      <PageHeader
        title="Customer Returns History"
        subtitle="Sabhi customer returns dekhein"
      />

      <CustomerReturnsTable
        returns={returns}
        loading={loading}
        onView={openReturnDetails}
      />

      <ViewCustomerReturnModal
        open={viewOpen}
        data={selectedReturn}
        onClose={() =>
          setViewOpen(false)
        }
      />

    </div>

  );

}

export default CustomerReturnsHistoryPage;