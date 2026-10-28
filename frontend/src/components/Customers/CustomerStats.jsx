import {
  Users,
  UserCheck,
  UserRoundPlus,
  ShoppingBag,
} from "lucide-react";

const cards = [
  {
    key: "total",
    label: "Total Customers",
    icon: Users,
  },
  {
    key: "active",
    label: "Active Customers",
    icon: UserCheck,
  },
  {
    key: "newThisMonth",
    label: "New This Month",
    icon: UserRoundPlus,
  },
  {
    key: "withOrders",
    label: "Customers With Orders",
    icon: ShoppingBag,
  },
];

const CustomerStats = ({ customers }) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const stats = {
    total: customers.length,

    active: customers.filter(
      (customer) => customer.status === "Active",
    ).length,

    newThisMonth: customers.filter((customer) => {
      const date = new Date(`${customer.createdAt}T00:00:00`);

      return (
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      );
    }).length,

    withOrders: customers.filter(
      (customer) => customer.orders.length > 0,
    ).length,
  };

  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {cards.map(({ key, label, icon: Icon }) => (
        <div
          key={key}
          className="rounded-xl border border-[#ebe8e1] bg-white p-4 sm:p-5"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-stone-500">{label}</p>

              <h3 className="mt-2 text-2xl font-semibold text-[#292821]">
                {stats[key]}
              </h3>
            </div>

            <div className="rounded-lg bg-[#f7f2e8] p-2.5">
              <Icon size={20} className="text-[#9a7837]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomerStats;