type Props = {
  revenue: number;
  purchases: number;
  profit: number;
  margin: number;
  inventoryValue: number;
};

function SummaryCards({
  revenue,
  purchases,
  profit,
  margin,
  inventoryValue,
}: Props) {

  const cards = [

    {
      title: "Revenue",
      subtitle: "Total Sales",
      value: `₹${revenue.toLocaleString()}`,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },

    {
      title: "Purchases",
      subtitle: "Stock Buying",
      value: `₹${purchases.toLocaleString()}`,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },

    {
      title: "Profit",
      subtitle: "Gross Profit",
      value: `₹${profit.toLocaleString()}`,
      color: "text-green-600",
      bg: "bg-green-50",
    },

    {
      title: "Margin",
      subtitle: "Profit %",
      value: `${margin}%`,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },

    {
      title: "Inventory",
      subtitle: "Stock Value",
      value: `₹${inventoryValue.toLocaleString()}`,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },

  ];

  return (

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">

      {cards.map((card) => (

        <div
          key={card.title}
          className={`${card.bg} rounded-xl border p-5`}
        >

          <p className="text-sm text-gray-500">

            {card.title}

          </p>

          <h2
            className={`mt-2 text-2xl font-bold ${card.color}`}
          >

            {card.value}

          </h2>

          <p className="mt-2 text-sm text-gray-600">

            {card.subtitle}

          </p>

        </div>

      ))}

    </div>

  );

}

export default SummaryCards;