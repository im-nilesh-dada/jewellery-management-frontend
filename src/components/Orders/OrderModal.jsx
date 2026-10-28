import { useMemo, useState } from "react";
import { X, Plus, AlertCircle } from "lucide-react";
import { catalog, customers } from "../../data/mockOrderData";
import { currency } from "../../utils/orderUtils";

export default function OrderModal({ onClose, onCreate }) {
  const [customerName, setCustomerName] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [items, setItems] = useState([{ sku: "", quantity: 1 }]);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const customer = customers.find((c) => c.name === customerName);

  const orderItems = useMemo(
    () =>
      items.map((item) => {
        const product = catalog.find((p) => p.sku === item.sku);

        return product
          ? {
              ...product,
              quantity: Number(item.quantity) || 0,
            }
          : null;
      }),
    [items]
  );

  const total = orderItems.reduce(
    (sum, item) =>
      sum + (item ? item.price * item.quantity : 0),
    0
  );

  const updateItem = (index, field, value) => {
    setItems((current) =>
      current.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!customer) {
      setError("Please select a customer.");
      return;
    }

    if (!items.length || items.some((item) => !item.sku)) {
      setError("Select a product for every order item.");
      return;
    }

    if (
      items.some(
        (item) =>
          !Number.isInteger(Number(item.quantity)) ||
          Number(item.quantity) < 1
      )
    ) {
      setError("Each quantity must be a whole number greater than zero.");
      return;
    }

    const selectedItems = items.map((item) => {
      const product = catalog.find((p) => p.sku === item.sku);

      return {
        ...product,
        quantity: Number(item.quantity),
      };
    });

    onCreate({
      customer: customer.name,
      phone: customer.phone,
      date,
      status: "Draft",
      payment: "Unpaid",
      items: selectedItems,
      notes: notes.trim(),
    });
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-3 backdrop-blur-[2px] sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-order-title"
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#ebe5d8] bg-[#fdfcf9] shadow-2xl"
      >
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[#ebe7de] bg-[#fdfcf9] px-5 py-4 sm:px-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#a18443]">
              JMS ERP / Orders
            </p>
            <h2
              id="create-order-title"
              className="mt-1 text-lg font-semibold text-[#292821]"
            >
              Create order
            </h2>
            <p className="mt-1 text-xs text-[#858174]">
              Add customer details and products to create a draft.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close create order dialog"
            className="grid h-9 w-9 place-items-center rounded-lg text-[#777265] hover:bg-[#f0ece3]"
          >
            <X size={18} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-[#514e43]">
                Customer <span className="text-rose-500">*</span>
              </span>

              <select
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                required
                className="h-11 w-full rounded-xl border border-[#e4dfd4] bg-white px-3 text-sm text-[#39372f] outline-none focus:border-[#b79a57] focus:ring-2 focus:ring-[#d9bc76]/20"
              >
                <option value="">Select customer</option>
                {customers.map((entry) => (
                  <option key={entry.name} value={entry.name}>
                    {entry.name}
                  </option>
                ))}
              </select>

              {customer && (
                <span className="mt-1.5 block text-[11px] text-[#898578]">
                  {customer.phone}
                </span>
              )}
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-[#514e43]">
                Order date
              </span>

              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                required
                className="h-11 w-full rounded-xl border border-[#e4dfd4] bg-white px-3 text-sm text-[#39372f] outline-none focus:border-[#b79a57] focus:ring-2 focus:ring-[#d9bc76]/20"
              />
            </label>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-[#292821]">
                  Order items
                </h3>
                <p className="mt-1 text-[11px] text-[#898578]">
                  Prices use the sample product catalogue.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setItems((current) => [
                    ...current,
                    { sku: "", quantity: 1 },
                  ])
                }
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#e4dac2] px-3 py-2 text-xs font-semibold text-[#8a6d30] hover:bg-[#f6f0e2]"
              >
                <Plus size={14} />
                Add item
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => {
                const product = catalog.find((p) => p.sku === item.sku);

                return (
                  <div
                    key={index}
                    className="grid grid-cols-1 gap-3 rounded-xl border border-[#eee9df] bg-white p-3 sm:grid-cols-[minmax(0,1fr)_90px_110px_32px] sm:items-end"
                  >
                    <label className="block min-w-0">
                      <span className="mb-1.5 block text-[11px] font-semibold text-[#777265]">
                        Product
                      </span>

                      <select
                        value={item.sku}
                        onChange={(event) =>
                          updateItem(index, "sku", event.target.value)
                        }
                        required
                        className="h-10 w-full min-w-0 rounded-lg border border-[#e4dfd4] bg-white px-2 text-xs text-[#39372f] outline-none focus:border-[#b79a57]"
                      >
                        <option value="">Select product</option>
                        {catalog.map((entry) => (
                          <option key={entry.sku} value={entry.sku}>
                            {entry.name}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-[11px] font-semibold text-[#777265]">
                        Quantity
                      </span>

                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={item.quantity}
                        onChange={(event) =>
                          updateItem(index, "quantity", event.target.value)
                        }
                        required
                        className="h-10 w-full rounded-lg border border-[#e4dfd4] px-2 text-xs outline-none focus:border-[#b79a57]"
                      />
                    </label>

                    <div>
                      <span className="mb-1.5 block text-[11px] font-semibold text-[#777265]">
                        Unit price
                      </span>
                      <div className="flex h-10 items-center rounded-lg bg-[#f7f5ef] px-2 text-xs font-semibold text-[#494539]">
                        {product ? currency(product.price) : "—"}
                      </div>
                    </div>

                    <button
                      type="button"
                      aria-label={`Remove item ${index + 1}`}
                      disabled={items.length === 1}
                      onClick={() =>
                        setItems((current) =>
                          current.filter((_, i) => i !== index)
                        )
                      }
                      className="grid h-8 w-8 place-items-center self-end rounded-lg text-[#a39d90] hover:bg-rose-50 hover:text-rose-600 disabled:opacity-30 sm:mb-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-[#514e43]">
              Notes <span className="font-normal text-[#999386]">(optional)</span>
            </span>

            <textarea
              rows={3}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Special requests, delivery instructions..."
              className="w-full resize-y rounded-xl border border-[#e4dfd4] bg-white px-3 py-2.5 text-sm outline-none placeholder:text-[#aaa597] focus:border-[#b79a57] focus:ring-2 focus:ring-[#d9bc76]/20"
            />
          </label>

          {error && (
            <p role="alert" className="flex items-center gap-2 text-xs font-medium text-rose-600">
              <AlertCircle size={15} />
              {error}
            </p>
          )}

          <div className="flex flex-col gap-2 rounded-xl border border-[#e9dfc8] bg-[#f7f2e6] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-medium text-[#81765d]">
                Order total
              </p>
              <p className="mt-1 text-xl font-bold text-[#453b27]">
                {currency(total)}
              </p>
            </div>

            <p className="text-[11px] text-[#8a806a]">
              {items.reduce(
                (sum, item) => sum + (Number(item.quantity) || 0),
                0
              )}{" "}
              total units
            </p>
          </div>

          <footer className="flex flex-col-reverse gap-2 border-t border-[#ece7dc] pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded-xl border border-[#e1dccf] px-5 text-xs font-semibold text-[#666154] hover:bg-[#f1eee7]"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#302e25] px-5 text-xs font-semibold text-[#f4e4b8] hover:bg-[#45402f]"
            >
              <Plus size={15} />
              Create draft order
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}