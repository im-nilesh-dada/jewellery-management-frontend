import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, Gem, RefreshCw } from "lucide-react";

import ProductStats from "../components/Products/ProductStats";
import ProductToolbar from "../components/Products/ProductToolBar";
import ProductTable from "../components/Products/ProductTable";
import ProductForm from "../components/Products/ProductForm";

import productService from "../services/productService";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [metalFilter, setMetalFilter] = useState("All");

  const [sortOrder, setSortOrder] = useState("none");

  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (err) {
      setError(err.message || "Unable to load products.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const categories = useMemo(
    () =>
      [...new Set(products.map((product) => product.category))].sort((a, b) =>
        a.localeCompare(b)
      ),
    [products]
  );

  const metalTypes = useMemo(
    () =>
      [...new Set(products.map((product) => product.metalType))].sort((a, b) =>
        a.localeCompare(b)
      ),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = products.filter((product) => {
      const matchesSearch = [
        product.id,
        product.name,
        product.category,
        product.metalType,
        product.purity,
      ].some((value) => String(value).toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "All" || product.status === statusFilter;

      const matchesCategory =
        categoryFilter === "All" || product.category === categoryFilter;

      const matchesMetal =
        metalFilter === "All" || product.metalType === metalFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory &&
        matchesMetal
      );
    });

    if (sortOrder !== "none") {
      result.sort((a, b) => {
        const difference = Number(a.weight) - Number(b.weight);

        return sortOrder === "asc" ? difference : -difference;
      });
    }

    return result;
  }, [
    products,
    search,
    statusFilter,
    categoryFilter,
    metalFilter,
    sortOrder,
  ]);

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setCategoryFilter("All");
    setMetalFilter("All");
    setSortOrder("none");
  };

  const openAddForm = () => {
    setEditingProduct(null);
    setFormOpen(true);
    setError("");
  };

  const openEditForm = (product) => {
    setEditingProduct(product);
    setFormOpen(true);
    setError("");
  };

  const closeForm = () => {
    if (saving) return;

    setFormOpen(false);
    setEditingProduct(null);
  };

  const handleSave = async (formData) => {
    setSaving(true);
    setError("");

    try {
      if (editingProduct) {
        await productService.update(editingProduct.id, formData);
      } else {
        await productService.create(formData);
      }

      const updatedProducts = await productService.getAll();
      setProducts(updatedProducts);

      setFormOpen(false);
      setEditingProduct(null);
    } catch (err) {
      setError(err.message || "Unable to save the product.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Delete "${product.name}" (${product.id})? This action cannot be undone.`
    );

    if (!confirmed) return;

    setError("");

    try {
      await productService.remove(product.id);

      setProducts((current) =>
        current.filter((item) => item.id !== product.id)
      );
    } catch (err) {
      setError(err.message || "Unable to delete the product.");
    }
  };

  const handleToggleStatus = async (product) => {
    setError("");

    try {
      const updated = await productService.toggleStatus(product.id);

      setProducts((current) =>
        current.map((item) => (item.id === updated.id ? updated : item))
      );
    } catch (err) {
      setError(err.message || "Unable to update product status.");
    }
  };

  const handleSort = () => {
    setSortOrder((current) => {
      if (current === "none") return "asc";
      if (current === "asc") return "desc";
      return "none";
    });
  };

  return (
    <main className="min-h-full space-y-5 bg-[#faf9f6] p-4 sm:p-5 lg:p-6">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#e9dfc9] bg-[#f5f0e5] text-[#9a7837]">
            <Gem size={21} />
          </div>

          <div>
            <h1 className="text-xl font-semibold tracking-tight text-[#292821]">
              Products
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage your jewellery catalogue and product details.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={loadProducts}
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

          <p className="flex-1">{error}</p>

          <button
            type="button"
            onClick={() => setError("")}
            className="text-xs font-medium underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Summary cards */}
      <ProductStats products={products} />

      {/* Search, filters and add button */}
      <ProductToolbar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        metalFilter={metalFilter}
        onMetalChange={setMetalFilter}
        categories={categories}
        metalTypes={metalTypes}
        onAdd={openAddForm}
        onReset={resetFilters}
      />

      {/* Catalogue table */}
      {loading ? (
        <div className="rounded-xl border border-[#ebe8e1] bg-white px-4 py-16 text-center shadow-sm">
          <RefreshCw
            size={22}
            className="mx-auto mb-3 animate-spin text-[#9a7837]"
          />

          <p className="text-sm text-gray-500">Loading products...</p>
        </div>
      ) : (
        <ProductTable
          products={filteredProducts}
          onEdit={openEditForm}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
          sortOrder={sortOrder}
          onSort={handleSort}
        />
      )}

      {/* Add/edit modal */}
      {formOpen && (
        <ProductForm
          product={editingProduct}
          onClose={closeForm}
          onSubmit={handleSave}
          saving={saving}
        />
      )}
    </main>
  );
}

export default Products;