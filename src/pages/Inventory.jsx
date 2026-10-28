
import { useMemo, useState } from "react";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Search,
  Plus,
  Package,
  AlertTriangle,
  History,
  X,
  SlidersHorizontal,
} from "lucide-react";

const initialInventory = [
  {
    id: 1,
    name: "Classic Gold Necklace",
    sku: "GLD-1001",
    category: "Necklaces",
    metal: "Gold",
    purity: "22K",
    quantity: 18,
    minStock: 5,
    location: "Display A1",
  },
  {
    id: 2,
    name: "Diamond Stud Earrings",
    sku: "DIA-1002",
    category: "Earrings",
    metal: "Diamond",
    purity: "18K",
    quantity: 3,
    minStock: 5,
    location: "Display B2",
  },
  {
    id: 3,
    name: "Traditional Gold Bangles",
    sku: "GLD-1003",
    category: "Bangles",
    metal: "Gold",
    purity: "22K",
    quantity: 12,
    minStock: 5,
    location: "Vault A2",
  },
  {
    id: 4,
    name: "Silver Anklet Pair",
    sku: "SLV-1004",
    category: "Anklets",
    metal: "Silver",
    purity: "925",
    quantity: 0,
    minStock: 5,
    location: "Display C1",
  },
  {
    id: 5,
    name: "Gold Pendant",
    sku: "GLD-1005",
    category: "Pendants",
    metal: "Gold",
    purity: "18K",
    quantity: 6,
    minStock: 5,
    location: "Display A3",
  },
  {
    id: 6,
    name: "Diamond Finger Ring",
    sku: "DIA-1006",
    category: "Rings",
    metal: "Diamond",
    purity: "18K",
    quantity: 2,
    minStock: 5,
    location: "Vault B1",
  },
];

const initialMovements = [
  {
    id: 101,
    product: "Classic Gold Necklace",
    sku: "GLD-1001",
    type: "Stock In",
    quantity: 5,
    date: "2026-10-23",
    note: "Opening stock receipt",
  },
  {
    id: 102,
    product: "Diamond Stud Earrings",
    sku: "DIA-1002",
    type: "Stock Out",
    quantity: 2,
    date: "2026-10-23",
    note: "Counter sale",
  },
  {
    id: 103,
    product: "Traditional Gold Bangles",
    sku: "GLD-1003",
    type: "Adjustment",
    quantity: -1,
    date: "2026-10-22",
    note: "Stock reconciliation",
  },
];

const primaryButton =
  "inline-flex min-h-[41px] items-center justify-center gap-2 rounded-lg border border-transparent bg-[#9a7837] px-4 text-xs font-semibold text-white transition hover:bg-[#806127] disabled:cursor-not-allowed disabled:opacity-50";

const secondaryButton =
  "inline-flex min-h-[41px] items-center justify-center gap-2 rounded-lg border border-[#ebe8e1] bg-white px-4 text-xs font-semibold text-[#514e46] transition hover:border-[#d8c49c] hover:bg-[#fbf8f0]";

const fieldClass =
  "min-h-[42px] w-full rounded-lg border border-[#e5e1d8] bg-white px-3 py-2.5 text-xs text-[#292821] outline-none transition focus:border-[#9a7837] focus:ring-2 focus:ring-[#9a7837]/10";

const fieldLabel =
  "mb-2 block text-xs font-semibold text-[#514e46]";

function stockStatus(item) {
  if (item.quantity === 0) return "Out of stock";
  if (item.quantity <= item.minStock) return "Low stock";
  return "In stock";
}

