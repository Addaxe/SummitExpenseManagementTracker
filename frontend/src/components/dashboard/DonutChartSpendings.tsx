import React from "react";
import { PieChart, Pie, Tooltip } from "recharts";

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;

  const { name, value } = payload[0].payload;

  return (
    <div className="rounded-md border border-black/10 bg-white px-3 py-2 shadow-md">
      <p className="text-sm font-medium text-[#26382F]">{name}</p>
      <p className="text-sm">${value.toLocaleString()}</p>
    </div>
  );
};

type DonutChartMonthlySavingsProps = {
  spent: number;
  total: number;
};

export default function DonutChartMonthlySavings({
  spent,
  total,
}: DonutChartMonthlySavingsProps) {
  const percentage = total > 0 ? Math.min(Math.max(spent, 0) / total, 1) : 0;

  return (
    <div className="relative mx-auto h-75 w-75">
      <PieChart width={300} height={300}>
        <Pie
          data={[{ name: "Total", value: total }]}
          innerRadius={85}
          outerRadius={110}
          dataKey="value"
          startAngle={90}
          endAngle={-270}
          fill="#E5E1E1"
          stroke="none"
        />

        <Pie
          data={[{ name: "Spent", value: Math.max(spent, 0) }]}
          innerRadius={85}
          outerRadius={110}
          dataKey="value"
          startAngle={90}
          endAngle={90 - percentage * 360}
          fill="#26382F"
          stroke="none"
          cornerRadius={15}
        />

        <Tooltip content={<CustomTooltip />} />
      </PieChart>

      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <p className="text-sm">Spent</p>
        <p className="text-4xl font-bold text-[#26382F]">
          {Math.round(percentage * 100)}%
        </p>
        <p className="text-sm">of ${total}</p>
      </div>
    </div>
  );
}
