import { Search, RotateCcw, UserPlus } from "lucide-react";

const CustomerToolbar = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  onReset,
  onAdd,
}) => {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[#ebe8e1] bg-white p-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row">
        <div className="relative w-full sm:max-w-sm">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search name, phone or customer ID..."
            className="w-full rounded-lg border border-[#e7e3da] bg-white py-2.5 pl-10 pr-3 text-sm text-[#292821] outline-none transition placeholder:text-stone-400 focus:border-[#9a7837] focus:ring-2 focus:ring-[#9a7837]/10"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) => onStatusChange(event.target.value)}
          className="rounded-lg border border-[#e7e3da] bg-white px-3 py-2.5 text-sm text-stone-700 outline-none focus:border-[#9a7837] sm:w-40"
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#e7e3da] px-3 py-2.5 text-sm text-stone-600 transition hover:bg-stone-50"
        >
          <RotateCcw size={15} />
          Reset
        </button>
      </div>

      <button
        type="button"
        onClick={onAdd}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#9a7837] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#82642d]"
      >
        <UserPlus size={17} />
        Add Customer
      </button>
    </div>
  );
};

export default CustomerToolbar;