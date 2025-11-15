import React, { useState, useMemo, useEffect } from "react";
import Navbar from "../../components/layout/Navbar";
import ProductCard from "../../components/cards/ProductCard";
import { useProducts } from "../../api/products";
import CartModal from "../../components/cart/CartModal";
import { Link } from "react-router-dom";
import Fuse from "fuse.js";

const CustomerDashboard: React.FC = () => {
  const { data: products = [], isLoading } = useProducts();

  /* ---------------------------------------------
      SEARCH & FILTER STATES
  --------------------------------------------- */
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  /* ---------------------------------------------
      DEBOUNCE SEARCH
  --------------------------------------------- */
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);

      if (search.trim()) {
        setHistory((prev) =>
          [...new Set([search, ...prev])].slice(0, 5)
        );
      }
    }, 300);

    return () => clearTimeout(t);
  }, [search]);

  /* ---------------------------------------------
      CATEGORY LIST
  --------------------------------------------- */
  const categories = Array.from(new Set(products.map((p) => p.category)));

  /* ---------------------------------------------
      FUZZY SEARCH
  --------------------------------------------- */
  const fuse = useMemo(() => {
    return new Fuse(products, {
      keys: ["name", "description", "category"],
      threshold: 0.3,
    });
  }, [products]);

  /* ---------------------------------------------
      FILTERING LOGIC
  --------------------------------------------- */
  const filteredProducts = useMemo(() => {
    let results = products;

    if (debouncedSearch) {
      results = fuse.search(debouncedSearch).map((r) => r.item);
    }

    if (selectedCategory) {
      results = results.filter((p) => p.category === selectedCategory);
    }

    results = results.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    return results;
  }, [debouncedSearch, selectedCategory, priceRange, fuse, products]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <CartModal />

      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white tracking-wide">
            Explore Products
          </h1>
          <Link
            to="/customer/orders"
            className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition text-sm"
          >
            My Orders
          </Link>
        </div>

        {/* SEARCH BAR */}
        <div className="mb-6 glass-card p-4 rounded-2xl">
          <input
            type="text"
            placeholder="Search by name, category, type…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500/60 outline-none"
          />
        </div>

        {/* SEARCH HISTORY */}
        {history.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-4">
            {history.map((item, i) => (
              <button
                key={i}
                onClick={() => setSearch(item)}
                className="px-3 py-1 rounded-full text-xs bg-slate-800/60 border border-slate-600 hover:bg-slate-700 transition"
              >
                {item}
              </button>
            ))}
          </div>
        )}

        {/* CATEGORIES */}
        <div className="flex gap-3 flex-wrap mb-6">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-1.5 rounded-full text-sm border transition ${
              selectedCategory === null
                ? "bg-blue-600 text-white border-blue-500 shadow-lg"
                : "bg-white/10 border-white/20"
            }`}
          >
            All
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm border transition ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white border-blue-500 shadow-lg"
                  : "bg-white/10 border-white/20 hover:bg-white/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* PRICE RANGE */}
        <div className="glass-card p-4 rounded-2xl mb-8">
          <label className="block text-sm mb-2 text-slate-300">
            Price Range — ₹{priceRange[0]} to ₹{priceRange[1]}
          </label>
          <input
            type="range"
            min={0}
            max={50000}
            value={priceRange[1]}
            onChange={(e) => setPriceRange([0, Number(e.target.value)])}
            className="w-full accent-blue-500"
          />
        </div>

        {/* PRODUCT LIST */}
        {isLoading ? (
          <p className="text-center text-slate-400 mt-10">Loading products...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-center text-slate-400 mt-10 text-lg">
            ❌ No matching products found
          </p>
        ) : (
          <div className="glass-card p-6 rounded-3xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
