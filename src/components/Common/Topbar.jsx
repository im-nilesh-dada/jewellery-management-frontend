
import {
  Search,
  Bell,
  ChevronDown,
  CalendarDays,
} from "lucide-react";

function Topbar() {
  return (
    <header className="flex min-h-[82px] items-center justify-between gap-5 border-b border-[#ebe8e1] bg-white px-[30px] py-[15px] max-[768px]:flex-wrap max-[768px]:items-start max-[768px]:px-4 max-[768px]:py-[17px]">
      {/* Left Section */}
      <div className="flex min-w-0 items-center max-[768px]:flex-1">
        {/* Add your page heading or breadcrumb here if needed */}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-[14px] max-[1100px]:gap-2 max-[768px]:flex-wrap">
        {/* Search */}
        <label className="flex w-[240px] items-center gap-[9px] rounded-full border border-[#e9e6de] bg-[#faf9f6] px-3 py-[10px] text-[#89867d] max-[768px]:order-3 max-[768px]:w-full">
          <Search size={17} className="shrink-0" />

          <input
            type="search"
            placeholder="Search"
            aria-label="Search"
            className="w-full min-w-0 border-0 bg-transparent text-xs text-[#292821] outline-none placeholder:text-[#a09c91] focus:ring-0"
          />

          <span className="grid h-5 w-5 shrink-0 place-items-center rounded border border-[#e3dfd5] text-[11px] text-[#89867d]">
            /
          </span>
        </label>

        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          title="Notifications"
          className="relative grid h-10 w-10 shrink-0 place-items-center rounded-[9px] border border-[#e9e6de] bg-white text-[#555247] transition-colors hover:bg-[#f5f0e5]"
        >
          <Bell size={19} />

          <span className="absolute right-[9px] top-2 h-[7px] w-[7px] rounded-full border border-white bg-[#bd8d36]" />
        </button>

        {/* Date */}
        <div className="flex items-center gap-2 whitespace-nowrap rounded-[9px] border border-[#e9e6de] px-3 py-[10px] text-xs text-[#666256] max-[1100px]:hidden">
          <CalendarDays size={16} />
          <span>Today</span>
        </div>

        {/* Profile */}
        <button
          type="button"
          aria-label="User profile"
          className="flex items-center gap-[9px] border-0 bg-transparent p-[3px] text-left text-[#555247]"
        >
          <span className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-full border border-[#d8c594] bg-[#f5efdf] text-sm font-bold text-[#806127]">
            A
          </span>

          <span className="flex flex-col gap-1 whitespace-nowrap max-[1100px]:hidden">
            <strong className="text-[11px] font-semibold text-[#292821]">
              Admin User
            </strong>

            <small className="text-[10px] text-[#89867d]">
              Administrator
            </small>
          </span>

          <ChevronDown size={15} className="shrink-0" />
        </button>
      </div>
    </header>
  );
}

export default Topbar;
