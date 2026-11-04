const statusStyles = {
  Completed: "bg-green-50 text-green-700 border-green-200",
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Failed: "bg-red-50 text-red-700 border-red-200",
  Refunded: "bg-gray-100 text-gray-600 border-gray-200",
};

const PaymentStatusBadge = ({ status }) => {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${
        statusStyles[status] || statusStyles.Pending
      }`}
    >
      <span
        className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
          status === "Completed"
            ? "bg-green-500"
            : status === "Pending"
              ? "bg-amber-500"
              : status === "Failed"
                ? "bg-red-500"
                : "bg-gray-400"
        }`}
      />
      {status}
    </span>
  );
};

export default PaymentStatusBadge;