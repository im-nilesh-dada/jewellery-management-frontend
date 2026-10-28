import { Plus, Search, RotateCcw } from "lucide-react";

const selectClass =
  "h-9 rounded-lg border border-[#e5e1d8] bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-[#9a7837]";

function ProductToolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  categoryFilter,
  onCategoryChange,
  metalFilter,
  onMetalChange,
  categories,
  metalTypes,
  onAdd,
  onReset,
}) {
  return (
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
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by ID, name, category or metal..."
            aria-label="Search products"
            className="h-9 w-full rounded-lg border border-[#e5e1d8] bg-[#fdfcf9] pl-9 pr-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#9a7837]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(event) => onStatusChange(event.target.value)}
            aria-label="Filter by status"
            className={selectClass}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(event) => onCategoryChange(event.target.value)}
            aria-label="Filter by category"
            className={selectClass}
          >
            <option value="All">All Categories</option>

            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={metalFilter}
            onChange={(event) => onMetalChange(event.target.value)}
            aria-label="Filter by metal type"
            className={selectClass}
          >
            <option value="All">All Metals</option>

            {metalTypes.map((metal) => (
              <option key={metal} value={metal}>
                {metal}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={onReset}
            title="Reset search and filters"
            aria-label="Reset search and filters"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e5e1d8] text-gray-600 transition hover:bg-gray-50"
          >
            <RotateCcw size={15} />
          </button>

          <button
            type="button"
            onClick={onAdd}
            className="flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-[#9a7837] px-3 text-sm font-medium text-white transition hover:bg-[#806127]"
          >
            <Plus size={16} />
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductToolbar;