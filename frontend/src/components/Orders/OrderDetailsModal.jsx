import { useEffect } from "react";
import { ArrowRight, CalendarDays, Package, UserRound, X } from "lucide-react";

import OrderStatusBadge from "./OrderStatusBadge";
import { nextStatus } from "../../data/mockOrderData";
import { currency, formatDate, getTotal } from "../../utils/orderUtils";

function OrderDetailsModal({ order, onClose, onAdvance, onCancel }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!order) return null;

  const followingStatus =
    order.status === "Draft" ? "Confirmed" : nextStatus[order.status];

  const canAdvance = Boolean(followingStatus) && order.status !== "Cancelled";
  const canCancel = !["Completed", "Cancelled"].includes(order.status);

  const items = order.items ?? [];
  const total = order.total ?? getTotal(items);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-details-title"
        className="my-auto w-full max-w-2xl overflow-hidden rounded-xl border border-[#ebe8e1] bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-[#ebe8e1] px-5 py-4">
          <div>
            <h2
              id="order-details-title"
              className="text-base font-semibold text-[#292821]"
            >
              Order Details
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Order #{order.id}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close order details"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[70vh] space-y-5 overflow-y-auto p-5">
          <div className="flex flex-col justify-between gap-3 rounded-xl border border-[#ebe8e1] bg-[#fdfcf9] p-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs text-gray-500">Order total</p>
              <p className="mt-1 text-2xl font-semibold text-[#292821]">
                {currency(total)}
              </p>
            </div>

            <OrderStatusBadge status={order.status} />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-xl border border-[#ebe8e1] p-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f5f0e5] text-[#9a7837]">
                <UserRound size={17} />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-gray-500">Customer</p>
                <p className="mt-1 break-words text-sm font-medium text-[#292821]">
                  {order.customerName || order.customer || "—"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-[#ebe8e1] p-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f5f0e5] text-[#9a7837]">
                <CalendarDays size={17} />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-gray-500">Order date</p>
                <p className="mt-1 text-sm font-medium text-[#292821]">
                  {formatDate(order.date)}
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-[#ebe8e1]">
            <div className="flex items-center gap-2 border-b border-[#ebe8e1] px-4 py-3">
              <Package size={16} className="text-[#9a7837]" />
              <h3 className="text-sm font-semibold text-[#292821]">
                Order Items
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[#ebe8e1] bg-[#faf9f6]">
                    <th className="px-4 py-3 text-xs font-medium text-gray-500">
                      Product
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">
                      Qty
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">
                      Unit Price
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">
                      Subtotal
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#f0eee8]">
                  {items.map((item, index) => (
                    <tr key={item.id ?? item.productId ?? index}>
                      <td className="px-4 py-3 font-medium text-[#292821]">
                        {item.name ?? item.productName ?? "Product"}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600">
                        {item.quantity}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right text-gray-600">
                        {currency(item.price ?? item.unitPrice ?? 0)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right font-medium text-[#292821]">
                        {currency(
                          Number(item.price ?? item.unitPrice ?? 0) *
                            Number(item.quantity ?? 0)
                        )}
                      </td>
                    </tr>
                  ))}

                  {items.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-8 text-center text-sm text-gray-500"
                      >
                        No items in this order.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-[#ebe8e1] bg-[#fdfcf9] px-4 py-3">
              <span className="text-sm font-medium text-gray-600">
                Total
              </span>
              <span className="text-base font-semibold text-[#292821]">
                {currency(total)}
              </span>
            </div>
          </div>

          {order.notes && (
            <div>
              <h3 className="text-xs font-medium text-gray-700">Notes</h3>
              <p className="mt-1.5 whitespace-pre-wrap rounded-lg border border-[#ebe8e1] bg-[#fdfcf9] p-3 text-sm text-gray-600">
                {order.notes}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t border-[#ebe8e1] bg-[#fdfcf9] px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="h-9 rounded-lg border border-[#e5e1d8] bg-white px-4 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
          >
            Close
          </button>

          {canCancel && (
            <button
              type="button"
              onClick={() => onCancel(order)}
              className="h-9 rounded-lg border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              Cancel Order
            </button>
          )}

          {canAdvance && (
            <button
              type="button"
              onClick={() => onAdvance(order)}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#9a7837] px-4 text-sm font-medium text-white transition hover:bg-[#806127]"
            >
              {order.status === "Draft" ? "Confirm Order" : `Mark ${followingStatus}`}
              <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsModal;