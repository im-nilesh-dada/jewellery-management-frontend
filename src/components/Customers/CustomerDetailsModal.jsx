import { useEffect } from "react";
import {
  X,
  UserRound,
  Phone,
  Mail,
  MapPin,
  CalendarDays,
  ShoppingBag,
  ReceiptText,
} from "lucide-react";
import CustomerStatusBadge from "./CustomerStatusBadge";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(`${value}T00:00:00`);

  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(date);
};

const orderStatusClass = (status) => {
  switch (status) {
    case "Completed":
      return "bg-emerald-50 text-emerald-700";
    case "Pending":
      return "bg-amber-50 text-amber-700";
    case "Cancelled":
      return "bg-red-50 text-red-700";
    default:
      return "bg-stone-100 text-stone-600";
  }
};

const CustomerDetailsModal = ({ customer, onClose }) => {
  useEffect(() => {
    if (!customer) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [customer, onClose]);

  if (!customer) return null;

  const orders = customer.orders || [];

  const totalPurchases = orders.reduce(
    (total, order) => total + Number(order.amount || 0),
    0,
  );

  const completedOrders = orders.filter(
    (order) => order.status === "Completed",
  ).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="customer-details-title"
        className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#ebe8e1] bg-white px-5 py-4 sm:px-6">
          <div>
            <h2
              id="customer-details-title"
              className="text-lg font-semibold text-[#292821]"
            >
              Customer Profile
            </h2>

            <p className="mt-1 text-sm text-stone-500">
              Customer details, purchase history and invoices
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close customer profile"
            className="rounded-lg p-2 text-stone-500 hover:bg-stone-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          <section className="flex flex-col gap-4 rounded-xl border border-[#ebe8e1] bg-[#faf9f6] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#f0e5cf] text-lg font-semibold text-[#8b6c31]">
                {customer.name
                  .split(" ")
                  .map((part) => part[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#292821]">
                  {customer.name}
                </h3>

                <p className="mt-1 text-sm text-stone-500">
                  {customer.customerId}
                </p>

                <div className="mt-2">
                  <CustomerStatusBadge status={customer.status} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <div>
                <p className="text-xs text-stone-500">Total Orders</p>
                <p className="mt-1 text-xl font-semibold text-[#292821]">
                  {orders.length}
                </p>
              </div>

              <div>
                <p className="text-xs text-stone-500">Total Purchases</p>
                <p className="mt-1 text-xl font-semibold text-[#9a7837]">
                  {formatCurrency(totalPurchases)}
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold text-[#292821]">
              Contact Information
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-lg border border-[#ebe8e1] p-3">
                <Phone size={17} className="mt-0.5 text-[#9a7837]" />
                <div>
                  <p className="text-xs text-stone-500">Mobile Number</p>
                  <p className="mt-1 text-sm text-stone-800">
                    {customer.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-[#ebe8e1] p-3">
                <Mail size={17} className="mt-0.5 text-[#9a7837]" />
                <div className="min-w-0">
                  <p className="text-xs text-stone-500">Email Address</p>
                  <p className="mt-1 break-all text-sm text-stone-800">
                    {customer.email || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-[#ebe8e1] p-3 sm:col-span-2">
                <MapPin size={17} className="mt-0.5 shrink-0 text-[#9a7837]" />
                <div>
                  <p className="text-xs text-stone-500">Address</p>
                  <p className="mt-1 text-sm text-stone-800">
                    {[
                      customer.address,
                      customer.city,
                      customer.state,
                      customer.pincode,
                    ]
                      .filter(Boolean)
                      .join(", ") || "Address not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-[#ebe8e1] p-3 sm:col-span-2">
                <CalendarDays
                  size={17}
                  className="mt-0.5 text-[#9a7837]"
                />
                <div>
                  <p className="text-xs text-stone-500">Registered On</p>
                  <p className="mt-1 text-sm text-stone-800">
                    {formatDate(customer.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#292821]">
                  Purchase History
                </h3>

                <p className="mt-1 text-xs text-stone-500">
                  {completedOrders} completed{" "}
                  {completedOrders === 1 ? "order" : "orders"}
                </p>
              </div>

              <span className="text-sm font-medium text-[#9a7837]">
                {formatCurrency(totalPurchases)} total order value
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#dcd6ca] px-4 py-10 text-center">
                <ShoppingBag
                  size={25}
                  className="mx-auto text-stone-400"
                />

                <p className="mt-3 text-sm font-medium text-stone-700">
                  No purchase history
                </p>

                <p className="mt-1 text-xs text-stone-500">
                  Orders linked to this customer will appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-[#ebe8e1]">
                <table className="w-full min-w-[700px] text-left">
                  <thead className="border-b border-[#ebe8e1] bg-[#faf9f6]">
                    <tr className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                      <th className="px-4 py-3">Order</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Items</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Invoice</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#f0ede7]">
                    {orders.map((order) => (
                      <tr key={order.orderId}>
                        <td className="px-4 py-3 text-sm font-medium text-[#292821]">
                          {order.orderId}
                        </td>

                        <td className="px-4 py-3 text-sm text-stone-600">
                          {formatDate(order.orderDate)}
                        </td>

                        <td className="px-4 py-3 text-sm text-stone-700">
                          {order.itemSummary || "—"}
                        </td>

                        <td className="px-4 py-3 text-sm font-medium text-[#292821]">
                          {formatCurrency(order.amount)}
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${orderStatusClass(order.status)}`}
                          >
                            {order.status}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          {order.invoiceId ? (
                            <div className="inline-flex items-center gap-1.5 text-sm text-[#9a7837]">
                              <ReceiptText size={15} />
                              {order.invoiceId}
                            </div>
                          ) : (
                            <span className="text-sm text-stone-400">
                              Not generated
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        <div className="flex justify-end border-t border-[#ebe8e1] px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#e7e3da] px-4 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsModal;