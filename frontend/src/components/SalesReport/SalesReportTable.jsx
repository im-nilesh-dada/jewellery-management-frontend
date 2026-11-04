import { Eye, Receipt } from "lucide-react";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const statusStyles = {
  Completed: "bg-green-50 text-green-700 border-green-200",
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Cancelled: "bg-red-50 text-red-700 border-red-200",
};

const SalesReportTable = ({ sales }) => {
  return (
    <div className="overflow-hidden rounded-xl border border-[#ebe8e1] bg-white shadow-sm">
      <div className="flex flex-col gap-1 border-b border-[#ebe8e1] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div>
          <h3 className="font-semibold text-gray-900">
            Sales Transactions
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            Detailed overview of customer sales
          </p>
        </div>

        <span className="mt-2 w-fit rounded-lg bg-[#faf9f6] px-3 py-1.5 text-xs font-medium text-gray-600 sm:mt-0">
          {sales.length} Records
        </span>
      </div>

      {sales.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-4 py-14 text-center">
          <div className="rounded-full bg-[#faf9f6] p-4">
            <Receipt size={25} className="text-gray-400" />
          </div>

          <h3 className="mt-4 font-medium text-gray-800">
            No sales found
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Try changing your search or date filter.
          </p>
        </div>
      ) : (
        <div className="w-full overflow-x-auto overscroll-x-contain">
          <table className="w-full min-w-[1050px] text-left">
            <thead className="bg-[#faf9f6]">
              <tr className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="px-5 py-3.5">Invoice ID</th>
                <th className="px-5 py-3.5">Customer</th>
                <th className="px-5 py-3.5">Items</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5">Payment Method</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Details</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#f0eee9]">
              {sales.map((sale) => (
                <tr
                  key={sale.id}
                  className="transition hover:bg-[#faf9f6]/70"
                >
                  <td className="whitespace-nowrap px-5 py-4">
                    <span className="font-medium text-[#9a7837]">
                      {sale.invoiceId}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <p className="whitespace-nowrap text-sm font-medium text-gray-800">
                      {sale.customer}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-400">
                      {sale.phone}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-gray-700">
                      {sale.itemsCount} items
                    </p>
                    <p className="mt-0.5 max-w-48 truncate text-xs text-gray-400">
                      {sale.products}
                    </p>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                    {sale.date}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                    {sale.method}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-gray-900">
                    {formatCurrency(sale.amount)}
                  </td>

                  <td className="whitespace-nowrap px-5 py-4">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${
                        statusStyles[sale.status] ||
                        statusStyles.Pending
                      }`}
                    >
                      {sale.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        window.alert(
                          `Invoice: ${sale.invoiceId}\nCustomer: ${sale.customer}\nProducts: ${sale.products}\nAmount: ${formatCurrency(sale.amount)}`
                        )
                      }
                      title="View sale details"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#ebe8e1] px-3 py-2 text-xs font-medium text-gray-600 transition hover:border-[#9a7837] hover:bg-[#faf9f6] hover:text-[#9a7837]"
                    >
                      <Eye size={14} />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SalesReportTable;