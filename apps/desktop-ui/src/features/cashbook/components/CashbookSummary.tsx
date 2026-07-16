import {
  ArrowDownCircle,
  ArrowUpCircle,
  Wallet,
  Receipt,
} from "lucide-react";

import type {
  CashbookSummary as Summary,
} from "../api/cashbookApi";

type Props = {
  summary: Summary;
};

function CashbookSummary({
  summary,
}: Props) {
  const cards = [
    {
      title: "Income",
      subtitle: "Aaya Hua Paisa",
      value: summary.income,
      icon: ArrowDownCircle,
      color:
        "bg-green-100 text-green-700",
    },
    {
      title: "Expense",
      subtitle: "Gaya Hua Paisa",
      value: summary.expense,
      icon: ArrowUpCircle,
      color:
        "bg-red-100 text-red-700",
    },
    {
      title: "Net Cash Flow",
      subtitle: "Final Balance",
      value: summary.net,
      icon: Wallet,
      color:
        "bg-blue-100 text-blue-700",
    },
    {
      title: "Transactions",
      subtitle: "Total Entries",
      value: summary.transactions,
      icon: Receipt,
      color:
        "bg-purple-100 text-purple-700",
      isCount: true,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

      {cards.map((card) => {

        const Icon = card.icon;

        return (

          <div
            key={card.title}
            className="bg-white border rounded-lg p-5"
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  {card.title}
                </p>

                <h3 className="font-semibold">
                  {card.subtitle}
                </h3>

              </div>

              <div
                className={`p-3 rounded-full ${card.color}`}
              >
                <Icon size={22} />
              </div>

            </div>

            <p className="text-3xl font-bold mt-5">

              {card.isCount
                ? card.value
                : `₹${Number(card.value).toLocaleString()}`}

            </p>

          </div>

        );

      })}

    </div>
  );
}

export default CashbookSummary;