import React, { useState, useMemo, useEffect } from "react";
import Navbar from "../../components/layout/Navbar";
import ProductCard from "../../components/cards/ProductCard";
import { useProducts } from "../../api/products";
import CartModal from "../../components/cart/CartModal";
import { Link } from "react-router-dom";
import Fuse from "fuse.js";
import axiosInstance from "../../api/axiosInstance";
import { showError } from "../../utils/toast";

const CustomerDashboard: React.FC = () => {
  const { data: products = [], isLoading } = useProducts();

  /* -------------------------------------------------------
     Load user city from login
  -------------------------------------------------------- */
  const userCity = localStorage.getItem("livemart:city") || "";

  console.log("User city:", userCity);
  console.log("Products returned:", products);

  /* -------------------------------------------------------
     UI states
  -------------------------------------------------------- */
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const [cityFilteredProducts, setCityFilteredProducts] = useState<any[] | null>(null);
  const [cityLoading, setCityLoading] = useState(false);

  /* -------------------------------------------------------
     SEARCH DEBOUNCE
  -------------------------------------------------------- */
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);

      if (search.trim()) {
        setHistory(prev => [...new Set([search, ...prev])].slice(0, 5));
      }
    }, 300);

    return () => clearTimeout(t);
  }, [search]);

  /* -------------------------------------------------------
     FLATTEN CATEGORY LIST
  -------------------------------------------------------- */
  const categories = Array.from(new Set(products.map((p) => p.category)));

  /* -------------------------------------------------------
     FUZZY SEARCH ENGINE
  -------------------------------------------------------- */
  const fuse = useMemo(
    () =>
      new Fuse(products, {
        keys: ["name", "description", "category"],
        threshold: 0.3,
      }),
    [products]
  );

  /* -------------------------------------------------------
     APPLY CITY FILTER
  -------------------------------------------------------- */
  const applyCityFilter = async () => {
    if (!userCity) {
      showError("City info missing — please log in again.");
      return;
    }

    try {
      setCityLoading(true);
      const { data } = await axiosInstance.get(`/products?city=${userCity}`);
      setCityFilteredProducts(data);
    } catch {
      showError("Failed to filter by city.");
    } finally {
      setCityLoading(false);
    }
  };

  const clearCityFilter = () => setCityFilteredProducts(null);

  /* -------------------------------------------------------
     Choose base product list
  -------------------------------------------------------- */
  const baseProducts = cityFilteredProducts || products;

  /* -------------------------------------------------------
     FINAL FILTERING PIPELINE
  -------------------------------------------------------- */
  const filteredProducts = useMemo(() => {
    let results = baseProducts;

    // Fuzzy Search
    if (debouncedSearch) {
      const fuseInstance = new Fuse(baseProducts, {
        keys: ["name", "description", "category"],
        threshold: 0.3,
      });
      results = fuseInstance.search(debouncedSearch).map(r => r.item);
    }

    // Category Filter
    if (selectedCategory) {
      results = results.filter((p) => p.category === selectedCategory);
    }

    // Price Filter
    results = results.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    return results;
  }, [debouncedSearch, selectedCategory, priceRange, baseProducts]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <CartModal />

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold tracking-wide">Explore Products</h1>

          <div className="flex gap-3">
            <Link
              to="/customer/orders"
              className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 
              hover:bg-white/20 transition text-sm"
            >
              My Orders
            </Link>

            <Link
              to="/customer/proxy-wholesale"
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 
              transition shadow-lg text-sm font-semibold"
            >
              Proxy Wholesale Mode
            </Link>
          </div>
        </div>

        {/* CITY FILTER */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={applyCityFilter}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 
            transition text-white shadow-md"
          >
            Search By City ({userCity || "Unknown"})
          </button>

          {cityFilteredProducts && (
            <button
              onClick={clearCityFilter}
              className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 
              transition shadow-md"
            >
              Clear City Filter
            </button>
          )}
        </div>

        {/* SEARCH BAR */}
        <div className="glass-card p-4 rounded-2xl mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 
            border border-white/20 text-white placeholder-slate-400 
            focus:ring-2 focus:ring-blue-500/60 outline-none"
          />
        </div>

        {/* HISTORY */}
        {history.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-5">
            {history.map((item, i) => (
              <button
                key={i}
                onClick={() => setSearch(item)}
                className="px-3 py-1 rounded-full text-xs bg-slate-800/60 
                border border-slate-600 hover:bg-slate-700 transition"
              >
                {item}
              </button>
            ))}
          </div>
        )}

        {/* CATEGORY FILTER */}
        <div className="flex gap-3 flex-wrap mb-8">
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

        {/* PRICE SLIDER */}
        <div className="glass-card p-4 rounded-2xl mb-10">
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

        {/* PRODUCT GRID */}
        {isLoading || cityLoading ? (
          <p className="text-center text-slate-400 mt-10 text-lg">
            Loading products…
          </p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-center text-slate-400 mt-10 text-lg">
            ❌ No matching products found
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
