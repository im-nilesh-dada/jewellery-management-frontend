import { useMemo, useState } from "react";

import {
  Search,
  Plus,
  ShoppingCart,
  Clock3,
  PackageCheck,
  CheckCircle2,
  Eye,
  ChevronDown,
  CalendarDays,
  UserRound,
  ArrowRight,
} from "lucide-react";

import {
  initialOrders,
  statusStyles,
  nextStatus,
} from "../data/mockOrderData";

import {
  currency,
  formatDate,
  getTotal,
} from "../utils/orderUtils";

import OrderStatusBadge from "../components/Orders/OrderStatusBadge";
import OrderSummaryCard from "../components/Orders/OrderSummaryCard";
import OrderModal from "../components/Orders/OrderModal";
import OrderDetailsModal from "../components/Orders/OrderDetailsModal";

export default function Orders() {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [notice, setNotice] = useState("");

  const selectedOrder =
    orders.find((order) => order.id === selectedOrderId) || null;

  const stats = useMemo(
    () => ({
      total: orders.length,
      pending: orders.filter((o) => o.status === "Draft").length,
      processing: orders.filter((o) =>
        ["Confirmed", "Processing", "Ready"].includes(o.status)
      ).length,
      completed: orders.filter((o) => o.status === "Completed").length,
    }),
    [orders]
  );

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders
      .filter((order) => {
        const matchesSearch =
          !query ||
          order.id.toLowerCase().includes(query) ||
          order.customer.toLowerCase().includes(query) ||
          order.items.some(
            (item) =>
              item.name.toLowerCase().includes(query) ||
              item.sku.toLowerCase().includes(query)
          );

        const matchesStatus =
          statusFilter === "All" || order.status === statusFilter;

        const matchesDate =
          !dateFilter || order.date === dateFilter;

        return matchesSearch && matchesStatus && matchesDate;
      })
      .sort(
        (a, b) =>
          b.date.localeCompare(a.date) ||
          b.id.localeCompare(a.id)
      );
  }, [orders, search, statusFilter, dateFilter]);

  const showNotice = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3500);
  };

  const createOrder = (orderData) => {
    const highestNumber = Math.max(
      1048,
      ...orders.map(
        (order) => Number(order.id.split("-").pop()) || 0
      )
    );

    const newOrder = {
      ...orderData,
      id: `ORD-${orderData.date.slice(0, 4)}-${highestNumber + 1}`,
    };

    setOrders((current) => [newOrder, ...current]);
    setShowCreateModal(false);
    showNotice(`${newOrder.id} created as a draft.`);
  };

  const advanceOrder = (id) => {
    const order = orders.find((entry) => entry.id === id);

    if (!order) return;

    const status =
      order.status === "Draft"
        ? "Confirmed"
        : nextStatus[order.status];

    if (!status) return;

    setOrders((current) =>
      current.map((entry) =>
        entry.id === id ? { ...entry, status } : entry
      )
    );

    setSelectedOrderId(null);
    showNotice(`${id} moved to ${status}.`);
  };

  const cancelOrder = (id) => {
    const order = orders.find((entry) => entry.id === id);

    if (!order || ["Completed", "Cancelled"].includes(order.status)) {
      return;
    }

    const confirmed = window.confirm(
      `Cancel order ${id}? This demo will update its status only.`
    );

    if (!confirmed) return;

    setOrders((current) =>
      current.map((entry) =>
        entry.id === id
          ? { ...entry, status: "Cancelled" }
          : entry
      )
    );

    setSelectedOrderId(null);
    showNotice(`${id} has been cancelled.`);
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setDateFilter("");
  };

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6 pb-8">
      {/* Page header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[11px] font-medium text-[#928d80]">
            <span>JMS ERP</span>
            <span className="text-[#c5bda9]">/</span>
            <span className="text-[#a18443]">Order Management</span>
          </div>

          <h1 className="text-[26px] font-semibold tracking-tight text-[#292821] sm:text-[30px]">
            Order Management
          </h1>

          <p className="mt-1.5 text-sm text-[#858174]">
            Create orders, manage fulfilment, and track order progress.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#302e25] px-4 text-xs font-semibold text-[#f4e4b8] shadow-sm transition hover:bg-[#45402f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9bc76]"
        >
          <Plus size={17} />
          Create order
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <OrderSummaryCard
          label="Total orders"
          value={stats.total}
          helper="All orders in this view"
          icon={ShoppingCart}
          accent="bg-[#f4efe2] text-[#9a7b37]"
        />

        <OrderSummaryCard
          label="Awaiting confirmation"
          value={stats.pending}
          helper="Draft orders"
          icon={Clock3}
          accent="bg-[#f8f0df] text-[#a67d2f]"
        />

        <OrderSummaryCard
          label="In progress"
          value={stats.processing}
          helper="Confirmed, processing or ready"
          icon={PackageCheck}
          accent="bg-[#eaf0f8] text-[#5579a5]"
        />

        <OrderSummaryCard
          label="Completed orders"
          value={stats.completed}
          helper="Successfully fulfilled"
          icon={CheckCircle2}
          accent="bg-[#e8f4ec] text-[#47835b]"
        />
      </div>

      {/* Orders table */}
      <section className="overflow-hidden rounded-2xl border border-[#ebe7de] bg-white shadow-[0_2px_10px_rgba(41,40,33,0.025)]">
        <div className="flex flex-col gap-4 border-b border-[#efebe3] p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#302f28]">
              All orders
            </h2>

            <p className="mt-1 text-xs text-[#8e897d]">
              {filteredOrders.length}{" "}
              {filteredOrders.length === 1 ? "order" : "orders"} found
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:w-auto">
            <label className="relative block">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#a09a8d]"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search orders..."
                aria-label="Search orders"
                className="h-10 w-full rounded-xl border border-[#e8e3d9] bg-[#fdfcf9] pl-9 pr-3 text-xs text-[#38362e] outline-none placeholder:text-[#aaa597] focus:border-[#b79a57] focus:ring-2 focus:ring-[#d9bc76]/20 sm:w-[220px]"
              />
            </label>

            <label className="relative block">
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                aria-label="Filter by status"
                className="h-10 w-full appearance-none rounded-xl border border-[#e8e3d9] bg-[#fdfcf9] pl-3 pr-9 text-xs text-[#514e43] outline-none focus:border-[#b79a57] sm:w-[160px]"
              >
                <option value="All">All statuses</option>

                {Object.keys(statusStyles).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#928d80]"
              />
            </label>

            <label className="relative block">
              <CalendarDays
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#a09a8d]"
              />

              <input
                type="date"
                value={dateFilter}
                onChange={(event) => setDateFilter(event.target.value)}
                aria-label="Filter by order date"
                className="h-10 w-full rounded-xl border border-[#e8e3d9] bg-[#fdfcf9] pl-9 pr-2 text-xs text-[#514e43] outline-none focus:border-[#b79a57] sm:w-[155px]"
              />
            </label>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#efebe3] bg-[#fbfaf7]">
                {[
                  "Order",
                  "Customer",
                  "Items",
                  "Order date",
                  "Total",
                  "Status",
                  "Actions",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.09em] text-[#918b7d]"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#f0ede6]">
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="transition-colors hover:bg-[#fdfbf6]"
                >
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => setSelectedOrderId(order.id)}
                      className="text-xs font-semibold text-[#78602f] hover:text-[#a18443] hover:underline"
                    >
                      {order.id}
                    </button>

                    <p className="mt-1 text-[10px] text-[#a19b8e]">
                      {order.payment}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#f3efe5] text-[#8e7742]">
                        <UserRound size={15} />
                      </div>

                      <div className="min-w-0">
                        <p className="whitespace-nowrap text-xs font-semibold text-[#3c3a32]">
                          {order.customer}
                        </p>
                        <p className="mt-1 whitespace-nowrap text-[10px] text-[#9a9487]">
                          {order.phone}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-xs font-medium text-[#48463e]">
                      {order.items.length}{" "}
                      {order.items.length === 1 ? "product" : "products"}
                    </p>

                    <p
                      className="mt-1 max-w-[180px] truncate text-[10px] text-[#9a9487]"
                      title={order.items.map((item) => item.name).join(", ")}
                    >
                      {order.items.map((item) => item.name).join(", ")}
                    </p>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-xs text-[#686458]">
                    {formatDate(order.date)}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-xs font-semibold text-[#37352d]">
                    {currency(getTotal(order))}
                  </td>

                  <td className="px-5 py-4">
                    <OrderStatusBadge status={order.status} />
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setSelectedOrderId(order.id)}
                        title="View order"
                        aria-label={`View ${order.id}`}
                        className="grid h-8 w-8 place-items-center rounded-lg text-[#8b8578] hover:bg-[#f1ecdf] hover:text-[#8d7136]"
                      >
                        <Eye size={16} />
                      </button>

                      {order.status === "Draft" && (
                        <button
                          type="button"
                          onClick={() => advanceOrder(order.id)}
                          title="Confirm order"
                          aria-label={`Confirm ${order.id}`}
                          className="grid h-8 w-8 place-items-center rounded-lg text-emerald-700 hover:bg-emerald-50"
                        >
                          <CheckCircle2 size={16} />
                        </button>
                      )}

                      {nextStatus[order.status] && (
                        <button
                          type="button"
                          onClick={() => advanceOrder(order.id)}
                          title={`Move to ${nextStatus[order.status]}`}
                          aria-label={`Advance ${order.id}`}
                          className="grid h-8 w-8 place-items-center rounded-lg text-[#8d7136] hover:bg-[#f6f0e2]"
                        >
                          <ArrowRight size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#f5f1e7] text-[#9b834b]">
                      <ShoppingCart size={21} />
                    </div>

                    <p className="mt-3 text-sm font-semibold text-[#4b483f]">
                      No orders found
                    </p>

                    <p className="mt-1 text-xs text-[#928d80]">
                      Try another search or adjust the filters.
                    </p>

                    <button
                      type="button"
                      onClick={clearFilters}
                      className="mt-3 text-xs font-semibold text-[#8d7136] hover:underline"
                    >
                      Clear filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className="flex flex-col gap-2 border-t border-[#efebe3] bg-[#fdfcf9] px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-[#918b7d]">
            Showing {filteredOrders.length} of {orders.length} orders
          </p>

          <p className="text-[10px] text-[#a19b8e]">
            Demo data · Changes are held in the current session
          </p>
        </footer>
      </section>

      {/* Action notification */}
      {notice && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-[250] flex max-w-[calc(100vw-40px)] items-center gap-2 rounded-xl border border-[#d9cfb6] bg-[#302e25] px-4 py-3 text-xs font-medium text-[#f4e4b8] shadow-xl"
        >
          <CheckCircle2 size={16} className="shrink-0 text-[#d9bc76]" />
          {notice}
        </div>
      )}

      {/* Create order */}
      {showCreateModal && (
        <OrderModal
          onClose={() => setShowCreateModal(false)}
          onCreate={createOrder}
        />
      )}

      {/* View order */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrderId(null)}
          onAdvance={advanceOrder}
          onCancel={cancelOrder}
        />
      )}
    </div>
  );
}