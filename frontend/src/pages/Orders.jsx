import { useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Plus,
  RefreshCw,
  Search,
  ShoppingBag,
  X,
} from "lucide-react";

import OrderModal from "../components/Orders/OrderModal";
import OrderDetailsModal from "../components/Orders/OrderDetailsModal";
import OrderStatusBadge from "../components/Orders/OrderStatusBadge";
import OrderSummaryCard from "../components/Orders/OrderSummaryCard";

import { initialOrders, nextStatus } from "../data/mockOrderData";
import { currency, formatDate, getTotal } from "../utils/orderUtils";

const selectClass =
  "h-9 rounded-lg border border-[#e5e1d8] bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-[#9a7837]";

const statusOptions = [
  "Draft",
  "Confirmed",
  "Processing",
  "Ready",
  "Completed",
  "Cancelled",
];

function Orders() {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);

  const stats = useMemo(
    () => [
      {
        key: "total",
        label: "Total Orders",
        value: orders.length,
        icon: ClipboardList,
        iconStyle: "bg-[#f5f0e5] text-[#9a7837]",
      },
      {
        key: "pending",
        label: "Pending Orders",
        value: orders.filter((order) =>
          ["Draft", "Confirmed", "Processing"].includes(order.status)
        ).length,
        icon: Clock3,
        iconStyle: "bg-amber-50 text-amber-700",
      },
      {
        key: "ready",
        label: "Ready Orders",
        value: orders.filter((order) => order.status === "Ready").length,
        icon: ShoppingBag,
        iconStyle: "bg-green-50 text-green-700",
      },
      {
        key: "completed",
        label: "Completed Orders",
        value: orders.filter((order) => order.status === "Completed").length,
        icon: CheckCircle2,
        iconStyle: "bg-blue-50 text-blue-700",
      },
    ],
    [orders]
  );

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders
      .filter((order) => {
        const matchesSearch = [
          order.id,
          order.customerName,
          order.customer,
          order.status,
        ].some((value) =>
          String(value ?? "").toLowerCase().includes(query)
        );

        const matchesStatus =
          statusFilter === "All" || order.status === statusFilter;

        const matchesDate = !dateFilter || order.date === dateFilter;

        return matchesSearch && matchesStatus && matchesDate;
      })
      .sort((a, b) => {
        const dateDifference = String(b.date ?? "").localeCompare(
          String(a.date ?? "")
        );

        return dateDifference || String(b.id).localeCompare(String(a.id));
      });
  }, [orders, search, statusFilter, dateFilter]);

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setDateFilter("");
  };

  const showNotice = (message) => {
    setNotice(message);
    setError("");
  };

  const handleCreate = async (formData) => {
    setSaving(true);
    setError("");

    try {
      const numericIds = orders
        .map((order) => Number(String(order.id).replace(/\D/g, "")))
        .filter(Number.isFinite);

      const nextId = Math.max(0, ...numericIds) + 1;

      const newOrder = {
        ...formData,
        id: `ORD-${String(nextId).padStart(4, "0")}`,
        status: "Draft",
        createdAt: new Date().toISOString(),
      };

      setOrders((current) => [newOrder, ...current]);
      setFormOpen(false);
      showNotice("Order created successfully.");
    } catch {
      setError("Unable to create the order.");
    } finally {
      setSaving(false);
    }
  };

  const handleAdvance = (order) => {
    const targetStatus =
      order.status === "Draft" ? "Confirmed" : nextStatus[order.status];

    if (!targetStatus) return;

    setOrders((current) =>
      current.map((item) =>
        item.id === order.id
          ? { ...item, status: targetStatus }
          : item
      )
    );

    setSelectedOrder((current) =>
      current?.id === order.id
        ? { ...current, status: targetStatus }
        : current
    );

    showNotice(`Order ${order.id} marked as ${targetStatus}.`);
  };

  const handleCancel = (order) => {
    const confirmed = window.confirm(
      `Cancel order ${order.id}? This action cannot be undone.`
    );

    if (!confirmed) return;

    setOrders((current) =>
      current.map((item) =>
        item.id === order.id
          ? { ...item, status: "Cancelled" }
          : item
      )
    );

    setSelectedOrder(null);
    showNotice(`Order ${order.id} cancelled.`);
  };

  const openCreateForm = () => {
    setError("");
    setNotice("");
    setFormOpen(true);
  };

  const handleRefresh = () => {
    // This page currently uses local state rather than a backend service.
    // Refreshing the page data is therefore not connected to an API.
    setSearch("");
    setStatusFilter("All");
    setDateFilter("");
    setError("");
    setNotice("");
  };

  return (
    <main className="min-h-full space-y-5 bg-[#faf9f6] p-4 sm:p-5 lg:p-6">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#e9dfc9] bg-[#f5f0e5] text-[#9a7837]">
            <ShoppingBag size={21} />
          </div>

          <div>
            <h1 className="text-xl font-semibold tracking-tight text-[#292821]">
              Orders
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage jewellery orders, track progress, and view order details.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[#e5e1d8] bg-white px-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
          >
            <RefreshCw size={15} />
            Reset View
          </button>

          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-[#9a7837] px-3 text-sm font-medium text-white transition hover:bg-[#806127]"
          >
            <Plus size={16} />
            Create Order
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
        >
          <AlertCircle size={17} className="mt-0.5 shrink-0" />

          <p className="flex-1">{error}</p>

          <button
            type="button"
            onClick={() => setError("")}
            className="text-xs font-medium underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {notice && (
        <div
          role="status"
          className="flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 text-sm text-green-700"
        >
          <CheckCircle2 size={17} className="mt-0.5 shrink-0" />

          <p className="flex-1">{notice}</p>

          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Dismiss notification"
            className="text-xs font-medium underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {stats.map((stat) => (
          <OrderSummaryCard
            key={stat.key}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            iconStyle={stat.iconStyle}
          />
        ))}
      </div>

      {/* Search and filters */}
      <div className="flex flex-col gap-3 rounded-xl border border-[#ebe8e1] bg-white p-3 shadow-sm">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <div className="relative min-w-0 flex-1">
            <Search
              size={17}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by order ID, customer or status..."
              aria-label="Search orders"
              className="h-9 w-full rounded-lg border border-[#e5e1d8] bg-[#fdfcf9] pl-9 pr-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#9a7837]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter by order status"
              className={selectClass}
            >
              <option value="All">All Statuses</option>

              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <div className="relative">
              <CalendarDays
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="date"
                value={dateFilter}
                onChange={(event) => setDateFilter(event.target.value)}
                aria-label="Filter by order date"
                className="h-9 rounded-lg border border-[#e5e1d8] bg-white pl-9 pr-3 text-sm text-gray-700 outline-none transition focus:border-[#9a7837]"
              />
            </div>

            <button
              type="button"
              onClick={resetFilters}
              title="Reset search and filters"
              aria-label="Reset search and filters"
              className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#e5e1d8] px-3 text-sm text-gray-600 transition hover:bg-gray-50"
            >
              <X size={15} />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Orders table */}
      <div className="w-full min-w-0 overflow-hidden rounded-xl border border-[#ebe8e1] bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-[#ebe8e1] px-3 py-3 sm:px-4">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-[#292821]">
              Order Register
            </h2>

            <p className="mt-0.5 text-xs text-gray-500">
              {filteredOrders.length}{" "}
              {filteredOrders.length === 1 ? "order" : "orders"} found
            </p>
          </div>
        </div>

        <div className="w-full overflow-x-auto overscroll-x-contain">
          <table className="w-full min-w-[850px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[#ebe8e1] bg-[#faf9f6]">
                <th className="whitespace-nowrap px-3 py-3 text-xs font-medium text-gray-500 sm:px-4">
                  Order ID
                </th>

                <th className="px-3 py-3 text-xs font-medium text-gray-500 sm:px-4">
                  Customer
                </th>

                <th className="whitespace-nowrap px-3 py-3 text-xs font-medium text-gray-500 sm:px-4">
                  Order Date
                </th>

                <th className="px-3 py-3 text-xs font-medium text-gray-500 sm:px-4">
                  Items
                </th>

                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 sm:px-4">
                  Total
                </th>

                <th className="px-3 py-3 text-xs font-medium text-gray-500 sm:px-4">
                  Status
                </th>

                <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 sm:px-4">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#f0eee8]">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const itemCount = (order.items ?? []).reduce(
                    (sum, item) => sum + Number(item.quantity || 0),
                    0
                  );

                  const followingStatus =
                    order.status === "Draft"
                      ? "Confirmed"
                      : nextStatus[order.status];

                  return (
                    <tr
                      key={order.id}
                      className="transition-colors hover:bg-[#fdfcf9]"
                    >
                      <td className="whitespace-nowrap px-3 py-3 text-xs font-medium text-[#9a7837] sm:px-4">
                        {order.id}
                      </td>

                      <td className="px-3 py-3 sm:px-4">
                        <span
                          title={order.customerName || order.customer || ""}
                          className="block max-w-[180px] truncate font-medium text-[#292821]"
                        >
                          {order.customerName || order.customer || "—"}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-3 py-3 text-gray-600 sm:px-4">
                        {formatDate(order.date)}
                      </td>

                      <td className="whitespace-nowrap px-3 py-3 text-gray-600 sm:px-4">
                        {itemCount} {itemCount === 1 ? "item" : "items"}
                      </td>

                      <td className="whitespace-nowrap px-3 py-3 text-right font-medium text-[#292821] sm:px-4">
                        {currency(order.total ?? getTotal(order.items ?? []))}
                      </td>

                      <td className="whitespace-nowrap px-3 py-3 sm:px-4">
                        <OrderStatusBadge status={order.status} />
                      </td>

                      <td className="whitespace-nowrap px-3 py-3 sm:px-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            title="View order details"
                            aria-label={`View order ${order.id}`}
                            className="flex h-8 items-center justify-center rounded-lg border border-[#e5e1d8] bg-white px-2.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50 hover:text-[#9a7837] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9a7837]"
                          >
                            View
                          </button>

                          {followingStatus && (
                            <button
                              type="button"
                              onClick={() => handleAdvance(order)}
                              title={`Mark as ${followingStatus}`}
                              aria-label={`Advance order ${order.id} to ${followingStatus}`}
                              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-500 transition hover:bg-[#f5f0e5] hover:text-[#9a7837] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9a7837]"
                            >
                              <CheckCircle2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-14 text-center">
                    <ShoppingBag
                      size={30}
                      className="mx-auto mb-2 text-gray-300"
                    />

                    <p className="text-sm font-medium text-gray-600">
                      No orders found
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Try changing your search or filters.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-[#ebe8e1] px-3 py-3 sm:px-4">
          <p className="text-xs text-gray-500">
            Showing {filteredOrders.length}{" "}
            {filteredOrders.length === 1 ? "order" : "orders"}
          </p>
        </div>
      </div>

      {/* Create order modal */}
      {formOpen && (
        <OrderModal
          onClose={() => setFormOpen(false)}
          onCreate={handleCreate}
          saving={saving}
        />
      )}

      {/* Order details modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onAdvance={handleAdvance}
          onCancel={handleCancel}
        />
      )}
    </main>
  );
}

export default Orders;