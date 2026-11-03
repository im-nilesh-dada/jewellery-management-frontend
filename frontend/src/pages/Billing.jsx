
import { useMemo, useState } from "react";
import {
  ReceiptText,
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  X,
  Printer,
} from "lucide-react";

const initialInvoices = [
  {
    id: "INV-1001",
    customer: "Arjun Menon",
    date: "2026-10-25",
    items: 2,
    subtotal: 78500,
    discount: 500,
    taxRate: 3,
    status: "Paid",
  },
  {
    id: "INV-1002",
    customer: "Anjali Nair",
    date: "2026-10-26",
    items: 1,
    subtotal: 46500,
    discount: 0,
    taxRate: 3,
    status: "Unpaid",
  },
  {
    id: "INV-1003",
    customer: "Rahul Kumar",
    date: "2026-10-27",
    items: 3,
    subtotal: 8500,
    discount: 200,
    taxRate: 3,
    status: "Paid",
  },
];

const emptyForm = {
  customer: "",
  date: new Date().toISOString().slice(0, 10),
  items: 1,
  subtotal: "",
  discount: 0,
  taxRate: 3,
  status: "Unpaid",
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

const calculateTotal = (invoice) => {
  const subtotal = Number(invoice.subtotal) || 0;
  const discount = Number(invoice.discount) || 0;
  const taxRate = Number(invoice.taxRate) || 0;
  const taxableAmount = Math.max(0, subtotal - discount);

  return taxableAmount + taxableAmount * (taxRate / 100);
};

const primaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-[#9a7837] bg-[#9a7837] px-4 py-2.5 text-[13px] font-semibold text-white transition hover:border-[#806128] hover:bg-[#806128]";

const iconButtonClass =
  "grid h-8 w-8 shrink-0 place-items-center rounded-[7px] border border-[#e9e3d8] bg-white text-[#776e5e] transition hover:border-[#b59651] hover:text-[#9a7837]";

const inputClass =
  "w-full rounded-lg border border-[#e5dfd3] bg-white px-3 py-[11px] text-sm font-normal text-[#302c25] outline-none transition focus:border-[#b59651] focus:ring-2 focus:ring-[#b59651]/15";

const modalOverlayClass =
  "fixed inset-0 z-[1000] flex items-center justify-center overflow-y-auto bg-[#201d18]/45 p-4 sm:p-5";

const modalClass =
  "my-auto max-h-[90vh] w-full max-w-[570px] overflow-y-auto rounded-[14px] border border-[#e9e3d8] bg-white p-[18px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] sm:p-[25px]";

export default function Billing() {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [form, setForm] = useState({ ...emptyForm });

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch = `${invoice.id} ${invoice.customer}`
      .toLowerCase()
      .includes(search.toLowerCase().trim());

    const matchesStatus =
      statusFilter === "All" || invoice.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totals = useMemo(
    () => ({
      count: invoices.length,
      paid: invoices.filter((invoice) => invoice.status === "Paid").length,
      unpaid: invoices.filter((invoice) => invoice.status === "Unpaid").length,
      revenue: invoices
        .filter((invoice) => invoice.status === "Paid")
        .reduce((sum, invoice) => sum + calculateTotal(invoice), 0),
    }),
    [invoices]
  );

  const previewTotal = calculateTotal(form);

  const openAddForm = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setShowForm(true);
  };

  const openEditForm = (invoice) => {
    setEditingId(invoice.id);
    setForm({
      customer: invoice.customer,
      date: invoice.date,
      items: invoice.items,
      subtotal: String(invoice.subtotal),
      discount: invoice.discount,
      taxRate: invoice.taxRate,
      status: invoice.status,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ ...emptyForm });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const subtotal = Number(form.subtotal);
    const discount = Number(form.discount);
    const taxRate = Number(form.taxRate);
    const items = Number(form.items);

    if (!form.customer.trim() || subtotal <= 0 || items < 1) {
      window.alert(
        "Enter a customer, a valid subtotal, and at least one item."
      );
      return;
    }

    if (
      !Number.isFinite(subtotal) ||
      !Number.isFinite(discount) ||
      !Number.isFinite(taxRate) ||
      discount < 0 ||
      discount > subtotal ||
      taxRate < 0
    ) {
      window.alert("Check the discount and tax values.");
      return;
    }

    const invoiceData = {
      ...form,
      customer: form.customer.trim(),
      items,
      subtotal,
      discount,
      taxRate,
    };

    if (editingId !== null) {
      setInvoices((previous) =>
        previous.map((invoice) =>
          invoice.id === editingId
            ? { ...invoice, ...invoiceData }
            : invoice
        )
      );

      setSelectedInvoice((previous) =>
        previous?.id === editingId
          ? { ...previous, ...invoiceData }
          : previous
      );
    } else {
      setInvoices((previous) => [
        {
          ...invoiceData,
          id: `INV-${Date.now().toString().slice(-6)}`,
        },
        ...previous,
      ]);
    }

    closeForm();
  };

  const deleteInvoice = (id) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      setInvoices((previous) =>
        previous.filter((invoice) => invoice.id !== id)
      );

      setSelectedInvoice((previous) =>
        previous?.id === id ? null : previous
      );
    }
  };

  const printInvoice = () => window.print();

  const statCards = [
    {
      label: "Total Invoices",
      value: totals.count,
      icon: ReceiptText,
      iconStyle: "bg-[#f5efdf] text-[#9a7837]",
    },
    {
      label: "Paid Invoices",
      value: totals.paid,
      icon: ReceiptText,
      iconStyle: "bg-[#eaf6ed] text-[#32834b]",
    },
    {
      label: "Unpaid Invoices",
      value: totals.unpaid,
      icon: ReceiptText,
      iconStyle: "bg-[#fff4df] text-[#ad7a21]",
    },
    {
      label: "Paid Invoice Value",
      value: formatCurrency(totals.revenue),
      icon: ReceiptText,
      iconStyle: "bg-[#f5efdf] text-[#9a7837]",
    },
  ];

  return (
    <div className="flex min-w-0 flex-col gap-6 text-[#302c25]">
      {/* Page heading */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="mb-[7px] text-2xl font-bold sm:text-[28px]">
            Billing
          </h1>
          <p className="text-sm text-[#898276]">
            Create invoices and manage customer billing records.
          </p>
        </div>

        <button onClick={openAddForm} className={primaryButtonClass}>
          <Plus size={18} />
          Create Invoice
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 min-[1101px]:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon, iconStyle }) => (
          <div
            key={label}
            className="flex min-w-0 items-center gap-[13px] rounded-xl border border-[#e9e3d8] bg-white p-4 sm:p-5"
          >
            <span
              className={`grid h-11 w-11 shrink-0 place-items-center rounded-[10px] ${iconStyle}`}
            >
              <Icon size={21} />
            </span>

            <div className="min-w-0">
              <p className="mb-[7px] text-xs text-[#898276]">{label}</p>
              <h2 className="break-words text-lg font-bold sm:text-[21px]">
                {value}
              </h2>
            </div>
          </div>
        ))}
      </div>

      {/* Invoice directory */}
      <section className="overflow-hidden rounded-xl border border-[#e9e3d8] bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#eee9e0] p-4 sm:p-[22px]">
          <div>
            <h2 className="mb-1.5 text-[17px] font-bold">
              Invoice Directory
            </h2>
            <p className="text-sm text-[#898276]">
              Search, view, and maintain invoices.
            </p>
          </div>

          <div className="flex w-full flex-wrap items-center gap-2.5 sm:w-auto">
            <div className="flex min-w-0 flex-1 items-center gap-[9px] rounded-lg border border-[#e5dfd3] px-3 py-2.5 text-[#918878] transition focus-within:border-[#b59651] sm:w-[260px] sm:flex-none">
              <Search size={18} className="shrink-0" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search invoice or customer..."
                className="w-full min-w-0 bg-transparent text-[13px] text-[#302c25] outline-none placeholder:text-[#a49b8d]"
              />
              {search && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setSearch("")}
                  className="shrink-0 text-[#898276] hover:text-[#9a7837]"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter invoices by payment status"
              className="min-w-0 rounded-lg border border-[#e5dfd3] bg-white px-3 py-2.5 text-[13px] text-[#514b41] outline-none focus:border-[#b59651]"
            >
              {["All", "Paid", "Unpaid"].map((status) => (
                <option key={status} value={status}>
                  {status === "All" ? "All statuses" : status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse text-left whitespace-nowrap">
            <thead>
              <tr className="bg-[#faf8f3]">
                {[
                  "Invoice ID",
                  "Customer",
                  "Date",
                  "Items",
                  "Total Amount",
                  "Status",
                  "Actions",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-[17px] py-[14px] text-[11px] font-bold tracking-[0.4px] text-[#81796c] uppercase"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="border-b border-[#f0ece5] transition last:border-b-0 hover:bg-[#fdfbf7]"
                >
                  <td className="px-[17px] py-4">
                    <strong className="text-[13px] font-semibold text-[#8b6c32]">
                      {invoice.id}
                    </strong>
                  </td>

                  <td className="px-[17px] py-4 text-[13px] text-[#514b41]">
                    {invoice.customer}
                  </td>

                  <td className="px-[17px] py-4 text-[13px] text-[#514b41]">
                    {invoice.date}
                  </td>

                  <td className="px-[17px] py-4 text-[13px] text-[#514b41]">
                    {invoice.items}
                  </td>

                  <td className="px-[17px] py-4 text-[13px] font-semibold text-[#514b41]">
                    {formatCurrency(calculateTotal(invoice))}
                  </td>

                  <td className="px-[17px] py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-[5px] text-[11px] font-semibold ${
                        invoice.status === "Paid"
                          ? "bg-[#eaf6ed] text-[#32834b]"
                          : "bg-[#fff4df] text-[#986915]"
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </td>

                  <td className="px-[17px] py-4">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        title="View invoice"
                        aria-label={`View ${invoice.id}`}
                        onClick={() => setSelectedInvoice(invoice)}
                        className={iconButtonClass}
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        type="button"
                        title="Edit invoice"
                        aria-label={`Edit ${invoice.id}`}
                        onClick={() => openEditForm(invoice)}
                        className={iconButtonClass}
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        title="Delete invoice"
                        aria-label={`Delete ${invoice.id}`}
                        onClick={() => deleteInvoice(invoice.id)}
                        className={`${iconButtonClass} hover:border-[#e7b7b2] hover:bg-[#fff5f4] hover:text-[#c0392b]`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredInvoices.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-10 text-center text-sm text-[#898276]"
                  >
                    <ReceiptText
                      size={30}
                      className="mx-auto mb-3 text-[#c8b994]"
                    />
                    No invoices found. Try changing your search or filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-[#f0ece5] px-5 py-[15px] text-xs text-[#898276]">
          Showing {filteredInvoices.length} of {invoices.length} invoices
        </div>
      </section>

      {/* Create / Edit invoice modal */}
      {showForm && (
        <div
          className={modalOverlayClass}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeForm();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="billing-form-title"
            className={modalClass}
          >
            <div className="mb-[23px] flex items-start justify-between gap-[15px]">
              <div>
                <h2
                  id="billing-form-title"
                  className="mb-1.5 text-[21px] font-bold"
                >
                  {editingId !== null ? "Edit Invoice" : "Create Invoice"}
                </h2>
                <p className="text-[13px] text-[#898276]">
                  Enter invoice and billing details.
                </p>
              </div>

              <button
                type="button"
                aria-label="Close invoice form"
                onClick={closeForm}
                className={iconButtonClass}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-[17px]">
              <label className="flex flex-col gap-2 text-[13px] font-semibold text-[#514b41]">
                Customer Name *
                <input
                  required
                  value={form.customer}
                  onChange={(event) =>
                    setForm({ ...form, customer: event.target.value })
                  }
                  placeholder="Enter customer name"
                  className={inputClass}
                />
              </label>

              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-[13px] font-semibold text-[#514b41]">
                  Invoice Date *
                  <input
                    required
                    type="date"
                    value={form.date}
                    onChange={(event) =>
                      setForm({ ...form, date: event.target.value })
                    }
                    className={inputClass}
                  />
                </label>

                <label className="flex flex-col gap-2 text-[13px] font-semibold text-[#514b41]">
                  Number of Items *
                  <input
                    required
                    type="number"
                    min="1"
                    step="1"
                    value={form.items}
                    onChange={(event) =>
                      setForm({ ...form, items: event.target.value })
                    }
                    className={inputClass}
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-[13px] font-semibold text-[#514b41]">
                  Subtotal (₹) *
                  <input
                    required
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={form.subtotal}
                    onChange={(event) =>
                      setForm({ ...form, subtotal: event.target.value })
                    }
                    placeholder="Before discount and tax"
                    className={inputClass}
                  />
                </label>

                <label className="flex flex-col gap-2 text-[13px] font-semibold text-[#514b41]">
                  Discount (₹)
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.discount}
                    onChange={(event) =>
                      setForm({ ...form, discount: event.target.value })
                    }
                    className={inputClass}
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-[13px] font-semibold text-[#514b41]">
                  Tax Rate (%)
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={form.taxRate}
                    onChange={(event) =>
                      setForm({ ...form, taxRate: event.target.value })
                    }
                    className={inputClass}
                  />
                </label>

                <label className="flex flex-col gap-2 text-[13px] font-semibold text-[#514b41]">
                  Payment Status
                  <select
                    value={form.status}
                    onChange={(event) =>
                      setForm({ ...form, status: event.target.value })
                    }
                    className={inputClass}
                  >
                    <option value="Unpaid">Unpaid</option>
                    <option value="Paid">Paid</option>
                  </select>
                </label>
              </div>

              <div className="flex flex-col gap-[7px] rounded-[10px] border border-[#e9e3d8] bg-[#faf8f3] p-4">
                <span className="text-xs text-[#81796c]">
                  Estimated invoice total
                </span>
                <strong className="text-[23px] font-bold text-[#8b6c32]">
                  {formatCurrency(previewTotal)}
                </strong>
                <small className="text-[11px] text-[#898276]">
                  Subtotal − discount + tax on the discounted amount
                </small>
              </div>

              <div className="flex flex-wrap justify-end gap-2.5">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-lg border border-[#e5dfd3] bg-white px-[15px] py-2.5 text-[13px] font-medium text-[#514b41] transition hover:bg-[#faf8f3]"
                >
                  Cancel
                </button>

                <button type="submit" className={primaryButtonClass}>
                  {editingId !== null ? "Save Changes" : "Create Invoice"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* Invoice preview modal */}
      {selectedInvoice && (
        <div
          className={`${modalOverlayClass} print:static print:block print:bg-white print:p-0`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedInvoice(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="invoice-preview-title"
            className={`${modalClass} billing-invoice-preview print:my-0 print:max-h-none print:max-w-none print:overflow-visible print:border-0 print:p-0 print:shadow-none`}
          >
            <div className="no-print mb-[23px] flex items-start justify-between gap-[15px]">
              <div>
                <h2
                  id="invoice-preview-title"
                  className="mb-1.5 text-[21px] font-bold"
                >
                  Invoice Preview
                </h2>
                <p className="text-[13px] text-[#898276]">
                  {selectedInvoice.id}
                </p>
              </div>

              <button
                type="button"
                aria-label="Close invoice preview"
                onClick={() => setSelectedInvoice(null)}
                className={iconButtonClass}
              >
                <X size={20} />
              </button>
            </div>

            {/* Printable invoice */}
            <div className="invoice-paper border border-[#e9e3d8] bg-white p-4 text-[#302c25] sm:p-[26px]">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-[10px] bg-[#9a7837] text-[25px] font-bold text-white">
                  J
                </div>

                <div>
                  <h2 className="mb-[5px] text-[19px] font-bold">
                    Jewellery Shop
                  </h2>
                  <p className="text-xs text-[#898276]">Sales Invoice</p>
                </div>
              </div>

              <div className="my-[22px] h-px bg-[#e9e3d8]" />

              <div className="flex justify-between gap-4">
                <div className="flex flex-col gap-[7px]">
                  <span className="text-[10px] tracking-[0.7px] text-[#898276]">
                    INVOICE NUMBER
                  </span>
                  <strong className="text-[13px]">
                    {selectedInvoice.id}
                  </strong>
                </div>

                <div className="flex flex-col gap-[7px] text-right">
                  <span className="text-[10px] tracking-[0.7px] text-[#898276]">
                    INVOICE DATE
                  </span>
                  <strong className="text-[13px]">
                    {selectedInvoice.date}
                  </strong>
                </div>
              </div>

              <div className="my-6 flex flex-col gap-[7px]">
                <span className="text-[10px] tracking-[0.7px] text-[#898276]">
                  BILL TO
                </span>
                <strong className="text-[13px]">
                  {selectedInvoice.customer}
                </strong>
              </div>

              <div className="flex items-center justify-between gap-[15px] border-b border-[#f0ece5] py-3 text-[13px]">
                <span>Items ({selectedInvoice.items})</span>
                <strong>{formatCurrency(selectedInvoice.subtotal)}</strong>
              </div>

              <div className="flex items-center justify-between gap-[15px] border-b border-[#f0ece5] py-3 text-[13px]">
                <span>Discount</span>
                <strong>
                  - {formatCurrency(selectedInvoice.discount)}
                </strong>
              </div>

              <div className="flex items-center justify-between gap-[15px] border-b border-[#f0ece5] py-3 text-[13px]">
                <span>Tax ({selectedInvoice.taxRate}%)</span>
                <strong>
                  {formatCurrency(
                    Math.max(
                      0,
                      selectedInvoice.subtotal - selectedInvoice.discount
                    ) *
                      (selectedInvoice.taxRate / 100)
                  )}
                </strong>
              </div>

              <div className="mt-1.5 flex items-center justify-between gap-[15px] py-3 text-base font-bold text-[#8b6c32]">
                <span>Total</span>
                <strong>
                  {formatCurrency(calculateTotal(selectedInvoice))}
                </strong>
              </div>

              <div className="mt-[18px] rounded-lg bg-[#faf8f3] p-3 text-xs">
                Payment status:{" "}
                <strong>{selectedInvoice.status}</strong>
              </div>

              <p className="mt-6 text-center text-xs text-[#898276]">
                Thank you for your business.
              </p>
            </div>

            <button
              type="button"
              className={`${primaryButtonClass} invoice-print-btn no-print mt-4 w-full`}
              onClick={printInvoice}
            >
              <Printer size={17} />
              Print Invoice
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
