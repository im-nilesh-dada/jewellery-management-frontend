import {
  Package,
  CheckCircle2,
  CircleX,
  Layers3,
} from "lucide-react";

const statConfig = [
  {
    key: "total",
    label: "Total Products",
    icon: Package,
    iconStyle: "bg-[#f5f0e5] text-[#9a7837]",
  },
  {
    key: "active",
    label: "Active Products",
    icon: CheckCircle2,
    iconStyle: "bg-green-50 text-green-700",
  },
  {
    key: "inactive",
    label: "Inactive Products",
    icon: CircleX,
    iconStyle: "bg-gray-100 text-gray-600",
  },
  {
    key: "categories",
    label: "Categories",
    icon: Layers3,
    iconStyle: "bg-blue-50 text-blue-700",
  },
];

function ProductStats({ products }) {
  const stats = {
    total: products.length,
    active: products.filter((product) => product.status === "Active").length,
    inactive: products.filter((product) => product.status === "Inactive").length,
    categories: new Set(products.map((product) => product.category)).size,
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

              <p className="mt-0.5 text-xl font-semibold leading-tight text-[#292821]">
                {stats[stat.key]}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ProductStats;