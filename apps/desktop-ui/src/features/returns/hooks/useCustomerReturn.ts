import { useMemo, useState } from "react";

export type ReturnItem = {
  sale_item_id: number;

  inventory_id: number;

  item_name: string;

  quantitySold: number;

  alreadyReturned: number;

  quantity: number;

  selling_price: number;
};

export function useCustomerReturn() {

  const [sale, setSale] = useState<any>(null);

  const [items, setItems] =
    useState<ReturnItem[]>([]);

  const [returnType, setReturnType] =
    useState<"REFUND" | "EXCHANGE">(
      "REFUND"
    );

  const [notes, setNotes] =
    useState("");

  const totals = useMemo(() => {

    const totalItems = items.reduce(
      (sum, i) => sum + i.quantity,
      0
    );

    const refundAmount = items.reduce(
      (sum, i) =>
        sum +
        i.quantity *
          i.selling_price,
      0
    );

    return {
      totalItems,
      refundAmount,
    };

  }, [items]);

  return {

    sale,
    setSale,

    items,
    setItems,

    returnType,
    setReturnType,

    notes,
    setNotes,

    totals,

  };
}