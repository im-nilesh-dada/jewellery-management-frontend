
import {
  IndianRupee,
  Package,
  ShoppingBag,
  AlertTriangle,
  Download,
  Plus,
  Gem,
  Coins,
  ArrowUpRight,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import StatCard from "../components/StatCard";

const salesData = [
  { day: "Mon", sales: 42000 },
  { day: "Tue", sales: 58000 },
  { day: "Wed", sales: 49000 },
  { day: "Thu", sales: 76000 },
  { day: "Fri", sales: 65000 },
  { day: "Sat", sales: 92000 },
  { day: "Sun", sales: 84000 },
];

const lowStockProducts = [
  {
    id: "JWL-1001",
    name: "Gold Necklace",
    category: "Necklaces",
    quantity: 2,
    status: "Low Stock",
  },
  {
    id: "JWL-1002",
    name: "Diamond Earrings",
    category: "Earrings",
    quantity: 1,
    status: "Critical",
  },
  {
    id: "JWL-1003",
    name: "Gold Bracelet",
    category: "Bracelets",
    quantity: 3,
    status: "Low Stock",
  },
  {
    id: "JWL-1004",
    name: "Silver Anklet",
    category: "Anklets",
    quantity: 0,
    status: "Out of Stock",
  },
];

const metalRates = [
  { name: "Gold 24K", purity: "99.9% purity", price: 14438, icon: "gold" },
  { name: "Gold 22K", purity: "91.6% purity", price: 13235, icon: "gold" },
  { name: "Gold 18K", purity: "75.0% purity", price: 10829, icon: "gold" },
  { name: "Silver", purity: "99.9% purity", price: 220, icon: "silver" },
];

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

function formatRupees(value) {
  return `₹${currencyFormatter.format(value)}`;
}

function Dashboard() {
  return (
    <div className="flex min-w-0 flex-col gap-6">

      {/* Page heading */}
      <section className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#292821]">
            Welcome, Admin
          </h2>
        </div>

        <div className="flex items-center gap-2.5 max-[480px]:w-full">
          <button
            type="button"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#e3dfd5] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#343229] transition-colors hover:bg-[#f3efe5] max-[480px]:flex-1"
          >
            <Download size={16} />
            Export
          </button>

          <button
            type="button"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#9a7837] bg-[#9a7837] px-3.5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#806127] max-[480px]:flex-1"
          >
            <Plus size={17} />
            Add Product
          </button>
        </div>
      </section>

      {/* Statistics */}
      <section
        aria-label="Business overview"
        className="grid grid-cols-1 gap-[17px] sm:grid-cols-2 xl:grid-cols-4"
      >
        <StatCard
          title="Today's Sales"
          value="₹1,24,500"
          icon={IndianRupee}
          trend="+12.5%"
        />

        <StatCard
          title="Total Products"
          value="1,248"
          icon={Package}
        />

        <StatCard
          title="Pending Orders"
          value="18"
          icon={ShoppingBag}
        />

        <StatCard
          title="Low Stock Items"
          value="7"
          icon={AlertTriangle}
          trendDirection="down"
        />
      </section>

      {/* Sales chart and metal rates */}
      <section className="grid grid-cols-1 items-stretch gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(300px,1fr)]">

        {/* Sales chart */}
        <article className="min-w-0 rounded-[14px] border border-[#ebe8e1] bg-white p-[22px] shadow-[0_2px_8px_rgba(38,34,22,0.02)] max-[768px]:p-4">
          <div className="mb-[22px] flex items-center justify-between gap-3">
            <div>
              <h3 className="text-[15px] font-semibold text-[#292821]">
                Sales Overview
              </h3>
              <p className="mt-1.5 text-[11px] leading-relaxed text-[#89867d]">
                Your sales performance over the last seven days
              </p>
            </div>

            <select
              defaultValue="7days"
              aria-label="Sales chart period"
              className="max-w-[145px] rounded-lg border border-[#e7e3da] bg-white px-2.5 py-2 text-[11px] text-[#555247] outline-none focus:border-[#9a7837]"
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
            </select>
          </div>

          <div className="h-[285px] w-full max-[768px]:h-[250px] max-[480px]:h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={salesData}
                margin={{ top: 10, right: 8, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="salesGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#b59651"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="#b59651"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  stroke="#eeeae2"
                  strokeDasharray="4 4"
                  vertical={false}
                />

                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#89867d", fontSize: 12 }}
                  dy={10}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#89867d", fontSize: 11 }}
                  tickFormatter={(value) => `₹${value / 1000}k`}
                  width={48}
                />

                <Tooltip
                  formatter={(value) => [formatRupees(value), "Sales"]}
                  contentStyle={{
                    border: "1px solid #ebe8e1",
                    borderRadius: "10px",
                    fontSize: "12px",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#9a7837"
                  strokeWidth={2.5}
                  fill="url(#salesGradient)"
                  activeDot={{ r: 5, fill: "#9a7837" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        {/* Today's metal rates */}
        <article className="min-w-0 rounded-[14px] border border-[#ebe8e1] bg-white p-[22px] shadow-[0_2px_8px_rgba(38,34,22,0.02)] max-[768px]:p-4">
          <div className="mb-[22px] flex items-center justify-between gap-3">
            <h3 className="text-[15px] font-semibold text-[#292821]">
              Today's Rate
            </h3>
            <Gem size={19} color="#9a7837" />
          </div>

          <div className="flex flex-col gap-3">
            {metalRates.map((metal) => (
              <div
                key={metal.name}
                className="flex items-center justify-between gap-2.5 rounded-[11px] border border-[#eeeae2] bg-white p-[13px_11px]"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <div
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-[10px] ${
                      metal.icon === "silver"
                        ? "bg-[#edf0f2] text-[#697783]"
                        : "bg-[#f5efdf] text-[#98732d]"
                    }`}
                  >
                    {metal.icon === "silver" ? (
                      <Coins size={20} />
                    ) : (
                      <Gem size={20} />
                    )}
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-[#343229]">
                      {metal.name}
                    </div>
                    <div className="mt-1 text-[10px] text-[#89867d]">
                      {metal.purity}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <div className="text-[13px] font-bold text-[#292821]">
                    {formatRupees(metal.price)}
                  </div>
                  <div className="mt-1 text-[10px] text-[#89867d]">
                    per gram
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      {/* Low stock products */}
      <section className="min-w-0 rounded-[14px] border border-[#ebe8e1] bg-white p-[22px] shadow-[0_2px_8px_rgba(38,34,22,0.02)] max-[768px]:p-4">
        <div className="mb-[22px] flex items-center justify-between gap-3 max-[480px]:flex-wrap">
          <div>
            <h3 className="text-[15px] font-semibold text-[#292821]">
              Low Stock Products
            </h3>
            <p className="mt-1.5 text-[11px] leading-relaxed text-[#89867d]">
              Items that may need replenishment
            </p>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-2 text-[11px] font-semibold text-[#8c6b2e] hover:bg-[#f5efdf]"
          >
            View inventory
            <ArrowUpRight size={15} />
          </button>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse text-left whitespace-nowrap">
            <thead>
              <tr>
                {["Product", "Category", "Available", "Status"].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="border-y border-[#ebe8e1] bg-[#faf9f6] px-3.5 py-[13px] text-[10px] font-bold uppercase tracking-[0.05em] text-[#77746b] first:rounded-tl-lg last:rounded-tr-lg"
                    >
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {lowStockProducts.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-[#fcfbf8]"
                >
                  <td className="border-b border-[#f0ede7] px-3.5 py-[13px] text-[11px] text-[#454238]">
                    <div className="flex items-center gap-2.5">
                      <div className="grid h-[37px] w-[37px] shrink-0 place-items-center rounded-[9px] bg-[#f5efdf] text-[#98732d]">
                        <Gem size={18} />
                      </div>

                      <div>
                        <div className="text-[11px] font-semibold text-[#302f28]">
                          {product.name}
                        </div>
                        <div className="mt-1 text-[10px] text-[#89867d]">
                          {product.id}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="border-b border-[#f0ede7] px-3.5 py-[13px] text-[11px] text-[#454238]">
                    {product.category}
                  </td>

                  <td className="border-b border-[#f0ede7] px-3.5 py-[13px] text-[11px] text-[#454238]">
                    {product.quantity}{" "}
                    {product.quantity === 1 ? "item" : "items"}
                  </td>

                  <td className="border-b border-[#f0ede7] px-3.5 py-[13px] text-[11px] text-[#454238]">
                    <span
                      className={`inline-flex items-center rounded-full px-[9px] py-[5px] text-[10px] font-semibold ${
                        product.status === "Critical"
                          ? "bg-[#fde8e7] text-[#b23a32]"
                          : product.status === "Out of Stock"
                            ? "bg-[#eeeaf5] text-[#6c4d91]"
                            : "bg-[#fff0d8] text-[#99651c]"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
