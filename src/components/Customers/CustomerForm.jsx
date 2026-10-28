import { useEffect, useState } from "react";
import { X } from "lucide-react";

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  status: "Active",
};

const inputClass =
  "w-full rounded-lg border border-[#e7e3da] bg-white px-3 py-2.5 text-sm text-[#292821] outline-none transition placeholder:text-stone-400 focus:border-[#9a7837] focus:ring-2 focus:ring-[#9a7837]/10";

const labelClass = "mb-1.5 block text-sm font-medium text-stone-700";

const CustomerForm = ({
  customer,
  onClose,
  onSubmit,
  saving = false,
}) => {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const isEditing = Boolean(customer);

  useEffect(() => {
    if (customer) {
      setForm({
        name: customer.name || "",
        phone: customer.phone || "",
        email: customer.email || "",
        address: customer.address || "",
        city: customer.city || "",
        state: customer.state || "",
        pincode: customer.pincode || "",
        status: customer.status || "Active",
      });
    } else {
      setForm(emptyForm);
    }

    setError("");
  }, [customer]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const name = form.name.trim();
    const phone = form.phone.replace(/\D/g, "");
    const email = form.email.trim();
    const pincode = form.pincode.trim();

    if (!name) {
      setError("Customer name is required.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    if (
      email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      setError("Enter a valid email address.");
      return;
    }

    if (pincode && !/^\d{6}$/.test(pincode)) {
      setError("Enter a valid 6-digit Indian PIN code.");
      return;
    }

    try {
      await onSubmit({
        ...form,
        name,
        phone,
        email,
        pincode,
      });
    } catch (submitError) {
      setError(submitError.message || "Unable to save customer.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="customer-form-title"
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#ebe8e1] bg-white px-5 py-4 sm:px-6">
          <div>
            <h2
              id="customer-form-title"
              className="text-lg font-semibold text-[#292821]"
            >
              {isEditing ? "Edit Customer" : "Register Customer"}
            </h2>

            <p className="mt-1 text-sm text-stone-500">
              {isEditing
                ? `Update details for ${customer.name}.`
                : "Enter the customer's contact information."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close customer form"
            className="rounded-lg p-2 text-stone-500 hover:bg-stone-100 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="customer-name" className={labelClass}>
                Full Name <span className="text-red-500">*</span>
              </label>

              <input
                id="customer-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter full name"
                maxLength={100}
                required
              />
            </div>

            <div>
              <label htmlFor="customer-phone" className={labelClass}>
                Mobile Number <span className="text-red-500">*</span>
              </label>

              <input
                id="customer-phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                value={form.phone}
                onChange={handleChange}
                className={inputClass}
                placeholder="10-digit mobile number"
                maxLength={15}
                required
              />
            </div>

            <div>
              <label htmlFor="customer-email" className={labelClass}>
                Email Address
              </label>

              <input
                id="customer-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className={inputClass}
                placeholder="customer@example.com"
                maxLength={150}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="customer-address" className={labelClass}>
                Street Address
              </label>

              <input
                id="customer-address"
                name="address"
                value={form.address}
                onChange={handleChange}
                className={inputClass}
                placeholder="House number, street, area"
                maxLength={250}
              />
            </div>

            <div>
              <label htmlFor="customer-city" className={labelClass}>
                City
              </label>

              <input
                id="customer-city"
                name="city"
                value={form.city}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter city"
                maxLength={100}
              />
            </div>

            <div>
              <label htmlFor="customer-state" className={labelClass}>
                State
              </label>

              <input
                id="customer-state"
                name="state"
                value={form.state}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter state"
                maxLength={100}
              />
            </div>

            <div>
              <label htmlFor="customer-pincode" className={labelClass}>
                PIN Code
              </label>

              <input
                id="customer-pincode"
                name="pincode"
                inputMode="numeric"
                value={form.pincode}
                onChange={handleChange}
                className={inputClass}
                placeholder="6-digit PIN code"
                maxLength={6}
              />
            </div>

            {isEditing && (
              <div>
                <label htmlFor="customer-status" className={labelClass}>
                  Customer Status
                </label>

                <select
                  id="customer-status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            )}
          </div>

          {error && (
            <div
              role="alert"
              className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-[#ebe8e1] pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border border-[#e7e3da] px-4 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#9a7837] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#82642d] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Register Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm;