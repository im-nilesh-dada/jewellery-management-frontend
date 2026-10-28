import {
  X,
  UserRound,
  CalendarDays,
  Package,
  ArrowRight,
  Ban,
} from "lucide-react";

import OrderStatusBadge from "./OrderStatusBadge";
import { currency, formatDate, getTotal } from "../../utils/orderUtils";
import { nextStatus } from "../../data/mockOrderData";

export default function OrderDetailsModal({
  order,
  onClose,
  onAdvance,
  onCancel,
}) {
  if (!order) return null;

  const next = order.status === "Draft"
    ? "Confirmed"
    : nextStatus[order.status];

  const canCancel = !["Completed", "Cancelled"].includes(order.status);
  const canAdvance = Boolean(next);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-3 backdrop-blur-[2px] sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-details-title"
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#ebe5d8] bg-[#fdfcf9] shadow-2xl"
      >
        <header className="flex items-start justify-between border-b border-[#ebe7de] p-5 sm:p-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#a18443]">
              Order details
            </p>

            <h2
              id="order-details-title"
              className="mt-1.5 text-xl font-semibold text-[#292821]"
            >
              {order.id}
            </h2>

            <div className="mt-3">
              <OrderStatusBadge status={order.status} />
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close order details"
            className="grid h-9 w-9 place-items-center rounded-lg text-[#777265] hover:bg-[#f0ece3]"
          >
            <X size={18} />
          </button>
        </header>

        <div className="space-y-6 p-5 sm:p-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-[#ebe7de] bg-white p-4">
              <div className="flex items-center gap-2 text-[#a18443]">
                <UserRound size={16} />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Customer
                </span>
              </div>

              <p className="mt-3 text-sm font-semibold text-[#37352d]">
                {order.customer}
              </p>
              <p className="mt-1 text-xs text-[#858174]">{order.phone}</p>
            </div>

            <div className="rounded-xl border border-[#ebe7de] bg-white p-4">
              <div className="flex items-center gap-2 text-[#a18443]">
                <CalendarDays size={16} />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Order date
                </span>
              </div>

              <p className="mt-3 text-sm font-semibold text-[#37352d]">
                {formatDate(order.date)}
              </p>
              <p className="mt-1 text-xs text-[#858174]">
                Payment: {order.payment}
              </p>
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center gap-2">
              <Package size={17} className="text-[#a18443]" />
              <h3 className="text-sm font-semibold text-[#292821]">
                Order items
              </h3>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#ebe7de] bg-white">
              <table className="w-full min-w-[420px] text-left">
                <thead className="border-b border-[#efebe3] bg-[#fbfaf7]">
                  <tr>
                    {["Product", "SKU", "Qty", "Price", "Subtotal"].map(
                      (heading) => (
                        <th
                          key={heading}
                          className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-[#918b7d]"
                        >
                          {heading}
                        </th>
                      )
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#f0ede6]">
                  {order.items.map((item, index) => (
                    <tr key={`${item.sku}-${index}`}>
                      <td className="px-3 py-3 text-xs font-medium text-[#37352d]">
                        {item.name}
                      </td>
                      <td className="px-3 py-3 text-[10px] text-[#858174]">
                        {item.sku}
                      </td>
                      <td className="px-3 py-3 text-xs text-[#514e43]">
                        {item.quantity}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-xs text-[#514e43]">
                        {currency(item.price)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-xs font-semibold text-[#37352d]">
                        {currency(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {order.notes && (
            <div className="rounded-xl border border-[#ebe7de] bg-white p-4">
              <h3 className="text-xs font-semibold text-[#514e43]">
                Order notes
              </h3>
              <p className="mt-2 whitespace-pre-wrap text-sm text-[#777265]">
                {order.notes}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between rounded-xl border border-[#e9dfc8] bg-[#f7f2e6] p-4">
            <span className="text-xs font-medium text-[#81765d]">
              Total order value
            </span>
            <span className="text-xl font-bold text-[#453b27]">
              {currency(getTotal(order))}
            </span>
          </div>

          {canAdvance && (
            <div className="rounded-xl border border-[#ebe7de] bg-white p-4">
              <p className="text-xs font-semibold text-[#514e43]">
                Next step
              </p>
              <p className="mt-1 text-xs text-[#858174]">
                Move this order from {order.status} to {next}.
              </p>

              <button
                type="button"
                onClick={() => onAdvance(order.id)}
                className="mt-3 inline-flex h-10 items-center gap-2 rounded-xl bg-[#302e25] px-4 text-xs font-semibold text-[#f4e4b8] hover:bg-[#45402f]"
              >
                {order.status === "Draft" ? "Confirm order" : `Move to ${next}`}
                <ArrowRight size={15} />
              </button>
            </div>
          )}

          <footer className="flex flex-col-reverse gap-2 border-t border-[#ece7dc] pt-4 sm:flex-row sm:items-center sm:justify-between">
            {canCancel ? (
              <button
                type="button"
                onClick={() => onCancel(order.id)}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-rose-200 px-4 text-xs font-semibold text-rose-700 hover:bg-rose-50"
              >
                <Ban size={15} />
                Cancel order
              </button>
            ) : (
              <span className="text-xs text-[#918b7d]">
                {order.status === "Completed"
                  ? "This order has been completed."
                  : "This order has been cancelled."}
              </span>
            )}

            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded-xl border border-[#e1dccf] px-5 text-xs font-semibold text-[#666154] hover:bg-[#f1eee7]"
            >
              Close
            </button>
          </footer>
        </div>
      </section>
    </div>
  );
}