function Inventory() {
  const [inventory, setInventory] = useState(initialInventory);
  const [movements, setMovements] = useState(initialMovements);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All stock");
  const [showMovementForm, setShowMovementForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [form, setForm] = useState({
    productId: String(initialInventory[0].id),
    type: "Stock In",
    quantity: "1",
    note: "",
  });
  const [formError, setFormError] = useState("");

  const filteredInventory = useMemo(() => {
    const query = search.trim().toLowerCase();

    return inventory.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(query) ||
        item.sku.toLowerCase().includes(query);

      const status = stockStatus(item);
      const matchesStatus =
        statusFilter === "All stock" || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [inventory, search, statusFilter]);

  const lowStockCount = inventory.filter(
    (item) => item.quantity > 0 && item.quantity <= item.minStock
  ).length;

  const outOfStockCount = inventory.filter(
    (item) => item.quantity === 0
  ).length;

  const totalUnits = inventory.reduce(
    (total, item) => total + item.quantity,
    0
  );

  function openMovementForm() {
    setForm({
      productId: String(inventory[0]?.id ?? ""),
      type: "Stock In",
      quantity: "1",
      note: "",
    });
    setFormError("");
    setShowMovementForm(true);
  }

  function handleMovementSubmit(event) {
    event.preventDefault();
    setFormError("");

    const selectedProduct = inventory.find(
      (item) => item.id === Number(form.productId)
    );
    const quantity = Number(form.quantity);

    if (!selectedProduct) {
      setFormError("Please select a product.");
      return;
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      setFormError("Enter a whole number greater than zero.");
      return;
    }

    let delta = quantity;

    if (form.type === "Stock Out") {
      delta = -quantity;

      if (selectedProduct.quantity < quantity) {
        setFormError(
          `Only ${selectedProduct.quantity} units are available.`
        );
        return;
      }
    }

    if (form.type === "Adjustment") {
      delta = form.note.trim().startsWith("-") ? -quantity : quantity;

      if (selectedProduct.quantity + delta < 0) {
        setFormError("Adjustment cannot make stock negative.");
        return;
      }
    }

    setInventory((current) =>
      current.map((item) =>
        item.id === selectedProduct.id
          ? { ...item, quantity: item.quantity + delta }
          : item
      )
    );

    const movement = {
      id: Date.now(),
      product: selectedProduct.name,
      sku: selectedProduct.sku,
      type: form.type,
      quantity: delta,
      date: new Date().toISOString().slice(0, 10),
      note:
        form.note.trim() ||
        (form.type === "Stock In"
          ? "Stock received"
          : form.type === "Stock Out"
            ? "Stock issued"
            : "Stock adjustment"),
    };

    setMovements((current) => [movement, ...current]);
    setShowMovementForm(false);
  }

  return (
    <section className="flex min-w-0 flex-col gap-6 text-[#292821] max-[768px]:gap-[18px]">
      {/* Page heading */}
      <div className="flex items-center justify-between gap-5 max-[1100px]:flex-col max-[1100px]:items-start">
        <div>
          <span className="mb-2 block text-[10px] font-extrabold tracking-[1.5px] text-[#9a7837]">
            INVENTORY CONTROL
          </span>
          <h1 className="m-0 text-[29px] font-bold tracking-[-0.8px] max-[768px]:text-[25px]">
            Stock Management
          </h1>
        </div>

        <div className="flex flex-wrap gap-2.5 max-[768px]:w-full max-[480px]:flex-col">
          <button
            type="button"
            className={`${secondaryButton} max-[480px]:w-full`}
            onClick={() => setShowHistory(true)}
          >
            <History size={17} />
            Movement History
          </button>

          <button
            type="button"
            className={`${primaryButton} max-[480px]:w-full`}
            onClick={openMovementForm}
            disabled={inventory.length === 0}
          >
            <Plus size={18} />
            Record Movement
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 max-[1100px]:grid-cols-2 max-[768px]:grid-cols-1 max-[768px]:gap-2.5">
        <article className="flex min-w-0 items-center gap-3.5 rounded-xl border border-[#ebe8e1] bg-white p-[21px] max-[768px]:p-4">
          <div className="flex size-[45px] shrink-0 items-center justify-center rounded-[11px] bg-[#f5efdf] text-[#9a7837]">
            <Package size={20} />
          </div>
          <div>
            <span className="block text-xs text-[#77746b]">
              Total units in stock
            </span>
            <strong className="mt-1 block text-[25px] font-bold tracking-tight">
              {totalUnits}
            </strong>
          </div>
        </article>

        <article className="flex min-w-0 items-center gap-3.5 rounded-xl border border-[#ebe8e1] bg-white p-[21px] max-[768px]:p-4">
          <div className="flex size-[45px] shrink-0 items-center justify-center rounded-[11px] bg-[#fff0d8] text-[#99651c]">
            <AlertTriangle size={20} />
          </div>
          <div>
            <span className="block text-xs text-[#77746b]">Low stock</span>
            <strong className="mt-1 block text-[25px] font-bold tracking-tight">
              {lowStockCount}
            </strong>
          </div>
        </article>

        <article className="flex min-w-0 items-center gap-3.5 rounded-xl border border-[#ebe8e1] bg-white p-[21px] max-[1100px]:col-span-2 max-[768px]:col-span-1 max-[768px]:p-4">
          <div className="flex size-[45px] shrink-0 items-center justify-center rounded-[11px] bg-[#fde8e7] text-[#b23a32]">
            <Package size={20} />
          </div>
          <div>
            <span className="block text-xs text-[#77746b]">
              Out of stock
            </span>
            <strong className="mt-1 block text-[25px] font-bold tracking-tight">
              {outOfStockCount}
            </strong>
          </div>
        </article>
      </div>

      {/* Inventory table */}
      <section className="overflow-hidden rounded-xl border border-[#ebe8e1] bg-white">
        <div className="px-6 pb-[18px] pt-[22px] max-[768px]:px-4">
          <h2 className="m-0 text-[17px] font-bold">Current stock</h2>
          <p className="mt-1.5 text-xs leading-relaxed text-[#77746b]">
            Showing {filteredInventory.length} of {inventory.length} products
          </p>
        </div>

        <div className="flex gap-3 px-6 pb-5 max-[768px]:flex-col max-[768px]:px-4 max-[768px]:pb-4">
          <label className="flex min-h-[42px] min-w-0 flex-1 items-center gap-2.5 rounded-lg border border-[#ebe8e1] px-3 text-[#77746b] transition focus-within:border-[#9a7837] focus-within:ring-2 focus-within:ring-[#9a7837]/10">
            <Search size={18} className="shrink-0" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search product or SKU..."
              className="w-full min-w-0 border-0 bg-transparent text-xs text-[#292821] outline-none placeholder:text-[#a09c92]"
            />
          </label>

          <label className="flex min-h-[42px] items-center gap-2 rounded-lg border border-[#ebe8e1] px-3 text-[#77746b] transition focus-within:border-[#9a7837] focus-within:ring-2 focus-within:ring-[#9a7837]/10">
            <SlidersHorizontal size={16} className="shrink-0" />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter stock status"
              className="max-w-[180px] cursor-pointer border-0 bg-transparent text-xs text-[#292821] outline-none max-[768px]:max-w-none max-[768px]:flex-1"
            >
              <option>All stock</option>
              <option>In stock</option>
              <option>Low stock</option>
              <option>Out of stock</option>
            </select>
          </label>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse text-left whitespace-nowrap">
            <thead className="bg-[#faf9f6]">
              <tr>
                {[
                  "Product",
                  "Category",
                  "Purity",
                  "Available units",
                  "Minimum stock",
                  "Location",
                  "Status",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="border-y border-[#ebe8e1] px-4 py-[13px] text-[10px] font-bold tracking-[0.4px] text-[#77746b] uppercase first:pl-6"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredInventory.map((item) => {
                const status = stockStatus(item);

                const statusClass =
                  status === "In stock"
                    ? "bg-[#e7f5ec] text-[#287a4b]"
                    : status === "Low stock"
                      ? "bg-[#fff0d8] text-[#99651c]"
                      : "bg-[#fde8e7] text-[#b23a32]";

                const quantityClass =
                  item.quantity === 0
                    ? "text-[#b23a32]"
                    : item.quantity <= item.minStock
                      ? "text-[#99651c]"
                      : "text-[#287a4b]";

                return (
                  <tr
                    key={item.id}
                    className="transition hover:bg-[#fdfcf9]"
                  >
                    <td className="border-b border-[#f0eee8] py-[15px] pl-6 pr-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex size-[38px] shrink-0 items-center justify-center rounded-lg border border-[#eee6d6] bg-[#f8f3e9] text-[#9a7837]">
                          <Package size={18} />
                        </div>
                        <div>
                          <strong className="block text-xs font-semibold text-[#292821]">
                            {item.name}
                          </strong>
                          <span className="mt-1 block text-[11px] text-[#77746b]">
                            {item.sku}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="border-b border-[#f0eee8] px-4 py-[15px] text-xs text-[#57544c]">
                      {item.category}
                    </td>

                    <td className="border-b border-[#f0eee8] px-4 py-[15px] text-[11px] text-[#57544c]">
                      {item.metal} · {item.purity}
                    </td>

                    <td className="border-b border-[#f0eee8] px-4 py-[15px]">
                      <strong className={`text-sm tabular-nums ${quantityClass}`}>
                        {item.quantity}
                      </strong>
                    </td>

                    <td className="border-b border-[#f0eee8] px-4 py-[15px] text-xs text-[#57544c]">
                      {item.minStock}
                    </td>

                    <td className="border-b border-[#f0eee8] px-4 py-[15px] text-xs text-[#57544c]">
                      {item.location}
                    </td>

                    <td className="border-b border-[#f0eee8] px-4 py-[15px]">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-semibold ${statusClass}`}
                      >
                        <span className="size-1.5 rounded-full bg-current" />
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {filteredInventory.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-9 text-center text-xs text-[#77746b]"
                  >
                    No stock records match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Inventory information note */}
      <section className="flex items-start gap-3 rounded-[10px] border border-[#f0dfbb] bg-[#fffaf0] px-[19px] py-[17px] text-[#896322]">
        <AlertTriangle size={19} className="mt-px shrink-0" />
        <div>
          <strong className="text-xs font-bold">Stock monitoring</strong>
          <p className="mt-1.5 text-xs leading-relaxed text-[#7b6b4b]">
            Low-stock thresholds are illustrative. Jewellery inventory may
            need piece counts, unique tag numbers, weights and purity tracking
            rather than quantity alone.
          </p>
        </div>
      </section>

      {/* Record movement modal */}
      {showMovementForm && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center overflow-y-auto bg-[#1c1b17]/55 p-6 max-[480px]:items-start max-[480px]:p-3"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowMovementForm(false);
            }
          }}
        >
          <section
            className="max-h-[calc(100vh-48px)] w-full max-w-[520px] overflow-y-auto rounded-[14px] border border-[#ebe8e1] bg-white p-[25px] shadow-[0_22px_80px_rgba(0,0,0,0.18)] max-[480px]:max-h-[calc(100vh-24px)] max-[480px]:p-[18px]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="movement-title"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2
                  id="movement-title"
                  className="m-0 text-xl font-bold text-[#292821]"
                >
                  Record stock movement
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-[#77746b]">
                  Update stock and create a movement record.
                </p>
              </div>
              <button
                type="button"
                className="flex size-[35px] shrink-0 items-center justify-center rounded-lg border border-[#ebe8e1] bg-white text-[#77746b] hover:bg-[#f8f3e9] hover:text-[#806127]"
                onClick={() => setShowMovementForm(false)}
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleMovementSubmit}>
              <label className="mb-[17px] block text-xs font-semibold text-[#514e46]">
                <span className={fieldLabel}>Product</span>
                <select
                  required
                  className={fieldClass}
                  value={form.productId}
                  onChange={(event) =>
                    setForm({ ...form, productId: event.target.value })
                  }
                >
                  {inventory.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.quantity} available)
                    </option>
                  ))}
                </select>
              </label>

              <label className="mb-[17px] block text-xs font-semibold text-[#514e46]">
                <span className={fieldLabel}>Movement type</span>
                <select
                  className={fieldClass}
                  value={form.type}
                  onChange={(event) =>
                    setForm({ ...form, type: event.target.value })
                  }
                >
                  <option>Stock In</option>
                  <option>Stock Out</option>
                  <option>Adjustment</option>
                </select>
              </label>

              <label className="mb-[17px] block text-xs font-semibold text-[#514e46]">
                <span className={fieldLabel}>Quantity</span>
                <input
                  className={fieldClass}
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={form.quantity}
                  onChange={(event) =>
                    setForm({ ...form, quantity: event.target.value })
                  }
                />
              </label>

              {form.type === "Adjustment" && (
                <p className="mb-4 -mt-1 text-[11px] leading-relaxed text-[#896322]">
                  For a negative adjustment, start the note with a minus sign
                  (for example, <strong>- Damaged item</strong>). Otherwise,
                  the adjustment adds stock.
                </p>
              )}

              <label className="mb-[17px] block text-xs font-semibold text-[#514e46]">
                <span className={fieldLabel}>Note / Reason</span>
                <textarea
                  className={`${fieldClass} min-h-[90px] resize-y`}
                  rows={3}
                  maxLength={250}
                  value={form.note}
                  onChange={(event) =>
                    setForm({ ...form, note: event.target.value })
                  }
                  placeholder="e.g. Supplier delivery or counter sale"
                />
              </label>

              {formError && (
                <p
                  className="mb-4 text-xs text-[#b23a32]"
                  role="alert"
                >
                  {formError}
                </p>
              )}

              <div className="mt-[22px] flex justify-end gap-2.5 border-t border-[#ebe8e1] pt-[18px]">
                <button
                  type="button"
                  className={secondaryButton}
                  onClick={() => setShowMovementForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={primaryButton}>
                  Save movement
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* Movement history modal */}
      {showHistory && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center overflow-y-auto bg-[#1c1b17]/55 p-6 max-[480px]:items-start max-[480px]:p-3"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowHistory(false);
            }
          }}
        >
          <section
            className="max-h-[calc(100vh-48px)] w-full max-w-[580px] overflow-y-auto rounded-[14px] border border-[#ebe8e1] bg-white p-[25px] shadow-[0_22px_80px_rgba(0,0,0,0.18)] max-[480px]:max-h-[calc(100vh-24px)] max-[480px]:p-[18px]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="history-title"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2
                  id="history-title"
                  className="m-0 text-xl font-bold text-[#292821]"
                >
                  Movement history
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-[#77746b]">
                  Recent stock receipts, issues and adjustments.
                </p>
              </div>
              <button
                type="button"
                className="flex size-[35px] shrink-0 items-center justify-center rounded-lg border border-[#ebe8e1] bg-white text-[#77746b] hover:bg-[#f8f3e9] hover:text-[#806127]"
                onClick={() => setShowHistory(false)}
                aria-label="Close history"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col">
              {movements.map((movement) => (
                <article
                  className="flex items-start gap-3 border-b border-[#f0eee8] py-4 last:border-b-0"
                  key={movement.id}
                >
                  <div
                    className={`flex size-[39px] shrink-0 items-center justify-center rounded-[10px] ${
                      movement.quantity < 0
                        ? "bg-[#fde8e7] text-[#b23a32]"
                        : "bg-[#e7f5ec] text-[#287a4b]"
                    }`}
                  >
                    {movement.quantity < 0 ? (
                      <ArrowUpFromLine size={18} />
                    ) : (
                      <ArrowDownToLine size={18} />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <strong className="block text-xs font-semibold text-[#292821]">
                      {movement.product}
                    </strong>
                    <span className="mt-1 block text-[11px] text-[#77746b]">
                      {movement.sku} · {movement.type}
                    </span>
                    <p className="mt-2 text-xs text-[#57544c]">
                      {movement.note}
                    </p>
                    <small className="mt-1 block text-[11px] text-[#77746b]">
                      {movement.date}
                    </small>
                  </div>

                  <strong
                    className={`shrink-0 text-[13px] tabular-nums ${
                      movement.quantity < 0
                        ? "text-[#b23a32]"
                        : "text-[#287a4b]"
                    }`}
                  >
                    {movement.quantity > 0 ? "+" : ""}
                    {movement.quantity}
                  </strong>
                </article>
              ))}

              {movements.length === 0 && (
                <p className="py-6 text-center text-[13px] text-[#77746b]">
                  No movements recorded yet.
                </p>
              )}
            </div>
          </section>
        </div>
      )}
    </section>
  );
}

export default Inventory;
