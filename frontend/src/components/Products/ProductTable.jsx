
import {
  Pencil,
  Trash2,
  PackageSearch,
  ArrowUpDown,
  Power,
} from "lucide-react";

import ProductStatusBadge from "./ProductStatusBadge";

function ProductTable({
  products,
  onEdit,
  onDelete,
  onToggleStatus,
  sortOrder,
  onSort,
}) {
  const formatWeight = (weight) =>
    `${Number(weight).toLocaleString("en-IN", {
      maximumFractionDigits: 3,
    })} g`;

  return (
    <div className="w-full min-w-0 overflow-hidden rounded-xl border border-[#ebe8e1] bg-white shadow-sm">
      {/* Table header */}
      <div className="flex items-center justify-between gap-3 border-b border-[#ebe8e1] px-3 py-3 sm:px-4">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-[#292821]">
            Product Catalogue
          </h2>

          <p className="mt-0.5 text-xs text-gray-500">
            {products.length}{" "}
            {products.length === 1 ? "product" : "products"} found
          </p>
        </div>
      </div>

      {/* Responsive table wrapper */}
      <div className="w-full overflow-x-auto overscroll-x-contain">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[#ebe8e1] bg-[#faf9f6]">
              <th className="whitespace-nowrap px-3 py-3 text-xs font-medium text-gray-500 sm:px-4">
                Product ID
              </th>

              <th className="px-3 py-3 text-xs font-medium text-gray-500 sm:px-4">
                Product Name
              </th>

              <th className="px-3 py-3 text-xs font-medium text-gray-500 sm:px-4">
                Category
              </th>

              <th className="px-3 py-3 text-xs font-medium text-gray-500 sm:px-4">
                Metal Type
              </th>

              <th className="px-3 py-3 text-xs font-medium text-gray-500 sm:px-4">
                Purity
              </th>

              <th className="whitespace-nowrap px-3 py-3 text-xs font-medium text-gray-500 sm:px-4">
                <button
                  type="button"
                  onClick={onSort}
                  className="inline-flex items-center gap-1 whitespace-nowrap transition hover:text-[#9a7837]"
                  title="Sort by weight"
                >
                  Weight
                  <ArrowUpDown size={13} />

                  {sortOrder === "asc"
                    ? "↑"
                    : sortOrder === "desc"
                      ? "↓"
                      : ""}
                </button>
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
            {products.length > 0 ? (
              products.map((product) => (
                <tr
                  key={product.id}
                  className="transition-colors hover:bg-[#fdfcf9]"
                >
                  <td className="whitespace-nowrap px-3 py-3 text-xs font-medium text-[#9a7837] sm:px-4">
                    {product.id}
                  </td>

                  <td className="px-3 py-3 sm:px-4">
                    <span
                      title={product.name}
                      className="block max-w-[150px] truncate font-medium text-[#292821] sm:max-w-[220px]"
                    >
                      {product.name}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-3 py-3 text-gray-600 sm:px-4">
                    {product.category}
                  </td>

                  <td className="whitespace-nowrap px-3 py-3 text-gray-600 sm:px-4">
                    {product.metalType}
                  </td>

                  <td className="whitespace-nowrap px-3 py-3 text-gray-600 sm:px-4">
                    {product.purity}
                  </td>

                  <td className="whitespace-nowrap px-3 py-3 text-gray-600 sm:px-4">
                    {formatWeight(product.weight)}
                  </td>

                  <td className="whitespace-nowrap px-3 py-3 sm:px-4">
                    <ProductStatusBadge status={product.status} />
                  </td>

                  <td className="whitespace-nowrap px-3 py-3 sm:px-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onToggleStatus(product)}
                        title={
                          product.status === "Active"
                            ? "Deactivate product"
                            : "Activate product"
                        }
                        aria-label={
                          product.status === "Active"
                            ? `Deactivate ${product.name}`
                            : `Activate ${product.name}`
                        }
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-[#9a7837] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9a7837]"
                      >
                        <Power size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEdit(product)}
                        title="Edit product"
                        aria-label={`Edit ${product.name}`}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-500 transition hover:bg-[#f5f0e5] hover:text-[#9a7837] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9a7837]"
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(product)}
                        title="Delete product"
                        aria-label={`Delete ${product.name}`}
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
                  <PackageSearch
                    size={30}
                    className="mx-auto mb-2 text-gray-300"
                  />

                  <p className="text-sm font-medium text-gray-600">
                    No products found
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

      {/* Table footer */}
      <div className="border-t border-[#ebe8e1] px-3 py-3 sm:px-4">
        <p className="text-xs text-gray-500">
          Showing {products.length}{" "}
          {products.length === 1 ? "product" : "products"}
        </p>
      </div>
    </div>
  );
}

export default ProductTable;
