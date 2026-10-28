
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendLabel,
  trendDirection = "up",
}) {
  const isPositive = trendDirection === "up";

  return (
    <article className="min-w-0 rounded-[14px] border border-[#ebe8e1] bg-white p-[21px] shadow-[0_2px_8px_rgba(38,34,22,0.025)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_22px_rgba(38,34,22,0.06)] max-[480px]:p-4">
      {/* Card heading and icon */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-[#77746b]">
          {title}
        </span>

        <div className="grid h-[43px] w-[43px] shrink-0 place-items-center rounded-xl bg-[#f5efdf] text-[#98732d]">
          {Icon && <Icon size={21} strokeWidth={1.8} />}
        </div>
      </div>

      {/* Main value */}
      <div className="mt-[19px] overflow-wrap-anywhere text-[clamp(22px,2vw,29px)] font-bold leading-[1.3] text-[#292821] max-[480px]:mt-3.5">
        {value}
      </div>

      {/* Trend and subtitle */}
      <div className="mt-3 flex flex-wrap items-center gap-[7px]">
        {trend && (
          <span
            className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${
              isPositive ? "text-[#287a4b]" : "text-[#b23a32]"
            }`}
          >
            {isPositive ? (
              <ArrowUpRight size={14} />
            ) : (
              <ArrowDownRight size={14} />
            )}
            {trend}
          </span>
        )}

        {trendLabel && (
          <span className="text-[11px] text-[#89867d]">
            {trendLabel}
          </span>
        )}

        {subtitle && !trendLabel && (
          <span className="text-[11px] text-[#89867d]">
            {subtitle}
          </span>
        )}
      </div>
    </article>
  );
}

export default StatCard;
