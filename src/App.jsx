import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Sidebar from "./components/Common/Sidebar";
import Topbar from "./components/Common/Topbar";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Inventory from "./pages/Inventory";
import MetalRates from "./pages/MetalRates";
import Customers from "./pages/Customers";

function AppLayout() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  // Only touch screens collapse after picking a page.
  // On desktop the sidebar stays open until the mouse leaves it.
  const handleNavigate = () => {
    if (window.matchMedia("(max-width: 767px)").matches) {
      setSidebarExpanded(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <Sidebar
        expanded={sidebarExpanded}
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
        onNavigate={handleNavigate}
      />

      {/* Tap-outside backdrop for touch screens only */}
      {sidebarExpanded && (
        <div
          aria-hidden="true"
          onClick={() => setSidebarExpanded(false)}
          className="fixed inset-0 z-[90] bg-black/30 md:hidden"
        />
      )}

      {/*
        Desktop (md and up): content resizes with the sidebar (68px <-> 250px).
        Mobile: content stays beside the 68px rail and the sidebar overlays it.
      */}
      <main
        className={`
          ml-[68px] min-h-screen min-w-0
          transition-[margin] duration-300 ease-in-out
          motion-reduce:transition-none
          ${sidebarExpanded ? "md:ml-[250px]" : "md:ml-[68px]"}
        `}
      >
        <Topbar />

        <div className="w-full min-w-0 max-w-full p-[30px] max-[768px]:p-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/metal-rates" element={<MetalRates />} />
            <Route path="/customers" element={<Customers />} />

            <Route
              path="*"
              element={
                <section className="rounded-[14px] border border-[#ebe8e1] bg-white p-6">
                  <h2 className="text-lg font-bold text-[#292821]">
                    Page coming soon
                  </h2>
                  <p className="mt-2 text-sm text-[#89867d]">Later</p>
                </section>
              }
            />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      {/* Login page without dashboard layout */}
      <Route path="/login" element={<Login />} />

      {/* Dashboard and application pages */}
      <Route path="/*" element={<AppLayout />} />
    </Routes>
  );
}

export default App;