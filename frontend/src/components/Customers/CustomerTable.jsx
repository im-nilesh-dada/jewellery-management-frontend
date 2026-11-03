import {
  Eye,
  Pencil,
  Power,
  Trash2,
  ShoppingBag,
} from "lucide-react";
import CustomerStatusBadge from "./CustomerStatusBadge";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const CustomerTable = ({
  customers,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  if (customers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="rounded-full bg-[#f7f2e8] p-4">
          <ShoppingBag size={25} className="text-[#9a7837]" />
        </div>

        <h3 className="mt-4 text-base font-semibold text-[#292821]">
          No customers found
        </h3>

        <p className="mt-1 max-w-sm text-sm text-stone-500">
          Try changing your search or filters, or register a new customer.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto overscroll-x-contain">
      <table className="w-full min-w-[1050px] text-left">
        <thead className="border-b border-[#ebe8e1] bg-[#faf9f6]">
          <tr className="text-xs font-semibold uppercase tracking-wide text-stone-500">
            <th className="px-5 py-4">Customer</th>
            <th className="px-5 py-4">Contact</th>
            <th className="px-5 py-4">Location</th>
            <th className="px-5 py-4">Orders</th>
            <th className="px-5 py-4">Total Purchases</th>
            <th className="px-5 py-4">Status</th>
            <th className="px-5 py-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[#f0ede7]">
          {customers.map((customer) => {
            const totalPurchases = customer.orders.reduce(
              (total, order) => total + Number(order.amount || 0),
              0,
            );

            return (
              <tr
                key={customer.customerId}
                className="transition hover:bg-[#fcfbf8]"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f2ead9] text-sm font-semibold text-[#8b6c31]">
                      {customer.name
                        .split(" ")
                        .map((part) => part[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </div>

                    <div>
                      <button
                        type="button"
                        onClick={() => onView(customer)}
                        className="text-sm font-semibold text-[#292821] hover:text-[#9a7837]"
                      >
                        {customer.name}
                      </button>

                      <p className="mt-1 text-xs text-stone-500">
                        {customer.customerId}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <p className="text-sm text-stone-700">
                    {customer.phone}
                  </p>

                  <p className="mt-1 text-xs text-stone-500">
                    {customer.email || "No email"}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <p className="text-sm text-stone-700">
                    {customer.city || "—"}
                  </p>

                  <p className="mt-1 text-xs text-stone-500">
                    {customer.state || "—"}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <span className="inline-flex items-center rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-700">
                    {customer.orders.length}
                  </span>
                </td>

                <td className="px-5 py-4 text-sm font-medium text-[#292821]">
                  {formatCurrency(totalPurchases)}
                </td>

                <td className="px-5 py-4">
                  <CustomerStatusBadge status={customer.status} />
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      title="View customer and purchase history"
                      aria-label={`View ${customer.name}`}
                      onClick={() => onView(customer)}
                      className="rounded-lg p-2 text-stone-500 transition hover:bg-[#f7f2e8] hover:text-[#9a7837]"
                    >
                      <Eye size={17} />
                    </button>

                    <button
                      type="button"
                      title="Edit customer"
                      aria-label={`Edit ${customer.name}`}
                      onClick={() => onEdit(customer)}
                      className="rounded-lg p-2 text-stone-500 transition hover:bg-blue-50 hover:text-blue-700"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      title={
                        customer.status === "Active"
                          ? "Deactivate customer"
                          : "Activate customer"
                      }
                      aria-label={`Change status for ${customer.name}`}
                      onClick={() => onToggleStatus(customer)}
                      className="rounded-lg p-2 text-stone-500 transition hover:bg-amber-50 hover:text-amber-700"
                    >
                      <Power size={16} />
                    </button>

                    <button
                      type="button"
                      title="Delete customer"
                      aria-label={`Delete ${customer.name}`}
                      onClick={() => onDelete(customer)}
                      className="rounded-lg p-2 text-stone-500 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;