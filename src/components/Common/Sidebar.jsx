import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Package,
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
    items: [
      { label: "Dashboard", path: "/", icon: LayoutDashboard },
    ],
  },
  {
    title: "INVENTORY",
    items: [
      { label: "Products", path: "/products", icon: Gem },
      { label: "Stock Management", path: "/inventory", icon: Boxes },
      { label: "Metal Rates", path: "/metal-rates", icon: Package },
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
      {
        label: "Sales Reports",
        path: "/reports",
        icon: ChartNoAxesCombined,
      },
    ],
  },
];

function Sidebar({ expanded, onMouseEnter, onMouseLeave }) {
  const linkClasses =
    "my-[3px] flex min-h-[43px] w-full items-center gap-3 rounded-xl border border-transparent px-3 pr-4 text-left text-xs font-medium text-[#c5c2b8] transition-[background-color,border-color,color] duration-200 ease-in-out hover:bg-[#343329] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9bc76]/70 [&>svg]:shrink-0 [&>svg]:text-[#aaa697] hover:[&>svg]:text-[#ddc17c]";

  const activeClasses =
    "!border-[#51452b] !bg-[#403a2b] !font-semibold !text-[#f0d79a] [&>svg]:!text-[#e0c47c]";

  return (
    <aside
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`
        fixed inset-y-0 left-0 z-[100]
        flex h-screen flex-col
        overflow-hidden
        border-r border-[#38372f]
        bg-[#25251f] text-[#f7f5ef]
        ${expanded ? "w-[250px] px-[15px]" : "w-[68px] px-[9px]"}
        transition-[width,padding] duration-300 ease-in-out
        motion-reduce:transition-none
      `}
    >
      {/* Brand */}
      <div className="flex h-[64px] shrink-0 items-center gap-[11px] overflow-hidden px-[5px]">
        <div className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-xl border border-[#a58a50] bg-[#383326] text-[#d9bc76]">
          <Gem size={23} strokeWidth={1.7} />
        </div>

        <div
          className={`min-w-0 flex-1 overflow-hidden transition-opacity duration-200 ${
            expanded ? "opacity-100" : "opacity-0"
          }`}
        >
          <h2 className="m-0 whitespace-nowrap text-xl font-bold tracking-[0.16em] text-[#f8f4e9]">
            JMS
          </h2>

          <span className="mt-1 block whitespace-nowrap text-[9px] font-semibold tracking-[0.14em] text-[#b4a987]">
            JEWELLERY ERP
          </span>
        </div>
      </div>

      {/* Store information */}
      <div
        className={`
          my-5 flex min-h-[58px] shrink-0 items-center gap-[11px]
          overflow-hidden rounded-[10px] border p-2
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

        {expanded && (
          <div className="flex min-w-0 flex-col gap-[5px]">
            <strong className="whitespace-nowrap text-xs font-semibold text-[#f4f1e8]">
              Jewellery Store
            </strong>

            <span className="whitespace-nowrap text-[10px] text-[#aaa596]">
              Management Portal
            </span>
          </div>
        )}
      </div>

      {/* Scrollable navigation */}
      <nav
        className="
          min-h-0 flex-1
          overflow-x-hidden overflow-y-auto
          mr-[-3px] pr-[5px] pl-[1px] pb-3
          [scrollbar-color:#514e40_transparent]
          [scrollbar-width:thin]
        "
        aria-label="Main navigation"
      >
        {navigationGroups.map((group) => (
          <div
            className={expanded ? "mb-5" : "mb-4"}
            key={group.title}
          >
            {/* Section heading */}
            <div
              className={`mb-[10px] flex h-[14px] items-center ${
                expanded
                  ? "justify-start px-3"
                  : "justify-center"
              }`}
            >
              {expanded ? (
                <p className="m-0 whitespace-nowrap text-[10px] font-bold tracking-[0.1em] text-[#928e80]">
                  {group.title}
                </p>
              ) : (
                <span className="h-0.5 w-8 shrink-0 rounded-full bg-[#444237]" />
              )}
            </div>

            {/* Navigation links */}
            {group.items.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  title={!expanded ? item.label : undefined}
                  className={({ isActive }) =>
                    `${linkClasses} ${
                      !expanded
                        ? "justify-center gap-0 px-0"
                        : "mr-1"
                    } ${isActive ? activeClasses : ""}`
                  }
                >
                  <span className="flex w-[18px] shrink-0 items-center justify-center">
                    <Icon size={18} strokeWidth={1.8} />
                  </span>

                  {expanded && (
                    <span className="min-w-0 whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="mt-2 shrink-0 border-t border-[#444237] pt-2">
        <NavLink
          to="/settings"
          title={!expanded ? "Settings" : undefined}
          className={({ isActive }) =>
            `${linkClasses} ${
              !expanded
                ? "justify-center gap-0 px-0"
                : "mr-1"
            } ${isActive ? activeClasses : ""}`
          }
        >
          <span className="flex w-[18px] shrink-0 items-center justify-center">
            <Settings size={18} strokeWidth={1.8} />
          </span>

          {expanded && (
            <span className="whitespace-nowrap">Settings</span>
          )}
        </NavLink>

        <button
          type="button"
          title={!expanded ? "Help & Support" : undefined}
          className={`${linkClasses} ${
            !expanded
              ? "justify-center gap-0 px-0"
              : "mr-1"
          } font-[inherit]`}
        >
          <span className="flex w-[18px] shrink-0 items-center justify-center">
            <CircleHelp size={18} strokeWidth={1.8} />
          </span>

          {expanded && (
            <span className="whitespace-nowrap">
              Help &amp; Support
            </span>
          )}
        </button>

        {/* Admin profile */}
        <div
          className={`
            mt-3 flex min-h-[48px] items-center
            overflow-hidden border-t border-[#444237] pt-3
            ${
              expanded
                ? "gap-2.5 px-[2px]"
                : "justify-center"
            }
          `}
        >
          <div className="grid h-[37px] w-[37px] shrink-0 place-items-center rounded-full border border-[#bca66e] bg-[#4a4230] text-sm font-bold text-[#f1dca3]">
            A
          </div>

          {expanded && (
            <>
              <div className="flex min-w-0 flex-1 flex-col gap-[5px]">
                <strong className="whitespace-nowrap text-xs font-semibold text-[#f4f1e8]">
                  Admin User
                </strong>

                <span className="whitespace-nowrap text-[10px] text-[#aaa596]">
                  Administrator
                </span>
              </div>

              <button
                type="button"
                aria-label="Logout"
                title="Logout"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-transparent text-[#aaa596] transition-colors duration-200 hover:bg-[#45302b] hover:text-[#ffb4a9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9bc76]"
              >
                <LogOut size={17} />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;