import React from "react";
import { PieChart, Pie, Tooltip } from "recharts";

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const data = payload[0].payload;

  return (
    <div className="rounded-md border border-black/10 bg-white px-3 py-2 shadow-md">
      <p className="text-sm font-medium text-[#26382F]">
        {data.name}
      </p>
      <p className="text-sm">
        {data.sign ? data.sign : ""}${data.value.toLocaleString()}
      </p>
    </div>
  );
};

type DonutChartMonthlySavingsProps = {
  saved: number;
  total: number;
  currentDate: string;
};

export default function DonutChartMonthlySavings({
  saved,
  total,
  currentDate,
}: DonutChartMonthlySavingsProps) {
  const savedAbsolute = Math.abs(saved)
  const percentage = Math.min(Math.abs(saved) / total, 1);
  const savedAngle = percentage * 360;

  const savedData = [{name: "Saved This Month", sign: saved >= 0 ? "" : "-", value: savedAbsolute,},];
  const totalData = [{name: "Total", value: total,},];

  return (
    <div className="relative mx-auto h-75 w-75">
      <PieChart width={300} height={300}>
        {/* Full gray background */}
        <Pie
          data={totalData}
          innerRadius={80}
          outerRadius={110}
          dataKey="value"
          startAngle={90}
          endAngle={saved >= 0 ? -270 : 450}
          fill="#E5E1E1"
          stroke="none"
        />

        {/* Savings */}
        <Pie
          data={savedData}
          innerRadius={80}
          outerRadius={110}
          dataKey="value"
          startAngle={90}
          endAngle={saved >= 0 ? 90 - savedAngle : 90 + savedAngle}
          fill={saved >= 0 ? "#26382F" : "#B91C1C"}
          stroke="none"
        />
        <Tooltip content={<CustomTooltip />} />
    </PieChart>

      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <h1 className="text-sm">
          Saved
        </h1>

        <p className={`font-bold text-4xl ${saved >= 0 ? "text-[#26382F]" : "text-red-700"}`}>
          {Math.round(saved/total * 100)}%
        </p>
        <p className="text-sm">in {currentDate}</p>
      </div>
    </div>
  );
}