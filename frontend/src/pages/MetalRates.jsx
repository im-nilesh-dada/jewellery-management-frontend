import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Gem,
  RefreshCw,
} from "lucide-react";

import MetalRateStats from "../components/MetalRates/MetalRateStats";
import MetalRateToolbar from "../components/MetalRates/MetalRateToolbar";
import MetalRateTable from "../components/MetalRates/MetalRateTable";
import MetalRateForm from "../components/MetalRates/MetalRateForm";

import metalRateService from "../services/metalRateService";

function MetalRates() {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [metalFilter, setMetalFilter] = useState("All");
  const [purityFilter, setPurityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [sortBy, setSortBy] = useState("updatedAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const [formOpen, setFormOpen] = useState(false);
  const [editingRate, setEditingRate] = useState(null);

  const loadRates = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await metalRateService.getAll();
      setRates(data);
    } catch (err) {
      setError(err.message || "Unable to load metal rates.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRates();
  }, [loadRates]);

  const purities = useMemo(
    () =>
      [
        ...new Set(
          rates
            .filter(
              (rate) =>
                metalFilter === "All" || rate.metalType === metalFilter
            )
            .map((rate) => rate.purity)
        ),
      ].sort((a, b) => a.localeCompare(b, undefined, { numeric: true })),
    [rates, metalFilter]
  );

  // If a metal filter changes, clear a purity that no longer applies.
  useEffect(() => {
    if (purityFilter !== "All" && !purities.includes(purityFilter)) {
      setPurityFilter("All");
    }
  }, [purityFilter, purities]);

  const filteredRates = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = rates.filter((rate) => {
      const matchesSearch = [
        rate.id,
        rate.metalType,
        rate.purity,
        rate.ratePerGram,
        rate.effectiveFrom,
      ].some((value) => String(value).toLowerCase().includes(query));

      const matchesMetal =
        metalFilter === "All" || rate.metalType === metalFilter;

      const matchesPurity =
        purityFilter === "All" || rate.purity === purityFilter;

      const matchesStatus =
        statusFilter === "All" || rate.status === statusFilter;

      return (
        matchesSearch &&
        matchesMetal &&
        matchesPurity &&
        matchesStatus
      );
    });

    result.sort((a, b) => {
      let comparison = 0;

      if (sortBy === "ratePerGram") {
        comparison =
          Number(a.ratePerGram) - Number(b.ratePerGram);
      } else {
        comparison =
          new Date(a.updatedAt).getTime() -
          new Date(b.updatedAt).getTime();
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [
    rates,
    search,
    metalFilter,
    purityFilter,
    statusFilter,
    sortBy,
    sortOrder,
  ]);

  const resetFilters = () => {
    setSearch("");
    setMetalFilter("All");
    setPurityFilter("All");
    setStatusFilter("All");
    setSortBy("updatedAt");
    setSortOrder("desc");
  };

  const openAddForm = () => {
    setEditingRate(null);
    setError("");
    setFormOpen(true);
  };

  const openEditForm = (rate) => {
    setEditingRate(rate);
    setError("");
    setFormOpen(true);
  };

  const closeForm = () => {
    if (saving) return;

    setFormOpen(false);
    setEditingRate(null);
  };

  const handleSave = async (formData) => {
    setSaving(true);
    setError("");

    try {
      if (editingRate) {
        await metalRateService.update(editingRate.id, formData);
      } else {
        await metalRateService.create(formData);
      }

      const updatedRates = await metalRateService.getAll();
      setRates(updatedRates);

      setFormOpen(false);
      setEditingRate(null);
    } catch (err) {
      setError(err.message || "Unable to save the metal rate.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (rate) => {
    const confirmed = window.confirm(
      `Delete rate ${rate.id} (${rate.metalType} ${rate.purity})?`
    );

    if (!confirmed) return;

    setError("");

    try {
      await metalRateService.remove(rate.id);

      setRates((current) =>
        current.filter((item) => item.id !== rate.id)
      );
    } catch (err) {
      setError(err.message || "Unable to delete the metal rate.");
    }
  };

  const handleToggleStatus = async (rate) => {
    setError("");

    try {
      const updatedRate = await metalRateService.toggleStatus(rate.id);

      setRates((current) =>
        current.map((item) =>
          item.id === updatedRate.id ? updatedRate : item
        )
      );
    } catch (err) {
      setError(err.message || "Unable to update the rate status.");
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder((current) =>
        current === "asc" ? "desc" : "asc"
      );
    } else {
      setSortBy(field);
      setSortOrder(field === "ratePerGram" ? "asc" : "desc");
    }
  };

  return (
    <main className="min-h-full min-w-0 space-y-5 bg-[#faf9f6] p-4 sm:p-5 lg:p-6">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#e9dfc9] bg-[#f5f0e5] text-[#9a7837]">
            <Gem size={21} />
          </div>

          <div className="min-w-0">
            <h1 className="text-xl font-semibold tracking-tight text-[#292821]">
              Metal Rates
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage gold and silver rates by purity and effective date.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={loadRates}
          disabled={loading}
          className="inline-flex h-9 items-center justify-center gap-2 self-start rounded-lg border border-[#e5e1d8] bg-white px-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
        >
          <RefreshCw
            size={15}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
        >
          <AlertCircle size={17} className="mt-0.5 shrink-0" />

          <p className="min-w-0 flex-1">{error}</p>

          <button
            type="button"
            onClick={() => setError("")}
            className="text-xs font-medium underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Statistics */}
      <MetalRateStats rates={rates} />

      {/* Search and filters */}
      <MetalRateToolbar
        search={search}
        onSearchChange={setSearch}
        metalFilter={metalFilter}
        onMetalChange={setMetalFilter}
        purityFilter={purityFilter}
        onPurityChange={setPurityFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        purities={purities}
        onReset={resetFilters}
        onAdd={openAddForm}
      />

      {/* Rate catalogue */}
      {loading ? (
        <div className="rounded-xl border border-[#ebe8e1] bg-white px-4 py-16 text-center shadow-sm">
          <RefreshCw
            size={22}
            className="mx-auto mb-3 animate-spin text-[#9a7837]"
          />

          <p className="text-sm text-gray-500">
            Loading metal rates...
          </p>
        </div>
      ) : (
        <MetalRateTable
          rates={filteredRates}
          onEdit={openEditForm}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
        />
      )}

      {/* Add/edit form */}
      {formOpen && (
        <MetalRateForm
          rate={editingRate}
          rates={rates}
          onClose={closeForm}
          onSubmit={handleSave}
          saving={saving}
        />
      )}
    </main>
  );
}

export default MetalRates;