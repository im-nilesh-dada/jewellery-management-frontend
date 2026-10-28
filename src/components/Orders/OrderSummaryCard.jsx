export default function OrderSummaryCard({
  label,
  value,
  helper,
  icon: Icon,
  accent,
}) {
  return (
    <div className="rounded-2xl border border-[#ebe7de] bg-white p-5 shadow-[0_2px_10px_rgba(41,40,33,0.025)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-[#858174]">{label}</p>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-[#292821]">
            {value}
          </p>
        </div>

        <div
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${accent}`}
        >
          <Icon size={20} strokeWidth={1.8} />
        </div>
      </div>

      <p className="mt-3 text-[11px] text-[#928d80]">{helper}</p>
    </div>
  );
}