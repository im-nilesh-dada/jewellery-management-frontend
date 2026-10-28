import { CircleCheck, CircleX } from "lucide-react";

function ProductStatusBadge({ status }) {
  const isActive = status === "Active";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
        isActive
          ? "bg-green-50 text-green-700"
          : "bg-gray-100 text-gray-600"
      }`}
    >
      {isActive ? (
        <CircleCheck size={13} />
      ) : (
        <CircleX size={13} />
      )}

      {status}
    </span>
  );
}

export default ProductStatusBadge;