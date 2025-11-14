// src/pages/retailer/BuyWholesalePage.tsx
import React from "react";
import { useProducts } from "../../api/products";
import Navbar from "../../components/layout/Navbar";
import ProtectedRoute from "../../routes/ProtectedRoute";
import WholesaleCartModal from "../../components/cart/WholesaleCartModal";
import { useWholesaleCart } from "../../context/WholesaleCartContext"; // ✅ Make sure this import exists
import { showSuccess } from "../../utils/toast";

const BuyWholesalePage: React.FC = () => {
  const { data: products = [], isLoading, isError } = useProducts();
  const { addItem } = useWholesaleCart(); // ✅ Define it here

  return (
    <ProtectedRoute allowedRoles={["retailer"]}>
      <div className="min-h-screen bg-slate-950 text-white">
        <Navbar />
        <WholesaleCartModal />

        <main className="max-w-6xl mx-auto p-6">
          <h1 className="text-2xl font-semibold mb-4">
            Buy from Wholesalers
          </h1>

          {isLoading ? (
            <p className="text-slate-400">Loading wholesale products...</p>
          ) : isError ? (
            <p className="text-red-400">Failed to load products.</p>
          ) : products.length === 0 ? (
            <p className="text-slate-400">No wholesale products available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="glass-card p-4 rounded-xl hover:bg-slate-900/40"
                >
                  <img
                    src={p.image_url ?? "/placeholder.png"}
                    alt={p.name}
                    className="w-full h-40 object-cover rounded-md mb-3"
                  />
                  <h2 className="text-lg font-semibold">{p.name}</h2>
                  <p className="text-sm text-slate-400 mb-2">
                    {p.description ?? "No description"}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-400 font-semibold">
                      ₹{p.price}
                    </span>
                    <button
                      onClick={() => {
                        addItem(p);
                        showSuccess("Added to wholesale cart");
                      }}
                      className="px-3 py-1 bg-emerald-600 text-sm rounded-md hover:bg-emerald-700"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default BuyWholesalePage;
