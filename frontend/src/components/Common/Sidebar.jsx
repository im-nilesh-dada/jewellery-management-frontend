import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Coins,
  Boxes,
  Gem,
  Users,
  ShoppingCart,
  ReceiptText,
  CreditCard,
  ChartNoAxesCombined,
  Settings,
  Store,
  CircleHelp,
  LogOut,
} from "lucide-react";

const navigationGroups = [
  {
    title: "OVERVIEW",
    items: [{ label: "Dashboard", path: "/", icon: LayoutDashboard }],
  },
  {
    title: "INVENTORY",
    items: [
      { label: "Products", path: "/products", icon: Gem },
      { label: "Stock Management", path: "/inventory", icon: Boxes },
      { label: "Metal Rates", path: "/metal-rates", icon: Coins },
    ],
  },
  {
    title: "SALES & CUSTOMERS",
    items: [
      { label: "Customers", path: "/customers", icon: Users },
      { label: "Orders", path: "/orders", icon: ShoppingCart },
      { label: "Billing & Invoices", path: "/billing", icon: ReceiptText },
      { label: "Payments", path: "/payments", icon: CreditCard },
    ],
  },
  {
    title: "ANALYTICS",
    items: [
      { label: "Sales Reports", path: "/reports", icon: ChartNoAxesCombined },
    ],
  },
];

/*
  SPACING SYSTEM (4px scale)
  - Rail width 68px, horizontal padding 9px  -> inner width 50px
  - Every row is 44px tall, 4px gap between rows
  - Icon centre is always x = 34px (collapsed AND expanded), so nothing shifts
  - Sections are separated by 20px, blocks by 12-16px
  - Bottom padding is applied with inline style so it can never be overridden
*/

const rowBase =
  "group flex h-11 w-full shrink-0 items-center gap-3 overflow-hidden rounded-xl border pl-[15px] pr-3 text-left text-[13px] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9bc76]/70";

const rowIdle =
  "border-transparent text-[#c5c2b8] hover:bg-[#343329] hover:text-white";

const rowActive = "border-[#51452b] bg-[#403a2b] font-semibold text-[#f0d79a]";

const iconBase = "flex w-[18px] shrink-0 items-center justify-center";
const iconIdle = "text-[#aaa697] group-hover:text-[#ddc17c]";
const iconActive = "text-[#e0c47c]";

const fade = (expanded) =>
  `transition-opacity duration-200 ${
    expanded ? "opacity-100 delay-100" : "opacity-0"
  }`;

function NavItem({ to, label, icon: Icon, expanded, onNavigate, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onNavigate}
      title={!expanded ? label : undefined}
      className={({ isActive }) =>
        `${rowBase} ${isActive ? rowActive : rowIdle}`
      }
    >
      {({ isActive }) => (
        <>
          <span className={`${iconBase} ${isActive ? iconActive : iconIdle}`}>
            <Icon size={18} strokeWidth={1.8} />
          </span>
          <span className={`min-w-0 truncate ${fade(expanded)}`}>{label}</span>
        </>
      )}
    </NavLink>
  );
}

