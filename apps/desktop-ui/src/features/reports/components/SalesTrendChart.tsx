import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import type { SalesTrend } from "../api/reportsApi";

type Props = {
  data: SalesTrend[];
};

function SalesTrendChart({
  data,
}: Props) {

  return (

    <div className="bg-white border rounded-xl p-5">

      <h2 className="text-lg font-semibold">
        Monthly Revenue
      </h2>

      <p className="text-sm text-gray-500 mb-5">
        Revenue trend for current year
      </p>

      <div className="h-80">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <BarChart
            data={data}
          >

            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="label"
            />

            <YAxis />

            <Tooltip
              formatter={(value:number)=>
                `₹${value.toLocaleString()}`
              }
            />

            <Bar
              dataKey="revenue"
              radius={[8,8,0,0]}
              fill="#2563eb"
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

}

export default SalesTrendChart;