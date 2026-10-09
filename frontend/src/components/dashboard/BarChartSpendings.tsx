import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from "recharts";

const data = [
  { category: "Software", spend: 8420 },
  { category: "Travel", spend: 4280 },
  { category: "Advertising", spend: 3920 },
  { category: "Meals", spend: 2140 },
  { category: "Office", spend: 1820 },
  { category: "Other", spend: 1520 },
];

const formatCurrency = (value: any) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

export default function SpendByCategory() {
  const totalSpend = data.reduce((sum, item) => sum + item.spend, 0);

  return (
    <div className="rounded-xl border border-[#E5EAE7] bg-white p-5">
      
      {/* Header */}
      <div className="mb-2 flex items-start justify-between">
        <div>
          <h3 className="text-[15px] font-semibold text-[#26332E]">
            Spend by Category
          </h3>

          <p className="mt-1 text-xs text-[#8A918E]">
            Monthly spending across categories
          </p>
        </div>

        <button
          className="
            flex items-center gap-2
            rounded-md
            border border-[#DFE5E1]
            bg-white
            px-3 py-1.5
            text-xs text-[#46524D]
            hover:bg-[#F7F9F8]
          "
        >
          This Month
          <span className="text-[#89918D]">⌄</span>
        </button>
      </div>

      {/* Chart */}
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{
              top: 8,
              right: 12,
              left: 10,
              bottom: 8,
            }}
          >
            <CartesianGrid
              horizontal={false}
              stroke="#EDF0EE"
            />

            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `$${value / 1000}k`}
              tick={{
                fill: "#9AA19E",
                fontSize: 11,
              }}
            />

            <YAxis
              type="category"
              dataKey="category"
              axisLine={false}
              tickLine={false}
              width={85}
              tick={{
                fill: "#46524D",
                fontSize: 12,
              }}
            />

            <Tooltip
              cursor={{ fill: "#F7F9F8" }}
              formatter={(value) => [
                formatCurrency(value),
                "Spend",
              ]}
              contentStyle={{
                border: "1px solid #E2E8E4",
                borderRadius: "8px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
                fontSize: "12px",
              }}
            />

            <Bar
              dataKey="spend"
              fill="#183D32"
              radius={[0, 5, 5, 0]}
              barSize={18}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      {/* <div className="mt-1 flex items-center justify-between border-t border-[#EDF0EE] pt-4">
        <div>
          <p className="text-[11px] text-[#8A918E]">
            Total Spend
          </p>

          <p className="mt-0.5 text-lg font-semibold text-[#26332E]">
            {formatCurrency(totalSpend)}
          </p>
        </div>

        <button
          className="
            text-xs
            font-semibold
            text-[#28715A]
            transition-colors
            hover:text-[#174D3C]
          "
        >
          View Details →
        </button>
      </div> */}
    </div>
  );
}
