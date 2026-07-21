import { useEffect, useState } from "react";

import PageHeader from "../../../components/shared/pageheader/PageHeader";
import Button from "../../../components/ui/button/Button";

import SupplierReturnsTable from "../components/SupplierReturnsTable";
import ViewSupplierReturnModal from "../components/ViewSupplierReturnModal";

import {
  getSupplierReturns,
  getSupplierReturn,
} from "../api/returnsApi";

function SupplierReturnsHistoryPage() {
  const [returns, setReturns] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedReturn, setSelectedReturn] =
    useState<any>(null);

  const [viewOpen, setViewOpen] = useState(false);

  async function loadReturns() {
    setLoading(true);

    try {
      const data = await getSupplierReturns();

      setReturns(data || []);
    } finally {
      setLoading(false);
    }
  }

  async function openReturnDetails(id: number) {
    const data = await getSupplierReturn(id);

    setSelectedReturn(data);
    setViewOpen(true);
  }

  useEffect(() => {
    loadReturns();
  }, []);

  return (
    <div className="space-y-6">

      {/* PAGE HEADER */}

      <div
        className="
          flex
          flex-col
          gap-4

          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >

        <PageHeader
          title="Supplier Returns History"
          subtitle="Supplier ko kiye gaye sabhi returns dekhein"
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
          ← Back to Supplier Returns
        </Button>

      </div>

      {/* RETURNS TABLE */}

      <div
        className="
          transition-all
          duration-300
          hover:shadow-sm
        "
      >
        <SupplierReturnsTable
          returns={returns}
          loading={loading}
          onView={openReturnDetails}
        />
      </div>

      {/* VIEW RETURN MODAL */}

      <ViewSupplierReturnModal
        open={viewOpen}
        data={selectedReturn}
        onClose={() => setViewOpen(false)}
      />

    </div>
  );
}

export default SupplierReturnsHistoryPage;