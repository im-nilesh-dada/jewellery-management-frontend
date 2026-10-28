const statusStyles = {
  Draft: "border-gray-200 bg-gray-100 text-gray-600",
  Confirmed: "border-blue-200 bg-blue-50 text-blue-700",
  Processing: "border-amber-200 bg-amber-50 text-amber-700",
  Ready: "border-green-200 bg-green-50 text-green-700",
  Completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Cancelled: "border-red-200 bg-red-50 text-red-700",
};

function OrderStatusBadge({ status }) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium ${
        statusStyles[status] || statusStyles.Draft
      }`}
    >
      {status}
    </span>
  );
}

export default OrderStatusBadge;