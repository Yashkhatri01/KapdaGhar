import api from "../../../config/api";

export type CashbookEntry = {
  id: number;

  transaction_type: string;

  amount: number;

  description: string;

  reference_type: string | null;

  reference_id: number | null;

  created_at: string;
};

export type CashbookSummary = {
  income: number;
  expense: number;
  net: number;
  transactions: number;
};

type Filters = {
  year: number;
  month: number;
  day: number;
};

export async function getCashbook(
  filters: Filters
) {

  const res = await api.get(
    "/cashbook",
    {
      params: filters,
    }
  );

  return res.data.data;

}

export async function getCashbookSummary(
  filters: Filters
) {

  const res = await api.get(
    "/cashbook/summary",
    {
      params: filters,
    }
  );

  return res.data.data;

}