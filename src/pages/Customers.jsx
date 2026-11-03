
import { useState } from "react";
import {
  Users,
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  X,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  IndianRupee,
} from "lucide-react";

const initialCustomers = [
  {
    id: 1,
    name: "Arjun Menon",
    phone: "9876543210",
    email: "arjun@example.com",
    address: "Kochi, Kerala",
    purchases: 12,
    totalSpent: 185000,
  },
  {
    id: 2,
    name: "Anjali Nair",
    phone: "9876501234",
    email: "anjali@example.com",
    address: "Thrissur, Kerala",
    purchases: 8,
    totalSpent: 125000,
  },
  {
    id: 3,
    name: "Rahul Kumar",
    phone: "9876512345",
    email: "rahul@example.com",
    address: "Thiruvananthapuram, Kerala",
    purchases: 5,
    totalSpent: 76000,
  },
];

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  address: "",
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const inputClass =
  "w-full rounded-lg border border-[#e5dfd3] bg-white px-3 py-2.5 text-sm font-normal text-[#302c25] outline-none transition focus:border-[#b59651] focus:ring-2 focus:ring-[#b59651]/15";

const iconButtonClass =
  "grid h-[34px] w-[34px] shrink-0 place-items-center rounded-lg border border-[#e9e3d8] bg-white text-[#776e5e] transition hover:border-[#b59651] hover:text-[#9a7837]";

const primaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-[#9a7837] bg-[#9a7837] px-4 py-2.5 text-[13px] font-semibold text-white transition hover:border-[#806128] hover:bg-[#806128]";

const modalOverlayClass =
  "fixed inset-0 z-[1000] flex items-center justify-center overflow-y-auto bg-[#201d18]/45 p-4 sm:p-5";

const modalClass =
  "my-auto max-h-[90vh] w-full max-w-[520px] overflow-y-auto rounded-[14px] border border-[#e9e3d8] bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,0.15)] sm:p-[25px]";

export default function Customers() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewCustomer, setViewCustomer] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const filteredCustomers = customers.filter((customer) =>
    `${customer.name} ${customer.phone} ${customer.email}`
      .toLowerCase()
      .includes(search.toLowerCase().trim())
  );

  const openAddForm = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setShowForm(true);
  };

  const openEditForm = (customer) => {
    setEditingId(customer.id);
    setForm({
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
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

    if (!form.name.trim() || !form.phone.trim()) {
      window.alert("Customer name and phone number are required.");
      return;
    }

    const customerData = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
    };

    if (editingId !== null) {
      setCustomers((previous) =>
        previous.map((customer) =>
          customer.id === editingId
            ? { ...customer, ...customerData }
            : customer
        )
      );

      setViewCustomer((previous) =>
        previous?.id === editingId
          ? { ...previous, ...customerData }
          : previous
      );
    } else {
      setCustomers((previous) => [
        {
          id: Date.now(),
          ...customerData,
          purchases: 0,
          totalSpent: 0,
        },
        ...previous,
      ]);
    }

    closeForm();
  };

  const deleteCustomer = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (confirmed) {
      setCustomers((previous) =>
        previous.filter((customer) => customer.id !== id)
      );

      if (viewCustomer?.id === id) {
        setViewCustomer(null);
      }
    }
  };

  const statCards = [
    {
      label: "Total Customers",
      value: customers.length,
      icon: Users,
    },
    {
      label: "Contact Details",
      value: customers.filter((customer) => customer.phone).length,
      icon: Phone,
    },
    {
      label: "Email Records",
      value: customers.filter((customer) => customer.email).length,
      icon: Mail,
    },
  ];

  return (
    <div className="flex min-w-0 flex-col gap-6 text-[#302c25]">
      {/* Page heading */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="mb-[7px] text-2xl font-bold tracking-[-0.6px] sm:text-[28px]">
            Customers
          </h1>
          <p className="text-sm text-[#898276]">
            Manage customer profiles and purchase history.
          </p>
        </div>

        <button onClick={openAddForm} className={primaryButtonClass}>
          <Plus size={18} />
          Add Customer
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 min-[901px]:grid-cols-3">
        {statCards.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center gap-[15px] rounded-xl border border-[#e9e3d8] bg-white p-4 sm:p-[22px]"
          >
            <span className="grid h-[46px] w-[46px] shrink-0 place-items-center rounded-[10px] bg-[#f5efdf] text-[#9a7837]">
              <Icon size={21} />
            </span>

            <div className="min-w-0">
              <p className="mb-[7px] text-[13px] text-[#898276]">
                {label}
              </p>
              <h2 className="text-2xl font-bold">{value}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Customer directory */}
      <section className="overflow-hidden rounded-xl border border-[#e9e3d8] bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#eee9e0] p-4 sm:p-[22px]">
          <div>
            <h2 className="mb-1.5 text-[17px] font-bold">
              Customer Directory
            </h2>
            <p className="text-sm text-[#898276]">
              View and manage registered customers.
            </p>
          </div>

          <div className="flex w-full items-center gap-[9px] rounded-lg border border-[#e5dfd3] bg-white px-3 py-2.5 text-[#918878] transition focus-within:border-[#b59651] sm:max-w-[340px]">
            <Search size={18} className="shrink-0" />
            <input
              type="text"
              placeholder="Search name, phone or email..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full min-w-0 bg-transparent text-[13px] text-[#302c25] outline-none placeholder:text-[#a49b8d]"
            />
            {search && (
              <button
                type="button"
                title="Clear search"
                onClick={() => setSearch("")}
                className="shrink-0 text-[#898276] hover:text-[#9a7837]"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse text-left whitespace-nowrap">
            <thead>
              <tr className="bg-[#faf8f3]">
                {[
                  "Customer",
                  "Contact",
                  "Location",
                  "Purchases",
                  "Total Spent",
                  "Actions",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-[18px] py-[14px] text-[11px] font-bold tracking-[0.5px] text-[#81796c] uppercase"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-[#f0ece5] transition last:border-b-0 hover:bg-[#fdfbf7]"
                >
                  <td className="px-[18px] py-4">
                    <div className="flex items-center gap-[11px]">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#f1e8d4] font-bold text-[#8b6c32]">
                        {customer.name.charAt(0).toUpperCase()}
                      </span>
                      <strong className="text-[13px] font-semibold text-[#302c25]">
                        {customer.name}
                      </strong>
                    </div>
                  </td>

                  <td className="px-[18px] py-4">
                    <div className="flex flex-col gap-[5px] text-[13px] text-[#514b41]">
                      <span>{customer.phone || "—"}</span>
                      <span className="text-xs text-[#969083]">
                        {customer.email || "No email"}
                      </span>
                    </div>
                  </td>

                  <td className="px-[18px] py-4 text-[13px] text-[#514b41]">
                    {customer.address || "—"}
                  </td>

                  <td className="px-[18px] py-4 text-[13px] text-[#514b41]">
                    {customer.purchases}
                  </td>

                  <td className="px-[18px] py-4 text-[13px] font-semibold text-[#514b41]">
                    {formatCurrency(customer.totalSpent)}
                  </td>

                  <td className="px-[18px] py-4">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        title="View customer"
                        aria-label={`View ${customer.name}`}
                        onClick={() => setViewCustomer(customer)}
                        className={iconButtonClass}
                      >
                        <Eye size={17} />
                      </button>

                      <button
                        type="button"
                        title="Edit customer"
                        aria-label={`Edit ${customer.name}`}
                        onClick={() => openEditForm(customer)}
                        className={iconButtonClass}
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        title="Delete customer"
                        aria-label={`Delete ${customer.name}`}
                        onClick={() => deleteCustomer(customer.id)}
                        className={`${iconButtonClass} hover:border-[#e7b7b2] hover:bg-[#fff5f4] hover:text-[#c0392b]`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredCustomers.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-sm text-[#898276]"
                  >
                    <Users
                      size={30}
                      className="mx-auto mb-3 text-[#c8b994]"
                    />
                    No customers found. Try another search or add a customer.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-[#f0ece5] px-5 py-[15px] text-xs text-[#898276]">
          Showing {filteredCustomers.length} of {customers.length} customers
        </div>
      </section>

      {/* Add / Edit customer modal */}
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
            aria-labelledby="customer-form-title"
            className={modalClass}
          >
            <div className="mb-6 flex items-start justify-between gap-[15px]">
              <div>
                <h2
                  id="customer-form-title"
                  className="mb-1.5 text-[21px] font-bold text-[#302c25]"
                >
                  {editingId !== null ? "Edit Customer" : "Add Customer"}
                </h2>
                <p className="text-[13px] text-[#898276]">
                  Enter the customer's contact information.
                </p>
              </div>

              <button
                type="button"
                aria-label="Close form"
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
                  autoFocus
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  placeholder="Enter full name"
                  className={inputClass}
                />
              </label>

              <label className="flex flex-col gap-2 text-[13px] font-semibold text-[#514b41]">
                Phone Number *
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(event) =>
                    setForm({ ...form, phone: event.target.value })
                  }
                  placeholder="Enter phone number"
                  className={inputClass}
                />
              </label>

              <label className="flex flex-col gap-2 text-[13px] font-semibold text-[#514b41]">
                Email Address
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm({ ...form, email: event.target.value })
                  }
                  placeholder="Enter email address"
                  className={inputClass}
                />
              </label>

              <label className="flex flex-col gap-2 text-[13px] font-semibold text-[#514b41]">
                Address
                <textarea
                  rows={3}
                  value={form.address}
                  onChange={(event) =>
                    setForm({ ...form, address: event.target.value })
                  }
                  placeholder="Enter address"
                  className={`${inputClass} resize-y`}
                />
              </label>

              <div className="mt-1.5 flex flex-wrap justify-end gap-2.5">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-lg border border-[#e5dfd3] bg-white px-[15px] py-2.5 text-[13px] font-medium text-[#514b41] transition hover:bg-[#faf8f3]"
                >
                  Cancel
                </button>

                <button type="submit" className={primaryButtonClass}>
                  {editingId !== null ? (
                    <>
                      <Pencil size={16} />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Plus size={17} />
                      Add Customer
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* Customer details modal */}
      {viewCustomer && (
        <div
          className={modalOverlayClass}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setViewCustomer(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="customer-details-title"
            className={modalClass}
          >
            <div className="mb-6 flex items-start justify-between gap-[15px]">
              <div>
                <h2
                  id="customer-details-title"
                  className="mb-1.5 text-[21px] font-bold text-[#302c25]"
                >
                  Customer Details
                </h2>
                <p className="text-[13px] text-[#898276]">
                  Customer profile overview.
                </p>
              </div>

              <button
                type="button"
                aria-label="Close customer details"
                onClick={() => setViewCustomer(null)}
                className={iconButtonClass}
              >
                <X size={20} />
              </button>
            </div>

            <div className="pb-5 text-center">
              <div className="mx-auto mb-3 grid h-[72px] w-[72px] place-items-center rounded-full bg-[#f1e8d4] text-[26px] font-bold text-[#8b6c32]">
                {viewCustomer.name.charAt(0).toUpperCase()}
              </div>

              <h3 className="text-xl font-bold text-[#302c25]">
                {viewCustomer.name}
              </h3>
            </div>

            <div className="space-y-4 rounded-[10px] bg-[#faf8f3] p-4">
              <div className="flex items-start gap-3">
                <Phone
                  size={17}
                  className="mt-0.5 shrink-0 text-[#9a7837]"
                />
                <div className="min-w-0">
                  <p className="mb-1 text-xs text-[#898276]">Phone Number</p>
                  <p className="break-words text-[13px] font-medium text-[#514b41]">
                    {viewCustomer.phone || "—"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail
                  size={17}
                  className="mt-0.5 shrink-0 text-[#9a7837]"
                />
                <div className="min-w-0">
                  <p className="mb-1 text-xs text-[#898276]">Email Address</p>
                  <p className="break-all text-[13px] font-medium text-[#514b41]">
                    {viewCustomer.email || "—"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin
                  size={17}
                  className="mt-0.5 shrink-0 text-[#9a7837]"
                />
                <div className="min-w-0">
                  <p className="mb-1 text-xs text-[#898276]">Address</p>
                  <p className="break-words text-[13px] font-medium text-[#514b41]">
                    {viewCustomer.address || "—"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShoppingBag
                  size={17}
                  className="mt-0.5 shrink-0 text-[#9a7837]"
                />
                <div>
                  <p className="mb-1 text-xs text-[#898276]">Total Purchases</p>
                  <p className="text-[13px] font-medium text-[#514b41]">
                    {viewCustomer.purchases}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <IndianRupee
                  size={17}
                  className="mt-0.5 shrink-0 text-[#9a7837]"
                />
                <div>
                  <p className="mb-1 text-xs text-[#898276]">Total Spent</p>
                  <p className="text-[13px] font-semibold text-[#302c25]">
                    {formatCurrency(viewCustomer.totalSpent)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  const customer = viewCustomer;
                  setViewCustomer(null);
                  openEditForm(customer);
                }}
                className={primaryButtonClass}
              >
                <Pencil size={16} />
                Edit Customer
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
