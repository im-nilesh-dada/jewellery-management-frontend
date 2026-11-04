import {
  Search,
  Plus,
  SlidersHorizontal,
  X,
} from "lucide-react";

const PaymentToolbar = ({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  methodFilter,
  setMethodFilter,
  onAddPayment,
}) => {
  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setMethodFilter("All");
  };

  const hasFilters =
    search || statusFilter !== "All" || methodFilter !== "All";

  return (
    <div className="rounded-xl border border-[#ebe8e1] bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <div className="relative w-full sm:max-w-sm">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search payment, customer, invoice..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-[#e8e5dd] bg-[#faf9f6] py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#9a7837] focus:ring-2 focus:ring-[#9a7837]/10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="min-w-0 flex-1 rounded-lg border border-[#e8e5dd] bg-white px-3 py-2.5 text-sm text-gray-600 outline-none focus:border-[#9a7837] sm:flex-none"
            >
              <option value="All">All Status</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
              <option value="Refunded">Refunded</option>
            </select>

            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="min-w-0 flex-1 rounded-lg border border-[#e8e5dd] bg-white px-3 py-2.5 text-sm text-gray-600 outline-none focus:border-[#9a7837] sm:flex-none"
            >
              <option value="All">All Methods</option>
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
              >
                <X size={15} />
                Clear
              </button>
            )}
          </div>
        </div>

        <button
          onClick={onAddPayment}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#9a7837] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#806127] sm:w-auto"
        >
          <Plus size={17} />
          Record Payment
        </button>
      </div>
    </div>
  );
};

export default PaymentToolbar;