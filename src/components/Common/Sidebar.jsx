
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
  ChevronLeft,
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

function Sidebar() {
  const linkClasses =
    "relative flex min-h-[43px] w-full items-center gap-3 rounded-lg border border-transparent px-3 my-[3px] text-left text-xs font-medium text-[#c5c2b8] transition-colors duration-200 hover:bg-[#343329] hover:text-white [&>svg]:shrink-0 [&>svg]:text-[#aaa697] hover:[&>svg]:text-[#ddc17c]";

  return (
    <aside className="fixed inset-y-0 left-0 z-[100] flex h-screen w-[250px] flex-col overflow-y-auto border-r border-[#38372f] bg-[#25251f] px-[15px] pb-[14px] pt-[22px] text-[#f7f5ef] [scrollbar-color:#514e40_#25251f] [scrollbar-width:thin] max-[768px]:w-[230px] max-[768px]:px-3">

      {/* Brand */}
      <div className="flex min-h-12 items-center gap-[11px] px-[5px]">
        <div className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-xl border border-[#a58a50] bg-[#383326] text-[#d9bc76]">
          <Gem size={23} strokeWidth={1.7} />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="m-0 text-xl font-bold tracking-[0.16em] text-[#f8f4e9]">
            JMS
          </h2>
          <span className="mt-1 block text-[9px] font-semibold tracking-[0.14em] text-[#b4a987]">
            JEWELLERY ERP
          </span>
        </div>

        <button
          type="button"
          aria-label="Sidebar menu"
          title="Sidebar menu"
          className="grid h-[29px] w-[29px] shrink-0 place-items-center rounded-md border border-[#48463b] bg-transparent text-[#c7c2b5] hover:bg-[#39382f]"
        >
          <ChevronLeft size={17} />
        </button>
      </div>

      {/* Store information */}
      <div className="my-[27px] mb-6 flex items-center gap-[11px] rounded-[10px] border border-[#454236] bg-[#302f27] p-[13px_11px]">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#46402e] text-[#d9bc76]">
          <Store size={18} />
        </div>

        <div className="flex min-w-0 flex-col gap-[5px]">
          <strong className="overflow-hidden text-ellipsis whitespace-nowrap text-xs font-semibold text-[#f4f1e8]">
            Jewellery Store
          </strong>
          <span className="text-[10px] text-[#aaa596]">
            Management Portal
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav
        className="flex-1"
        aria-label="Main navigation"
      >
        {navigationGroups.map((group) => (
          <div className="mb-[23px]" key={group.title}>
            <p className="mb-[10px] mt-0 px-[11px] text-[10px] font-bold tracking-[0.1em] text-[#928e80]">
              {group.title}
            </p>

            {group.items.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    `${linkClasses} ${
                      isActive
                        ? "!border-[#51452b] !bg-[#403a2b] !font-semibold !text-[#f0d79a] [&>svg]:!text-[#e0c47c]"
                        : ""
                    }`
                  }
                >
                  <Icon size={18} strokeWidth={1.8} />
                  <span className="min-w-0">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom navigation */}
      <div className="mt-[10px] shrink-0">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `${linkClasses} ${
              isActive
                ? "!border-[#51452b] !bg-[#403a2b] !text-[#f0d79a] [&>svg]:!text-[#e0c47c]"
                : ""
            }`
          }
        >
          <Settings size={18} strokeWidth={1.8} />
          <span>Settings</span>
        </NavLink>

        <button
          type="button"
          className={`${linkClasses} font-[inherit]`}
        >
          <CircleHelp size={18} strokeWidth={1.8} />
          <span>Help &amp; Support</span>
        </button>

        <div className="mx-[2px] my-[15px] h-px bg-[#444237]" />

        {/* Admin profile */}
        <div className="flex items-center gap-2.5 px-[2px] pb-[3px] pt-[5px]">
          <div className="grid h-[37px] w-[37px] shrink-0 place-items-center rounded-full border border-[#bca66e] bg-[#4a4230] text-sm font-bold text-[#f1dca3]">
            A
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-[5px]">
            <strong className="overflow-hidden text-ellipsis whitespace-nowrap text-xs font-semibold text-[#f4f1e8]">
              Admin User
            </strong>
            <span className="text-[10px] text-[#aaa596]">
              Administrator
            </span>
          </div>

          <button
            type="button"
            aria-label="Logout"
            title="Logout"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-transparent text-[#aaa596] hover:bg-[#45302b] hover:text-[#ffb4a9]"
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
