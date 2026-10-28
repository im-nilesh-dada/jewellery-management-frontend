import { statusStyles } from "../../data/mockOrderData";

export default function OrderStatusBadge({ status }) {
  return (
    <span
      className={`inline-flex whitespace-nowrap items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold ${
        statusStyles[status] || statusStyles.Draft
      }`}
    >
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}