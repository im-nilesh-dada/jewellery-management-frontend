import {
  IndianRupee,
  CheckCircle2,
  Clock3,
  AlertCircle,
} from "lucide-react";

const PaymentStats = ({ payments }) => {
  const totalReceived = payments
    .filter((p) => p.status === "Completed")
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const totalPending = payments
    .filter((p) => p.status === "Pending")
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const totalFailed = payments
    .filter((p) => p.status === "Failed")
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const stats = [
    {
      title: "Total Received",
      value: totalReceived,
      icon: IndianRupee,
      iconStyle: "bg-green-50 text-green-700",
      description: "Successfully collected",
    },
    {
      title: "Pending Payments",
      value: totalPending,
      icon: Clock3,
      iconStyle: "bg-amber-50 text-amber-700",
      description: "Awaiting confirmation",
    },
    {
      title: "Failed Payments",
      value: totalFailed,
      icon: AlertCircle,
      iconStyle: "bg-red-50 text-red-700",
      description: "Unsuccessful transactions",
    },
    {
      title: "Total Transactions",
      value: payments.length,
      icon: CheckCircle2,
      iconStyle: "bg-blue-50 text-blue-700",
      description: "All recorded transactions",
      isCount: true,
    },
  ];

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

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
                  {stat.isCount
                    ? stat.value
                    : formatCurrency(stat.value)}
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

export default PaymentStats;