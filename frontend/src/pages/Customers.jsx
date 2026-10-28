import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw, Users } from "lucide-react";

import CustomerStats from "../components/Customers/CustomerStats";
import CustomerToolbar from "../components/Customers/CustomerToolbar";
import CustomerTable from "../components/Customers/CustomerTable";
import CustomerForm from "../components/Customers/CustomerForm";
import CustomerDetailsModal from "../components/Customers/CustomerDetailsModal";

import customerService from "../services/customerService";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const loadCustomers = useCallback(async ({ silent = false } = {}) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const data = await customerService.getAll();
      setCustomers(data);
    } catch (err) {
      setError(err.message || "Unable to load customers.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  useEffect(() => {
    if (!notice) return undefined;

    const timer = window.setTimeout(() => {
      setNotice("");
    }, 3500);

    return () => window.clearTimeout(timer);
  }, [notice]);

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return customers.filter((customer) => {
      const matchesSearch =
        !query ||
        customer.customerId.toLowerCase().includes(query) ||
        customer.name.toLowerCase().includes(query) ||
        customer.phone.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.city.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || customer.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [customers, search, statusFilter]);

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setShowForm(true);
  };

  const handleOpenEdit = (customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditingCustomer(null);
  };

  const handleSave = async (formData) => {
    setSaving(true);
    setError("");

    try {
      if (editingCustomer) {
        await customerService.update(
          editingCustomer.customerId,
          formData,
        );

        setNotice("Customer details updated successfully.");
      } else {
        await customerService.create(formData);
        setNotice("Customer registered successfully.");
      }

      setShowForm(false);
      setEditingCustomer(null);

      await loadCustomers({ silent: true });
    } catch (err) {
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (customer) => {
    const confirmed = window.confirm(
      `Delete ${customer.name} (${customer.customerId})?\n\nCustomers with purchase history cannot be deleted. You can deactivate them instead.`,
    );

    if (!confirmed) return;

    setError("");
    setNotice("");

    try {
      await customerService.delete(customer.customerId);

      setNotice("Customer deleted successfully.");
      await loadCustomers({ silent: true });
    } catch (err) {
      setError(err.message || "Unable to delete customer.");
    }
  };

  const handleToggleStatus = async (customer) => {
    const nextStatus =
      customer.status === "Active" ? "Inactive" : "Active";

    const confirmed = window.confirm(
      `Change ${customer.name}'s status to ${nextStatus}?`,
    );

    if (!confirmed) return;

    setError("");

    try {
      await customerService.toggleStatus(customer.customerId);

      setNotice(`Customer status changed to ${nextStatus}.`);
      await loadCustomers({ silent: true });
    } catch (err) {
      setError(err.message || "Unable to update customer status.");
    }
  };

  const handleReset = () => {
    setSearch("");
    setStatusFilter("All");
  };

  return (
    <div className="space-y-6 bg-[#faf9f6] p-4 sm:p-6 lg:p-8">
      {/* Page heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-[#f0e5cf] p-3">
            <Users size={23} className="text-[#9a7837]" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#292821]">
              Customer Management
            </h1>

            <p className="mt-1 text-sm text-stone-500">
              Manage customer profiles and track purchase history.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => loadCustomers({ silent: true })}
          disabled={refreshing || loading}
          className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-[#e7e3da] bg-white px-4 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
        >
          <RefreshCw
            size={16}
            className={refreshing ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Notifications */}
      {notice && (
        <div
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          {notice}
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
            className="shrink-0 font-medium hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Statistics */}
      {!loading && <CustomerStats customers={customers} />}

      {/* Search and filters */}
      <CustomerToolbar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        onReset={handleReset}
        onAdd={handleOpenAdd}
      />

      {/* Customer table */}
      <section className="overflow-hidden rounded-xl border border-[#ebe8e1] bg-white">
        <div className="flex flex-col gap-1 border-b border-[#ebe8e1] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-[#292821]">
              Customer Directory
            </h2>

            <p className="mt-1 text-sm text-stone-500">
              Customer contact details and purchase summaries
            </p>
          </div>

          {!loading && (
            <p className="text-sm text-stone-500">
              Showing{" "}
              <span className="font-medium text-[#292821]">
                {filteredCustomers.length}
              </span>{" "}
              of {customers.length} customers
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 py-16 text-sm text-stone-500">
            <RefreshCw size={18} className="animate-spin" />
            Loading customers...
          </div>
        ) : error && customers.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-sm text-stone-600">
              Customer records could not be loaded.
            </p>

            <button
              type="button"
              onClick={() => loadCustomers()}
              className="mt-3 text-sm font-medium text-[#9a7837] hover:underline"
            >
              Try again
            </button>
          </div>
        ) : (
          <CustomerTable
            customers={filteredCustomers}
            onView={setSelectedCustomer}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
          />
        )}

        {!loading && filteredCustomers.length > 0 && (
          <div className="border-t border-[#ebe8e1] px-5 py-3">
            <p className="text-xs text-stone-500">
              Customer information is for demonstration purposes.
            </p>
          </div>
        )}
      </section>

      {/* Add / edit customer */}
      {showForm && (
        <CustomerForm
          customer={editingCustomer}
          onClose={handleCloseForm}
          onSubmit={handleSave}
          saving={saving}
        />
      )}

      {/* Customer profile and purchase history */}
      {selectedCustomer && (
        <CustomerDetailsModal
          customer={customers.find(
            (customer) =>
              customer.customerId === selectedCustomer.customerId,
          ) || selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
};

export default Customers;