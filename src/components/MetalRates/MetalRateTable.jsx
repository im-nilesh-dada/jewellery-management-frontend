import {
  Pencil,
  Trash2,
  ArrowUpDown,
  Power,
  History,
} from "lucide-react";

import MetalTypeBadge from "./MetalTypeBadge";
import ProductStatusBadge from "../Products/ProductStatusBadge";

function MetalRateTable({
  rates,
  onEdit,
  onDelete,
  onToggleStatus,
  sortBy,
  sortOrder,
  onSort,
}) {
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(amount));

  const formatDate = (dateValue) => {
    if (!dateValue) return "—";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (dateValue) => {
    if (!dateValue) return "—";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "—";

    return `${date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    })}, ${date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  const sortButton = (field, label) => (
    <button
      type="button"
      onClick={() => onSort(field)}
      className="inline-flex items-center gap-1 whitespace-nowrap transition hover:text-[#9a7837]"
      title={`Sort by ${label.toLowerCase()}`}
    >
      {label}
      <ArrowUpDown size={13} />

      {sortBy === field && (
        <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
      )}
    </button>
  );

  return (
    <div className="w-full min-w-0 overflow-hidden rounded-xl border border-[#ebe8e1] bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-[#ebe8e1] px-3 py-3 sm:px-4">
        <div>
          <h2 className="text-sm font-semibold text-[#292821]">
            Metal Rate Catalogue
          </h2>

          <p className="mt-0.5 text-xs text-gray-500">
            {rates.length} {rates.length === 1 ? "record" : "records"} found
          </p>
        </div>

        <History size={17} className="text-gray-400" />
      </div>

      <div className="w-full overflow-x-auto overscroll-x-contain">
        <table className="w-full min-w-[1000px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[#ebe8e1] bg-[#faf9f6]">
              <th className="whitespace-nowrap px-3 py-3 text-xs font-medium text-gray-500 sm:px-4">
                Rate ID
              </th>

              <th className="px-3 py-3 text-xs font-medium text-gray-500 sm:px-4">
                Metal
              </th>

              <th className="px-3 py-3 text-xs font-medium text-gray-500 sm:px-4">
                Purity
              </th>

              <th className="whitespace-nowrap px-3 py-3 text-xs font-medium text-gray-500 sm:px-4">
                {sortButton("ratePerGram", "Rate / Gram")}
              </th>

              <th className="whitespace-nowrap px-3 py-3 text-xs font-medium text-gray-500 sm:px-4">
                Effective From
              </th>

              <th className="whitespace-nowrap px-3 py-3 text-xs font-medium text-gray-500 sm:px-4">
                {sortButton("updatedAt", "Last Updated")}
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
            {rates.length > 0 ? (
              rates.map((rate) => (
                <tr
                  key={rate.id}
                  className="transition-colors hover:bg-[#fdfcf9]"
                >
                  <td className="whitespace-nowrap px-3 py-3 text-xs font-medium text-[#9a7837] sm:px-4">
                    {rate.id}
                  </td>

                  <td className="whitespace-nowrap px-3 py-3 sm:px-4">
                    <MetalTypeBadge metalType={rate.metalType} />
                  </td>

                  <td className="whitespace-nowrap px-3 py-3 text-sm font-medium text-[#292821] sm:px-4">
                    {rate.purity}
                  </td>

                  <td className="whitespace-nowrap px-3 py-3 font-medium text-[#292821] sm:px-4">
                    {formatCurrency(rate.ratePerGram)}
                    <span className="ml-1 text-xs font-normal text-gray-400">
                      / g
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-600 sm:px-4">
                    {formatDate(rate.effectiveFrom)}
                  </td>

                  <td className="whitespace-nowrap px-3 py-3 text-xs text-gray-500 sm:px-4">
                    {formatDateTime(rate.updatedAt)}
                  </td>

                  <td className="whitespace-nowrap px-3 py-3 sm:px-4">
                    <ProductStatusBadge status={rate.status} />
                  </td>

                  <td className="whitespace-nowrap px-3 py-3 sm:px-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onToggleStatus(rate)}
                        title={
                          rate.status === "Active"
                            ? "Deactivate rate"
                            : "Activate rate"
                        }
                        aria-label={
                          rate.status === "Active"
                            ? `Deactivate ${rate.id}`
                            : `Activate ${rate.id}`
                        }
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-[#9a7837] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9a7837]"
                      >
                        <Power size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEdit(rate)}
                        title="Edit rate"
                        aria-label={`Edit ${rate.id}`}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-500 transition hover:bg-[#f5f0e5] hover:text-[#9a7837] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9a7837]"
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(rate)}
                        title="Delete rate record"
                        aria-label={`Delete ${rate.id}`}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-500 transition hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-4 py-14 text-center">
                  <History
                    size={30}
                    className="mx-auto mb-2 text-gray-300"
                  />

                  <p className="text-sm font-medium text-gray-600">
                    No metal rates found
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
          Showing {rates.length} {rates.length === 1 ? "record" : "records"}
        </p>
      </div>
    </div>
  );
}

export default MetalRateTable;