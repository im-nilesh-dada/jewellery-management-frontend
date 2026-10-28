import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";

import { catalog, customers } from "../../data/mockOrderData";
import { currency, getTotal } from "../../utils/orderUtils";

const inputClass =
  "mt-1.5 h-10 w-full rounded-lg border border-[#e5e1d8] bg-white px-3 text-sm text-[#292821] outline-none transition placeholder:text-gray-400 focus:border-[#9a7837]";

const labelClass = "text-xs font-medium text-gray-700";

function OrderModal({ onClose, onCreate, saving = false }) {
  const [customer, setCustomer] = useState("");
  const [orderDate, setOrderDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [items, setItems] = useState([
    { productId: "", quantity: "1" },
  ]);
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState({});

  const selectedItems = useMemo(
    () =>
      items.map((item) => {
        const product = catalog.find(
          (entry) => String(entry.id) === String(item.productId)
        );

        return product
          ? { ...product, quantity: Number(item.quantity) || 0 }
          : null;
      }),
    [items]
  );

  const total = getTotal(selectedItems.filter(Boolean));

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !saving) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, saving]);

  const updateItem = (index, field, value) => {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      )
    );

    setErrors((current) => ({ ...current, items: "" }));
  };

  const addItem = () => {
    setItems((current) => [...current, { productId: "", quantity: "1" }]);
  };

  const removeItem = (index) => {
    setItems((current) => current.filter((_, i) => i !== index));
    setErrors((current) => ({ ...current, items: "" }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!customer) {
      nextErrors.customer = "Select a customer.";
    }

    if (!orderDate) {
      nextErrors.orderDate = "Order date is required.";
    }

    if (items.length === 0) {
      nextErrors.items = "Add at least one product.";
    } else {
      const invalidItem = items.some(
        (item) =>
          !item.productId ||
          !Number.isFinite(Number(item.quantity)) ||
          Number(item.quantity) <= 0
      );

      if (invalidItem) {
        nextErrors.items =
          "Select a product and enter a quantity greater than zero for every item.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) return;

    const selectedCustomer = customers.find(
      (entry) => String(entry.id) === String(customer)
    );

    await onCreate({
      customerId: selectedCustomer?.id ?? customer,
      customerName:
        selectedCustomer?.name ??
        selectedCustomer?.customerName ??
        "",
      date: orderDate,
      items: selectedItems.filter(Boolean),
      notes: notes.trim(),
      total,
      status: "Draft",
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-form-title"
        className="my-auto w-full max-w-2xl overflow-hidden rounded-xl border border-[#ebe8e1] bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-[#ebe8e1] px-5 py-4">
          <div>
            <h2
              id="order-form-title"
              className="text-base font-semibold text-[#292821]"
            >
              Create Order
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Enter the customer and jewellery order details below.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close form"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="max-h-[70vh] space-y-5 overflow-y-auto p-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="order-customer" className={labelClass}>
                  Customer *
                </label>

                <select
                  id="order-customer"
                  value={customer}
                  onChange={(event) => {
                    setCustomer(event.target.value);
                    setErrors((current) => ({
                      ...current,
                      customer: "",
                    }));
                  }}
                  className={inputClass}
                >
                  <option value="">Select customer</option>

                  {customers.map((entry) => (
                    <option key={entry.id} value={entry.id}>
                      {entry.name ?? entry.customerName}
                    </option>
                  ))}
                </select>

                {errors.customer && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.customer}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="order-date" className={labelClass}>
                  Order Date *
                </label>

                <input
                  id="order-date"
                  type="date"
                  value={orderDate}
                  onChange={(event) => {
                    setOrderDate(event.target.value);
                    setErrors((current) => ({
                      ...current,
                      orderDate: "",
                    }));
                  }}
                  className={inputClass}
                />

                {errors.orderDate && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.orderDate}
                  </p>
                )}
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-[#ebe8e1]">
              <div className="flex items-center justify-between gap-3 border-b border-[#ebe8e1] bg-[#fdfcf9] px-4 py-3">
                <div>
                  <h3 className="text-sm font-semibold text-[#292821]">
                    Order Items
                  </h3>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Select products and quantities.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addItem}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#e5e1d8] bg-white px-2.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50"
                >
                  <Plus size={14} />
                  Add Item
                </button>
              </div>

              <div className="space-y-3 p-4">
                {items.map((item, index) => {
                  const product = catalog.find(
                    (entry) =>
                      String(entry.id) === String(item.productId)
                  );

                  return (
                    <div
                      key={index}
                      className="grid grid-cols-1 items-end gap-3 sm:grid-cols-[minmax(0,1fr)_100px_36px]"
                    >
                      <div>
                        <label
                          htmlFor={`order-product-${index}`}
                          className={labelClass}
                        >
                          Product {index + 1}
                        </label>

                        <select
                          id={`order-product-${index}`}
                          value={item.productId}
                          onChange={(event) =>
                            updateItem(index, "productId", event.target.value)
                          }
                          className={inputClass}
                        >
                          <option value="">Select product</option>

                          {catalog.map((entry) => (
                            <option key={entry.id} value={entry.id}>
                              {entry.name}
                              {entry.price != null
                                ? ` — ${currency(entry.price)}`
                                : ""}
                            </option>
                          ))}
                        </select>

                        {product && (
                          <p className="mt-1 text-xs text-gray-500">
                            Unit price: {currency(product.price)}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor={`order-quantity-${index}`}
                          className={labelClass}
                        >
                          Quantity
                        </label>

                        <input
                          id={`order-quantity-${index}`}
                          type="number"
                          min="1"
                          step="1"
                          value={item.quantity}
                          onChange={(event) =>
                            updateItem(index, "quantity", event.target.value)
                          }
                          className={inputClass}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        disabled={items.length === 1}
                        aria-label={`Remove item ${index + 1}`}
                        title="Remove item"
                        className="mb-0.5 flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  );
                })}

                {errors.items && (
                  <p className="text-xs text-red-600">{errors.items}</p>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-[#ebe8e1] bg-[#fdfcf9] px-4 py-3">
                <span className="text-sm font-medium text-gray-600">
                  Order Total
                </span>

                <span className="text-base font-semibold text-[#292821]">
                  {currency(total)}
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="order-notes" className={labelClass}>
                Notes
              </label>

              <textarea
                id="order-notes"
                rows={3}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Add any special instructions..."
                className="mt-1.5 w-full rounded-lg border border-[#e5e1d8] bg-white px-3 py-2.5 text-sm text-[#292821] outline-none transition placeholder:text-gray-400 focus:border-[#9a7837]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-[#ebe8e1] bg-[#fdfcf9] px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="h-9 rounded-lg border border-[#e5e1d8] bg-white px-4 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="h-9 rounded-lg bg-[#9a7837] px-4 text-sm font-medium text-white transition hover:bg-[#806127] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Creating..." : "Create Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OrderModal;