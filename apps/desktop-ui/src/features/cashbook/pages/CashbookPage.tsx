import { useEffect, useState } from "react";

import PageHeader from "../../../components/shared/pageheader/PageHeader";

import CashbookFilters from "../components/CashbookFilters";
import CashbookSummary from "../components/CashbookSummary";
import CashbookTable from "../components/CashbookTable";

import {
  getCashbook,
  getCashbookSummary,
  type CashbookEntry,
  type CashbookSummary as Summary,
} from "../api/cashbookApi";

function CashbookPage() {

  const today = new Date();

  const [year, setYear] = useState(
    today.getFullYear()
  );

  const [month, setMonth] = useState(
    today.getMonth() + 1
  );

  const [day, setDay] = useState(
    today.getDate()
  );

  const [entries, setEntries] =
    useState<CashbookEntry[]>([]);

  const [summary, setSummary] =
    useState<Summary>({
      income: 0,
      expense: 0,
      net: 0,
      transactions: 0,
    });

  const [loading, setLoading] =
    useState(false);

  // Keep selected day valid whenever month/year changes
  useEffect(() => {

    const now = new Date();

    let maxDay = 31;

    if (month !== 0) {

      if (
        year === now.getFullYear() &&
        month === now.getMonth() + 1
      ) {

        maxDay = now.getDate();

      } else {

        maxDay = new Date(
          year,
          month,
          0
        ).getDate();

      }

    }

    if (day > maxDay) {
      setDay(maxDay);
    }

  }, [
    year,
    month,
    day,
  ]);

  useEffect(() => {
    loadData();
  }, [
    year,
    month,
    day,
  ]);

  async function loadData() {

    try {

      setLoading(true);

      const filters = {
        year,
        month,
        day,
      };

      const [cashbook, totals] =
        await Promise.all([
          getCashbook(filters),
          getCashbookSummary(filters),
        ]);

      setEntries(cashbook);

      setSummary(totals);

    } finally {

      setLoading(false);

    }

  }

  return (
    <div className="space-y-6">

      <PageHeader
        title="Cash Book"
        subtitle="Roz ki income aur expense ka poora hisaab"
      />

      <CashbookFilters
        year={year}
        month={month}
        day={day}
        onYearChange={setYear}
        onMonthChange={setMonth}
        onDayChange={setDay}
      />

      <CashbookSummary
        summary={summary}
      />

      <CashbookTable
        entries={entries}
        loading={loading}
      />

    </div>
  );
}

export default CashbookPage;