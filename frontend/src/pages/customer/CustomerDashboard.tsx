// src/pages/customer/CustomerDashboard.tsx
import React, { useState, useMemo, useEffect } from "react";
import Navbar from "../../components/layout/Navbar";
import ProductCard from "../../components/cards/ProductCard";
import { useProducts } from "../../api/products";
import CartModal from "../../components/cart/CartModal";
import { Link } from "react-router-dom";
import Fuse from "fuse.js"; // fuzzy search library

const CustomerDashboard: React.FC = () => {
  const { data: products = [], isLoading } = useProducts();

  // ------------------------------
  // SEARCH STATES
  // ------------------------------
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  // ------------------------------
  // DEBOUNCE SEARCH INPUT
  // ------------------------------
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      if (search.trim().length > 0) {
        setHistory((prev) =>
          [...new Set([search, ...prev])].slice(0, 5) // keep latest 5
        );
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(handler);
  }, [search]);

  // ------------------------------
  // CATEGORIES FROM PRODUCT LIST
  // ------------------------------
  const categories = Array.from(new Set(products.map((p) => p.category)));

  // ------------------------------
  // FUZZY SEARCH INSTANCE
  // ------------------------------
  const fuse = useMemo(
    () =>
      new Fuse(products, {
        keys: ["name", "description", "category"],
        threshold: 0.3, // typo tolerance
      }),
    [products]
  );

  // ------------------------------
  // FINAL FILTERED RESULTS
  // ------------------------------
  const filteredProducts = useMemo(() => {
    let results = products;

    // Fuzzy search OR simple search
    if (debouncedSearch.trim() !== "") {
      const fuzzyResults = fuse.search(debouncedSearch).map((r) => r.item);
      results = fuzzyResults;
    }

    // Category Filter
    if (selectedCategory) {
      results = results.filter((p) => p.category === selectedCategory);
    }

    // Price Range
    results = results.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    return results;
  }, [debouncedSearch, priceRange, selectedCategory, fuse, products]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <CartModal />

      <main className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Available Products</h1>
          <Link
            to="/customer/orders"
            className="btn glass-card px-3 py-2 text-sm"
          >
            My Orders
          </Link>
        </div>

        {/* ------------------------------
            SEARCH BAR
        ------------------------------ */}
        <input
          type="text"
          placeholder="Search for products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-4 p-2 rounded bg-slate-900 text-white border border-slate-700 focus:ring-2 focus:ring-blue-600"
        />

        {/* ------------------------------
            SEARCH HISTORY BADGES
        ------------------------------ */}
        {history.length > 0 && (
          <div className="flex gap-2 mb-4 flex-wrap">
            {history.map((item, idx) => (
              <span
                key={idx}
                onClick={() => setSearch(item)}
                className="px-3 py-1 bg-slate-800 text-sm rounded-full border border-slate-600 cursor-pointer hover:bg-slate-700"
              >
                {item}
              </span>
            ))}
          </div>
        )}

        {/* ------------------------------
            CATEGORY FILTER CHIPS
        ------------------------------ */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <span
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1 rounded-full text-sm cursor-pointer border ${
              selectedCategory === null
                ? "bg-blue-700 border-blue-600"
                : "bg-slate-800 border-slate-700"
            }`}
          >
            All
          </span>

          {categories.map((c) => (
            <span
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1 rounded-full text-sm cursor-pointer border ${
                selectedCategory === c
                  ? "bg-blue-700 border-blue-600"
                  : "bg-slate-800 border-slate-700"
              }`}
            >
              {c}
            </span>
          ))}
        </div>

        {/* ------------------------------
            PRICE RANGE SELECTOR
        ------------------------------ */}
        <div className="mb-6">
          <label className="block mb-2 text-sm text-slate-300">
            Price Range (₹{priceRange[0]} - ₹{priceRange[1]})
          </label>
          <input
            type="range"
            min={0}
            max={50000}
            value={priceRange[1]}
            onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
            className="w-full"
          />
        </div>

        {/* ------------------------------
            PRODUCT LIST
        ------------------------------ */}
        {isLoading ? (
          <p className="text-slate-400">Loading products...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-slate-400 text-center mt-6">
            ❌ No matching products found.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomerDashboard;
