import { Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/Common/Sidebar";
import Topbar from "./components/Common/Topbar";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Inventory from "./pages/Inventory";
import MetalRates from "./pages/MetalRates";

function AppLayout() {
  return (
    <div className="min-h-screen bg-[#faf9f6]">
      {/* Fixed sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="ml-[250px] min-h-screen min-w-0 max-[768px]:ml-[230px]">
        <Topbar />

        <div className="p-[30px] max-[768px]:p-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />

            <Route path="/products" element={<Products />} />

            <Route path="/inventory" element={<Inventory />} />

            <Route path="/metal-rates" element={<MetalRates />} />

            <Route
              path="*"
              element={
                <section className="rounded-[14px] border border-[#ebe8e1] bg-white p-6">
                  <h2 className="text-lg font-bold text-[#292821]">
                    Page coming soon
                  </h2>

                  <p className="mt-2 text-sm text-[#89867d]">
                    Later
                  </p>
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

      {/* Dashboard and other application pages */}
      <Route path="/*" element={<AppLayout />} />
    </Routes>
  );
}

export default App;