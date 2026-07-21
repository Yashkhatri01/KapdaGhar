import { useEffect, useState } from "react";

import PageHeader from "../../../components/shared/pageheader/PageHeader";
import Button from "../../../components/ui/button/Button";

import CustomerReturnsTable from "../components/CustomerReturnsTable";
import ViewCustomerReturnModal from "../components/ViewCustomerReturnModal";

import {
  getCustomerReturns,
  getCustomerReturn,
} from "../api/returnsApi";

function CustomerReturnsHistoryPage() {
  const [returns, setReturns] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedReturn, setSelectedReturn] =
    useState<any>(null);

  const [viewOpen, setViewOpen] = useState(false);

  async function loadReturns() {
    setLoading(true);

    try {
      const data = await getCustomerReturns();

      setReturns(data || []);
    } finally {
      setLoading(false);
    }
  }

  async function openReturnDetails(id: number) {
    const data = await getCustomerReturn(id);

    setSelectedReturn(data);
    setViewOpen(true);
  }

  useEffect(() => {
    loadReturns();
  }, []);

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex items-center justify-between gap-4">

        <PageHeader
          title="Customer Returns History"
          subtitle="Sabhi customer returns dekhein"
        />

        <Button
          variant="primary"
          onClick={() => window.history.back()}
          className="
            shrink-0
            rounded-xl
            transition-all
            duration-200
            hover:-translate-y-0.5
            hover:shadow-md
          "
        >
          ← Back to Customer Returns
        </Button>

      </div>

      {/* RETURNS TABLE */}

      <CustomerReturnsTable
        returns={returns}
        loading={loading}
        onView={openReturnDetails}
      />

      {/* VIEW MODAL */}

      <ViewCustomerReturnModal
        open={viewOpen}
        data={selectedReturn}
        onClose={() => setViewOpen(false)}
      />

    </div>
  );
}

export default CustomerReturnsHistoryPage;