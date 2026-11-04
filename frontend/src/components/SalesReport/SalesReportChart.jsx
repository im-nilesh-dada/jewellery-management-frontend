import { TrendingUp } from "lucide-react";

const SalesReportChart = ({ sales }) => {
  const completedSales = sales.filter(
    (sale) => sale.status === "Completed"
  );

  const monthlyData = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - (5 - index));

    const year = date.getFullYear();
    const month = date.getMonth();

    const amount = completedSales
      .filter((sale) => {
        const saleDate = new Date(`${sale.date}T00:00:00`);
        return (
          saleDate.getFullYear() === year &&
          saleDate.getMonth() === month
        );
      })
      .reduce((sum, sale) => sum + Number(sale.amount || 0), 0);

    return {
      label: date.toLocaleDateString("en-IN", {
        month: "short",
      }),
      amount,
    };
  });

  const maxAmount = Math.max(
    ...monthlyData.map((item) => item.amount),
    1
  );

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);

  return (
    <div className="rounded-xl border border-[#ebe8e1] bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">
            Sales Overview
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            Monthly revenue from completed orders
          </p>
        </div>

        <span className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700">
          <TrendingUp size={14} />
          Revenue trend
        </span>
      </div>

      <div className="mt-6 flex h-56 items-end gap-3 border-b border-[#ebe8e1] px-1 sm:gap-5">
        {monthlyData.map((item, index) => {
          const height =
            item.amount > 0
              ? Math.max((item.amount / maxAmount) * 100, 4)
              : 2;

          return (
            <div
              key={`${item.label}-${index}`}
              className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
            >
              <span className="whitespace-nowrap text-[10px] text-gray-500 sm:text-xs">
                {item.amount > 0 ? `₹${formatCurrency(item.amount)}` : "—"}
              </span>

              <div
                className="group relative flex w-full max-w-12 items-end overflow-hidden rounded-t-md bg-[#f3efe6]"
                style={{ height: "70%" }}
              >
                <div
                  title={`${item.label}: ₹${item.amount.toLocaleString("en-IN")}`}
                  className="w-full rounded-t-md bg-[#9a7837] transition-all duration-300 group-hover:bg-[#806127]"
                  style={{ height: `${height}%` }}
                />
              </div>

              <span className="pb-2 text-xs font-medium text-gray-500">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-xs text-gray-400">
        Displays the current month and previous five months.
      </p>
    </div>
  );
};

export default SalesReportChart;