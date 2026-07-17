import {

ResponsiveContainer,

LineChart,

Line,

XAxis,

YAxis,

Tooltip,

CartesianGrid,

Legend

} from "recharts";

import type {

RevenuePurchase

} from "../api/reportsApi";

type Props={

data:RevenuePurchase[];

};

function RevenuePurchaseChart({

data

}:Props){

return(

<div className="bg-white border rounded-xl p-5">

<h2 className="text-lg font-semibold">

Revenue vs Purchase

</h2>

<p className="text-sm text-gray-500 mb-5">

Monthly comparison

</p>

<div className="h-80">


<ResponsiveContainer width="100%" height={300}>
  <LineChart
    width={600}
    height={300}
    data={data}
    margin={{
      top: 20,
      right: 20,
      left: 20,
      bottom: 5,
    }}
  >
    <CartesianGrid strokeDasharray="3 3" />

    <XAxis dataKey="label" />

    <YAxis />

    <Tooltip
  formatter={(value:number)=>
    `₹${value.toLocaleString()}`
  }
/>

    <Legend />

    <Line
      dataKey="revenue"
      name="Revenue"
      stroke="#2563eb"
      strokeWidth={2}
      isAnimationActive={false}
    />

    <Line
      dataKey="purchase"
      name="Purchase"
      stroke="#f97316"
      strokeWidth={2}
      isAnimationActive={false}
    />
  </LineChart>
</ResponsiveContainer>

</div>

</div>

);

}

export default RevenuePurchaseChart;