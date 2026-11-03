import {
  Coins,
  Gem,
  CircleDollarSign,
  Clock3,
} from "lucide-react";

const statConfig = [
  {
    key: "active",
    label: "Active Rates",
    icon: Coins,
    iconStyle: "bg-[#f5f0e5] text-[#9a7837]",
  },
  {
    key: "gold",
    label: "Active Gold Rates",
    icon: Gem,
    iconStyle: "bg-amber-50 text-amber-700",
  },
  {
    key: "silver",
    label: "Active Silver Rates",
    icon: CircleDollarSign,
    iconStyle: "bg-gray-100 text-gray-600",
  },
  {
    key: "updated",
    label: "Latest Update",
    icon: Clock3,
    iconStyle: "bg-blue-50 text-blue-700",
  },
];

function MetalRateStats({ rates }) {
  const activeRates = rates.filter((rate) => rate.status === "Active");

  const latestRate = [...rates].sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  )[0];

  const stats = {
    active: activeRates.length,
    gold: activeRates.filter((rate) => rate.metalType === "Gold").length,
    silver: activeRates.filter((rate) => rate.metalType === "Silver").length,
    updated: latestRate
      ? new Date(latestRate.updatedAt).toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—",
  };

  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {statConfig.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.key}
            className="flex min-w-0 items-center gap-3 rounded-xl border border-[#ebe8e1] bg-white px-4 py-3 shadow-sm"
          >
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${stat.iconStyle}`}
            >
              <Icon size={18} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-xs text-gray-500">
                {stat.label}
              </p>

              <p
                className={`mt-0.5 truncate font-semibold leading-tight text-[#292821] ${
                  stat.key === "updated" ? "text-base" : "text-xl"
                }`}
              >
                {stats[stat.key]}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MetalRateStats;