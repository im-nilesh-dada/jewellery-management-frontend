import { useMemo, useState } from "react";

import SalesReportStats from "../components/SalesReport/SalesReportStats";
import SalesReportToolbar from "../components/SalesReport/SalesReportToolbar";
import SalesReportChart from "../components/SalesReport/SalesReportChart";
import SalesReportTable from "../components/SalesReport/SalesReportTable";

const initialSales = [
  {
    id: 1,
    invoiceId: "INV-2026-001",
    customer: "Rahul Sharma",
    phone: "9876543210",
    products: "Gold Necklace, Gold Ring",
    itemsCount: 2,
    date: "2026-11-01",
    amount: 85000,
    method: "UPI",
    status: "Completed",
  },
  {
    id: 2,
    invoiceId: "INV-2026-002",
    customer: "Priya Reddy",
    phone: "9876543211",
    products: "Diamond Earrings",
    itemsCount: 1,
    date: "2026-11-01",
    amount: 62000,
    method: "Card",
    status: "Completed",
  },
  {
    id: 3,
    invoiceId: "INV-2026-003",
    customer: "Arjun Kumar",
    phone: "9876543212",
    products: "Silver Bracelet, Silver Chain",
    itemsCount: 2,
    date: "2026-11-02",
    amount: 18500,
    method: "Cash",
    status: "Pending",
  },
  {
    id: 4,
    invoiceId: "INV-2026-004",
    customer: "Sneha Patel",
    phone: "9876543213",
    products: "Gold Bangles",
    itemsCount: 2,
    date: "2026-11-02",
    amount: 125000,
    method: "Bank Transfer",
    status: "Completed",
  },
  {
    id: 5,
    invoiceId: "INV-2026-005",
    customer: "Vikram Rao",
    phone: "9876543214",
    products: "Gold Chain",
    itemsCount: 1,
    date: "2026-11-03",
    amount: 45000,
    method: "UPI",
    status: "Cancelled",
  },
  {
    id: 6,
    invoiceId: "INV-2026-006",
    customer: "Ananya Mehta",
    phone: "9876543215",
    products: "Diamond Ring, Gold Pendant",
    itemsCount: 2,
    date: "2026-11-03",
    amount: 95000,
    method: "Card",
    status: "Completed",
  },
  {
    id: 7,
    invoiceId: "INV-2026-007",
    customer: "Karthik Shetty",
    phone: "9876543216",
    products: "Gold Necklace",
    itemsCount: 1,
    date: "2026-11-04",
    amount: 78000,
    method: "Cash",
    status: "Completed",
  },
  {
    id: 8,
    invoiceId: "INV-2026-008",
    customer: "Meera Nair",
    phone: "9876543217",
    products: "Gold Earrings",
    itemsCount: 1,
    date: "2026-10-25",
    amount: 32000,
    method: "UPI",
    status: "Completed",
  },
  {
    id: 9,
    invoiceId: "INV-2026-009",
    customer: "Rohit Verma",
    phone: "9876543218",
    products: "Diamond Necklace",
    itemsCount: 1,
    date: "2026-10-18",
    amount: 145000,
    method: "Bank Transfer",
    status: "Completed",
  },
  {
    id: 10,
    invoiceId: "INV-2026-010",
    customer: "Divya Rao",
    phone: "9876543219",
    products: "Silver Anklet, Silver Ring",
    itemsCount: 2,
    date: "2026-09-28",
    amount: 12500,
    method: "Cash",
    status: "Pending",
  },
];

const getLocalDateString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const SalesReports = () => {
  const [sales] = useState(initialSales);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("all");

  const dateFilteredSales = useMemo(() => {
    const today = new Date();
    const todayString = getLocalDateString(today);

    let startDate = null;

    if (dateFilter === "today") {
      startDate = todayString;
    } else if (dateFilter === "7days") {
      const date = new Date();
      date.setDate(date.getDate() - 6);
      startDate = getLocalDateString(date);
    } else if (dateFilter === "30days") {
      const date = new Date();
      date.setDate(date.getDate() - 29);
      startDate = getLocalDateString(date);
    }

    return sales.filter((sale) => {
      if (sale.date > todayString) return false;

      return !startDate || sale.date >= startDate;
    });
  }, [sales, dateFilter]);

  const filteredSales = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    if (!searchTerm) return dateFilteredSales;

    return dateFilteredSales.filter((sale) => {
      return (
        sale.invoiceId.toLowerCase().includes(searchTerm) ||
        sale.customer.toLowerCase().includes(searchTerm) ||
        sale.phone.includes(searchTerm) ||
        sale.products.toLowerCase().includes(searchTerm)
      );
    });
  }, [dateFilteredSales, search]);

  const handleExport = () => {
    if (filteredSales.length === 0) {
      window.alert("No sales records available to export.");
      return;
    }

    const headers = [
      "Invoice ID",
      "Customer",
      "Phone",
      "Products",
      "Items",
      "Date",
      "Amount",
      "Payment Method",
      "Status",
    ];

    const rows = filteredSales.map((sale) => [
      sale.invoiceId,
      sale.customer,
      sale.phone,
      sale.products,
      sale.itemsCount,
      sale.date,
      sale.amount,
      sale.method,
      sale.status,
    ]);

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `sales-report-${getLocalDateString(new Date())}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-full min-w-0 space-y-5 bg-[#faf9f6] p-4 sm:p-5 lg:p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
          Sales Reports
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Track sales performance, revenue and customer transactions.
        </p>
      </div>

      {/* Statistics */}
      <SalesReportStats sales={dateFilteredSales} />

      {/* Sales Chart */}
      <SalesReportChart sales={dateFilteredSales} />

      {/* Search and Filters */}
      <SalesReportToolbar
        search={search}
        setSearch={setSearch}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        onExport={handleExport}
      />

      {/* Sales Transactions */}
      <SalesReportTable sales={filteredSales} />
    </div>
  );
};

export default SalesReports;