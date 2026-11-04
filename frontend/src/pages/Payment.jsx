import { useMemo, useState } from "react";

import PaymentStats from "../components/Payments/PaymentStats";
import PaymentToolbar from "../components/Payments/PaymentToolbar";
import PaymentTable from "../components/Payments/PaymentTable";
import PaymentForm from "../components/Payments/PaymentForm";

const initialPayments = [
  {
    id: "PAY-2026-001",
    customer: "Rahul Sharma",
    phone: "9876543210",
    invoiceId: "INV-2026-001",
    date: "2026-11-01",
    amount: 45000,
    method: "UPI",
    status: "Completed",
    reference: "UPI982736451",
    notes: "Full payment received.",
  },
  {
    id: "PAY-2026-002",
    customer: "Priya Reddy",
    phone: "9876543211",
    invoiceId: "INV-2026-002",
    date: "2026-11-01",
    amount: 28500,
    method: "Card",
    status: "Completed",
    reference: "CARD827364",
    notes: "Card payment successful.",
  },
  {
    id: "PAY-2026-003",
    customer: "Arjun Kumar",
    phone: "9876543212",
    invoiceId: "INV-2026-003",
    date: "2026-11-02",
    amount: 15000,
    method: "Cash",
    status: "Pending",
    reference: "",
    notes: "Payment confirmation pending.",
  },
  {
    id: "PAY-2026-004",
    customer: "Sneha Patel",
    phone: "9876543213",
    invoiceId: "INV-2026-004",
    date: "2026-11-02",
    amount: 62000,
    method: "Bank Transfer",
    status: "Completed",
    reference: "BANK928374",
    notes: "Bank transfer received.",
  },
  {
    id: "PAY-2026-005",
    customer: "Vikram Rao",
    phone: "9876543214",
    invoiceId: "INV-2026-005",
    date: "2026-11-03",
    amount: 12000,
    method: "UPI",
    status: "Failed",
    reference: "UPI827364",
    notes: "Transaction failed.",
  },
  {
    id: "PAY-2026-006",
    customer: "Ananya Mehta",
    phone: "9876543215",
    invoiceId: "INV-2026-006",
    date: "2026-11-03",
    amount: 38000,
    method: "Card",
    status: "Completed",
    reference: "CARD728364",
    notes: "Payment completed.",
  },
  {
    id: "PAY-2026-007",
    customer: "Karthik Shetty",
    phone: "9876543216",
    invoiceId: "INV-2026-007",
    date: "2026-11-04",
    amount: 22500,
    method: "Cash",
    status: "Pending",
    reference: "",
    notes: "Awaiting payment confirmation.",
  },
];

const Payments = () => {
  const [payments, setPayments] = useState(initialPayments);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [methodFilter, setMethodFilter] = useState("All");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const searchTerm = search.toLowerCase();

      const matchesSearch =
        payment.id.toLowerCase().includes(searchTerm) ||
        payment.customer.toLowerCase().includes(searchTerm) ||
        payment.invoiceId.toLowerCase().includes(searchTerm) ||
        (payment.reference || "").toLowerCase().includes(searchTerm);

      const matchesStatus =
        statusFilter === "All" || payment.status === statusFilter;

      const matchesMethod =
        methodFilter === "All" || payment.method === methodFilter;

      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [payments, search, statusFilter, methodFilter]);

  const handleAddPayment = () => {
    setSelectedPayment(null);
    setIsFormOpen(true);
  };

  const handleViewPayment = (payment) => {
    setSelectedPayment(payment);
    setIsFormOpen(true);
  };

  const handleSavePayment = (paymentData) => {
    const newPayment = {
      ...paymentData,
      id: `PAY-${new Date().getFullYear()}-${String(
        payments.length + 1
      ).padStart(3, "0")}`,
    };

    setPayments((prev) => [newPayment, ...prev]);
    setIsFormOpen(false);
    setSelectedPayment(null);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedPayment(null);
  };

  return (
    <div className="min-h-full min-w-0 space-y-5 bg-[#faf9f6] p-4 sm:p-5 lg:p-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
            Payments
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage and monitor all customer payment transactions.
          </p>
        </div>
      </div>

      {/* Statistics */}
      <PaymentStats payments={payments} />

      {/* Toolbar */}
      <PaymentToolbar
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        methodFilter={methodFilter}
        setMethodFilter={setMethodFilter}
        onAddPayment={handleAddPayment}
      />

      {/* Transactions */}
      <PaymentTable
        payments={filteredPayments}
        onViewPayment={handleViewPayment}
      />

      {/* Payment Modal */}
      <PaymentForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSavePayment}
        selectedPayment={selectedPayment}
      />
    </div>
  );
};

export default Payments;