import { useEffect, useState } from "react";
import { X, CreditCard, IndianRupee } from "lucide-react";

const initialForm = {
  customer: "",
  phone: "",
  invoiceId: "",
  amount: "",
  date: new Date().toISOString().split("T")[0],
  method: "UPI",
  status: "Completed",
  reference: "",
  notes: "",
};

const PaymentForm = ({
  isOpen,
  onClose,
  onSubmit,
  selectedPayment,
}) => {
  const [form, setForm] = useState(initialForm);

  const isViewMode = Boolean(selectedPayment);

  useEffect(() => {
    if (selectedPayment) {
      setForm({
        ...selectedPayment,
        amount: String(selectedPayment.amount),
      });
    } else {
      setForm({
        ...initialForm,
        date: new Date().toISOString().split("T")[0],
      });
    }
  }, [selectedPayment, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.customer.trim() ||
      !form.invoiceId.trim() ||
      !form.amount ||
      Number(form.amount) <= 0
    ) {
      return;
    }

    onSubmit({
      ...form,
      amount: Number(form.amount),
    });

    setForm(initialForm);
  };

  const inputClass =
    "w-full rounded-lg border border-[#e8e5dd] bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-[#9a7837] focus:ring-2 focus:ring-[#9a7837]/10 disabled:bg-gray-50";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-5"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#ebe8e1] bg-white px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-[#f7f3e9] p-2.5 text-[#9a7837]">
              <CreditCard size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-gray-900">
                {isViewMode ? "Payment Details" : "Record Payment"}
              </h2>
              <p className="mt-0.5 text-xs text-gray-500">
                {isViewMode
                  ? "View transaction information"
                  : "Enter the payment transaction details"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={19} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Customer Name *
              </label>
              <input
                name="customer"
                value={form.customer}
                onChange={handleChange}
                placeholder="Enter customer name"
                disabled={isViewMode}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                name="phone"
                value={form.phone || ""}
                onChange={handleChange}
                placeholder="Enter phone number"
                disabled={isViewMode}
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Invoice ID *
              </label>
              <input
                name="invoiceId"
                value={form.invoiceId}
                onChange={handleChange}
                placeholder="e.g. INV-2026-001"
                disabled={isViewMode}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Payment Amount *
              </label>

              <div className="relative">
                <IndianRupee
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="Enter amount"
                  min="1"
                  disabled={isViewMode}
                  required
                  className={`${inputClass} pl-9`}
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Payment Date *
              </label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                disabled={isViewMode}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Payment Method *
              </label>

              <select
                name="method"
                value={form.method}
                onChange={handleChange}
                disabled={isViewMode}
                className={inputClass}
              >
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Payment Status
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                disabled={isViewMode}
                className={inputClass}
              >
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Transaction Reference
              </label>
              <input
                name="reference"
                value={form.reference || ""}
                onChange={handleChange}
                placeholder="Transaction reference ID"
                disabled={isViewMode}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              name="notes"
              value={form.notes || ""}
              onChange={handleChange}
              placeholder="Additional payment information..."
              rows={3}
              disabled={isViewMode}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-[#ebe8e1] pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#e8e5dd] px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
            >
              {isViewMode ? "Close" : "Cancel"}
            </button>

            {!isViewMode && (
              <button
                type="submit"
                className="rounded-lg bg-[#9a7837] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#806127]"
              >
                Save Payment
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;