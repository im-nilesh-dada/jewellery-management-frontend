import {
  IndianRupee,
  ShoppingBag,
  TrendingUp,
  Package,
} from "lucide-react";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const SalesReportStats = ({ sales }) => {
  const completedSales = sales.filter(
    (sale) => sale.status === "Completed"
  );

  const totalRevenue = completedSales.reduce(
    (sum, sale) => sum + Number(sale.amount || 0),
    0
  );

  const totalOrders = completedSales.length;

  const averageOrderValue =
    totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const totalUnits = completedSales.reduce(
    (sum, sale) => sum + Number(sale.itemsCount || 0),
    0
  );

  const stats = [
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      description: "Revenue from completed sales",
      icon: IndianRupee,
      iconStyle: "bg-green-50 text-green-700",
    },
    {
      title: "Total Orders",
      value: totalOrders.toLocaleString("en-IN"),
      description: "Completed orders",
      icon: ShoppingBag,
      iconStyle: "bg-blue-50 text-blue-700",
    },
    {
      title: "Average Order Value",
      value: formatCurrency(averageOrderValue),
      description: "Average completed order",
      icon: TrendingUp,
      iconStyle: "bg-purple-50 text-purple-700",
    },
    {
      title: "Items Sold",
      value: totalUnits.toLocaleString("en-IN"),
      description: "Units in completed orders",
      icon: Package,
      iconStyle: "bg-amber-50 text-amber-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="rounded-xl border border-[#ebe8e1] bg-white p-4 shadow-sm sm:p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {stat.title}
                </p>

                <h3 className="mt-2 text-xl font-semibold text-gray-900 sm:text-2xl">
                  {stat.value}
                </h3>
              </div>

              <div className={`rounded-lg p-2.5 ${stat.iconStyle}`}>
                <Icon size={20} />
              </div>
            </div>

            <p className="mt-3 text-xs text-gray-400">
              {stat.description}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default SalesReportStats;