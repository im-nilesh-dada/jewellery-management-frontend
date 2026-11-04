import { Download, Search, CalendarDays, X } from "lucide-react";

const SalesReportToolbar = ({
  search,
  setSearch,
  dateFilter,
  setDateFilter,
  onExport,
}) => {
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
              placeholder="Search invoice, customer, product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-[#e8e5dd] bg-[#faf9f6] py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#9a7837] focus:ring-2 focus:ring-[#9a7837]/10"
            />
          </div>

          <div className="relative">
            <CalendarDays
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full appearance-none rounded-lg border border-[#e8e5dd] bg-white py-2.5 pl-9 pr-8 text-sm text-gray-600 outline-none focus:border-[#9a7837] sm:w-auto"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
            </select>
          </div>

          {search && (
            <button
              onClick={() => setSearch("")}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-100"
            >
              <X size={15} />
              Clear
            </button>
          )}
        </div>

        <button
          onClick={onExport}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#e8e5dd] bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-[#9a7837] hover:bg-[#faf9f6] sm:w-auto"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>
    </div>
  );
};

export default SalesReportToolbar;