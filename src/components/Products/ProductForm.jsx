import { useEffect, useState } from "react";
import { X } from "lucide-react";

const initialForm = {
  name: "",
  category: "",
  metalType: "Gold",
  purity: "",
  weight: "",
  status: "Active",
};

const inputClass =
  "mt-1.5 h-10 w-full rounded-lg border border-[#e5e1d8] bg-white px-3 text-sm text-[#292821] outline-none transition placeholder:text-gray-400 focus:border-[#9a7837]";

const labelClass = "text-xs font-medium text-gray-700";

function ProductForm({ product, onClose, onSubmit, saving }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const isEditing = Boolean(product);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name ?? "",
        category: product.category ?? "",
        metalType: product.metalType ?? "Gold",
        purity: product.purity ?? "",
        weight: String(product.weight ?? ""),
        status: product.status ?? "Active",
      });
    } else {
      setForm(initialForm);
    }

    setErrors({});
  }, [product]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Product name is required.";
    }

    if (!form.category.trim()) {
      nextErrors.category = "Category is required.";
    }

    if (!form.metalType) {
      nextErrors.metalType = "Select a metal type.";
    }

    if (!form.purity.trim()) {
      nextErrors.purity = "Purity is required.";
    }

    if (form.weight === "" || !Number.isFinite(Number(form.weight))) {
      nextErrors.weight = "Enter a valid weight.";
    } else if (Number(form.weight) <= 0) {
      nextErrors.weight = "Weight must be greater than zero.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    await onSubmit({
      name: form.name.trim(),
      category: form.category.trim(),
      metalType: form.metalType,
      purity: form.purity.trim(),
      weight: Number(form.weight),
      status: form.status,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-form-title"
        className="my-auto w-full max-w-lg overflow-hidden rounded-xl border border-[#ebe8e1] bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-[#ebe8e1] px-5 py-4">
          <div>
            <h2
              id="product-form-title"
              className="text-base font-semibold text-[#292821]"
            >
              {isEditing ? "Edit Product" : "Add Product"}
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              {isEditing
                ? `Update details for ${product.id}`
                : "Enter the jewellery product details below."}
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
          <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="product-name" className={labelClass}>
                Product Name *
              </label>

              <input
                id="product-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Classic Gold Necklace"
                className={inputClass}
                autoFocus
              />

              {errors.name && (
                <p className="mt-1 text-xs text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="product-category" className={labelClass}>
                Category *
              </label>

              <input
                id="product-category"
                name="category"
                list="product-categories"
                value={form.category}
                onChange={handleChange}
                placeholder="e.g. Necklace"
                className={inputClass}
              />

              <datalist id="product-categories">
                <option value="Necklace" />
                <option value="Bangles" />
                <option value="Ring" />
                <option value="Earrings" />
                <option value="Chain" />
                <option value="Pendant" />
                <option value="Anklet" />
                <option value="Bracelet" />
              </datalist>

              {errors.category && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.category}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="product-metal" className={labelClass}>
                Metal Type *
              </label>

              <select
                id="product-metal"
                name="metalType"
                value={form.metalType}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="Gold">Gold</option>
                <option value="Silver">Silver</option>
                <option value="Platinum">Platinum</option>
                <option value="Other">Other</option>
              </select>

              {errors.metalType && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.metalType}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="product-purity" className={labelClass}>
                Purity *
              </label>

              <input
                id="product-purity"
                name="purity"
                value={form.purity}
                onChange={handleChange}
                placeholder="e.g. 22K, 925, 950"
                className={inputClass}
              />

              {errors.purity && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.purity}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="product-weight" className={labelClass}>
                Weight (grams) *
              </label>

              <input
                id="product-weight"
                name="weight"
                type="number"
                min="0.001"
                step="0.001"
                value={form.weight}
                onChange={handleChange}
                placeholder="e.g. 18.500"
                className={inputClass}
              />

              {errors.weight && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.weight}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="product-status" className={labelClass}>
                Status
              </label>

              <select
                id="product-status"
                name="status"
                value={form.status}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
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
              {saving
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;