function Sidebar({ expanded, onMouseEnter, onMouseLeave, onNavigate }) {
  return (
    <aside
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        height: "100dvh",
        paddingBottom: "max(16px, env(safe-area-inset-bottom))",
      }}
      className={`
        fixed inset-y-0 left-0 z-[100]
        flex h-screen flex-col overflow-hidden
        border-r border-[#38372f] bg-[#25251f]
        px-[9px] text-[#f7f5ef]
        transition-[width,box-shadow] duration-300 ease-in-out
        motion-reduce:transition-none
        ${
          expanded
            ? "w-[250px] max-w-[85vw] shadow-[8px_0_30px_rgba(0,0,0,0.25)]"
            : "w-[68px]"
        }
      `}
    >
      {/* Brand */}
      <div className="flex h-16 shrink-0 items-center gap-3 overflow-hidden pl-1">
        <div className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-xl border border-[#a58a50] bg-[#383326] text-[#d9bc76]">
          <Gem size={23} strokeWidth={1.7} />
        </div>

        <div className={`min-w-0 ${fade(expanded)}`}>
          <h2 className="m-0 whitespace-nowrap text-xl font-bold leading-none tracking-[0.16em] text-[#f8f4e9]">
            JMS
          </h2>
          <span className="mt-1.5 block whitespace-nowrap text-[10px] font-semibold leading-none tracking-[0.14em] text-[#b4a987]">
            JEWELLERY ERP
          </span>
        </div>
      </div>

      {/* Store information */}
      <div
        className={`
          mb-5 mt-2 flex h-[52px] shrink-0 items-center gap-3
          overflow-hidden rounded-[10px] border p-[6px]
          transition-colors duration-200
          ${
            expanded
              ? "border-[#454236] bg-[#302f27]"
              : "border-transparent bg-transparent"
          }
        `}
      >
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#46402e] text-[#d9bc76]">
          <Store size={18} />
        </div>

        <div className={`flex min-w-0 flex-col gap-1.5 ${fade(expanded)}`}>
          <strong className="truncate text-[13px] font-semibold leading-none text-[#f4f1e8]">
            Jewellery Store
          </strong>
          <span className="truncate text-[11px] leading-none text-[#aaa596]">
            Management Portal
          </span>
        </div>
      </div>

      {/* Scrollable navigation */}
      <nav
        aria-label="Main navigation"
        className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex flex-col gap-5 pb-4">
          {navigationGroups.map((group) => (
            <section key={group.title} className="flex flex-col gap-1">
              {/* Heading: text when expanded, short divider when collapsed */}
              <div className="relative mb-1 h-4 w-full shrink-0">
                <p
                  className={`absolute inset-y-0 left-4 m-0 flex items-center whitespace-nowrap text-[10.5px] font-bold tracking-[0.1em] text-[#928e80] ${fade(
                    expanded
                  )}`}
                >
                  {group.title}
                </p>

                <span
                  className={`absolute left-1/2 top-1/2 h-0.5 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#444237] transition-opacity duration-200 ${
                    expanded ? "opacity-0" : "opacity-100 delay-100"
                  }`}
                />
              </div>

              {group.items.map((item) => (
                <NavItem
                  key={item.path}
                  to={item.path}
                  label={item.label}
                  icon={item.icon}
                  end={item.path === "/"}
                  expanded={expanded}
                  onNavigate={onNavigate}
                />
              ))}
            </section>
          ))}
        </div>
      </nav>

      {/* Bottom section */}
      <div className="flex shrink-0 flex-col gap-1 border-t border-[#444237] pt-3">
        <NavItem
          to="/settings"
          label="Settings"
          icon={Settings}
          expanded={expanded}
          onNavigate={onNavigate}
        />

        <button
          type="button"
          title={!expanded ? "Help & Support" : undefined}
          className={`${rowBase} ${rowIdle} cursor-pointer font-[inherit]`}
        >
          <span className={`${iconBase} ${iconIdle}`}>
            <CircleHelp size={18} strokeWidth={1.8} />
          </span>
          <span className={`min-w-0 truncate ${fade(expanded)}`}>
            Help &amp; Support
          </span>
        </button>

        {/* Admin profile */}
        <div className="mt-2 flex h-[62px] shrink-0 items-center gap-3 overflow-hidden border-t border-[#444237] pl-1.5">
          <div className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-full border border-[#bca66e] bg-[#4a4230] text-sm font-bold text-[#f1dca3]">
            A
          </div>

          <div className={`flex min-w-0 flex-1 flex-col gap-1.5 ${fade(expanded)}`}>
            <strong className="truncate text-[13px] font-semibold leading-none text-[#f4f1e8]">
              Admin User
            </strong>
            <span className="truncate text-[11px] leading-none text-[#aaa596]">
              Administrator
            </span>
          </div>

          <button
            type="button"
            aria-label="Logout"
            title="Logout"
            tabIndex={expanded ? 0 : -1}
            className={`mr-1 grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-lg bg-transparent text-[#aaa596] transition-colors duration-200 hover:bg-[#45302b] hover:text-[#ffb4a9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9bc76] ${fade(
              expanded
            )} ${expanded ? "" : "pointer-events-none"}`}
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;