import { useEffect, useState } from "react";
import { X } from "lucide-react";

const initialForm = {
  metalType: "Gold",
  purity: "22K",
  ratePerGram: "",
  effectiveFrom: new Date().toLocaleDateString("en-CA"),
  status: "Active",
};

const inputClass =
  "mt-1.5 h-10 w-full rounded-lg border border-[#e5e1d8] bg-white px-3 text-sm text-[#292821] outline-none transition focus:border-[#9a7837]";

const labelClass = "text-xs font-medium text-gray-700";

const purityOptions = {
  Gold: ["24K", "22K", "20K", "18K", "14K", "10K"],
  Silver: ["999", "958", "925", "900", "800"],
};

function MetalRateForm({ rate, rates, onClose, onSubmit, saving }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const isEditing = Boolean(rate);

  useEffect(() => {
    if (rate) {
      setForm({
        metalType: rate.metalType ?? "Gold",
        purity: rate.purity ?? "22K",
        ratePerGram: String(rate.ratePerGram ?? ""),
        effectiveFrom: rate.effectiveFrom ?? initialForm.effectiveFrom,
        status: rate.status ?? "Active",
      });
    } else {
      setForm(initialForm);
    }

    setErrors({});
  }, [rate]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => {
      const updated = {
        ...previous,
        [name]: value,
      };

      if (name === "metalType") {
        updated.purity = purityOptions[value][0];
      }

      return updated;
    });

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.metalType) {
      nextErrors.metalType = "Select a metal type.";
    }

    if (!form.purity.trim()) {
      nextErrors.purity = "Purity is required.";
    }

    if (
      form.ratePerGram === "" ||
      !Number.isFinite(Number(form.ratePerGram)) ||
      Number(form.ratePerGram) <= 0
    ) {
      nextErrors.ratePerGram = "Enter a rate greater than zero.";
    }

    if (!form.effectiveFrom) {
      nextErrors.effectiveFrom = "Effective date is required.";
    } else if (
      !/^\d{4}-\d{2}-\d{2}$/.test(form.effectiveFrom) ||
      Number.isNaN(
        new Date(`${form.effectiveFrom}T00:00:00`).getTime()
      )
    ) {
      nextErrors.effectiveFrom = "Enter a valid effective date.";
    }

    // Prevent duplicate active rates for the same metal, purity,
    // and effective date. The backend must enforce this rule too.
    if (
      form.status === "Active" &&
      form.metalType &&
      form.purity &&
      form.effectiveFrom
    ) {
      const duplicate = rates.some(
        (existingRate) =>
          existingRate.id !== rate?.id &&
          existingRate.status === "Active" &&
          existingRate.metalType === form.metalType &&
          existingRate.purity === form.purity &&
          existingRate.effectiveFrom === form.effectiveFrom
      );

      if (duplicate) {
        nextErrors.effectiveFrom =
          "An active rate already exists for this metal, purity, and date.";
      }
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) return;

    await onSubmit({
      metalType: form.metalType,
      purity: form.purity.trim(),
      ratePerGram: Number(form.ratePerGram),
      effectiveFrom: form.effectiveFrom,
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
        aria-labelledby="metal-rate-form-title"
        className="my-auto w-full max-w-lg overflow-hidden rounded-xl border border-[#ebe8e1] bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-[#ebe8e1] px-5 py-4">
          <div>
            <h2
              id="metal-rate-form-title"
              className="text-base font-semibold text-[#292821]"
            >
              {isEditing ? "Edit Metal Rate" : "Add Metal Rate"}
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              {isEditing
                ? `Update rate ${rate.id}.`
                : "Enter the metal rate and its effective date."}
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
            <div>
              <label htmlFor="metal-type" className={labelClass}>
                Metal Type *
              </label>

              <select
                id="metal-type"
                name="metalType"
                value={form.metalType}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="Gold">Gold</option>
                <option value="Silver">Silver</option>
              </select>

              {errors.metalType && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.metalType}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="metal-purity" className={labelClass}>
                Purity *
              </label>

              <select
                id="metal-purity"
                name="purity"
                value={form.purity}
                onChange={handleChange}
                className={inputClass}
              >
                {purityOptions[form.metalType].map((purity) => (
                  <option key={purity} value={purity}>
                    {purity}
                  </option>
                ))}
              </select>

              {errors.purity && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.purity}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="rate-per-gram" className={labelClass}>
                Rate per Gram (₹) *
              </label>

              <input
                id="rate-per-gram"
                name="ratePerGram"
                type="number"
                min="0.01"
                step="0.01"
                value={form.ratePerGram}
                onChange={handleChange}
                placeholder="e.g. 12375.00"
                className={inputClass}
              />

              {errors.ratePerGram && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.ratePerGram}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="effective-from" className={labelClass}>
                Effective From *
              </label>

              <input
                id="effective-from"
                name="effectiveFrom"
                type="date"
                value={form.effectiveFrom}
                onChange={handleChange}
                className={inputClass}
              />

              {errors.effectiveFrom && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.effectiveFrom}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="metal-rate-status" className={labelClass}>
                Status
              </label>

              <select
                id="metal-rate-status"
                name="status"
                value={form.status}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="sm:col-span-2 rounded-lg border border-[#ebe8e1] bg-[#faf9f6] p-3">
              <p className="text-xs leading-5 text-gray-500">
                Rates are stored per gram. Historical records should be
                retained for audit and pricing calculations. Only use
                verified business rates in production.
              </p>
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
                  : "Create Rate"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MetalRateForm;