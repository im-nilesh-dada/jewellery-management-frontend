function OrderSummaryCard({ label, value, icon: Icon, iconStyle }) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-[#ebe8e1] bg-white px-4 py-3 shadow-sm">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconStyle}`}
      >
        <Icon size={18} />
      </div>

      <div className="min-w-0">
        <p className="truncate text-xs text-gray-500">{label}</p>

        <p className="mt-0.5 text-xl font-semibold leading-tight text-[#292821]">
          {value}
        </p>
      </div>
    </div>
  );
}

export default OrderSummaryCard;