// src/pages/retailer/BuyWholesalePage.tsx

import React from "react";
import { useProducts } from "../../api/products";
import Navbar from "../../components/layout/Navbar";
import ProtectedRoute from "../../routes/ProtectedRoute";
import WholesaleCartModal from "../../components/cart/WholesaleCartModal";
import { useWholesaleCart } from "../../context/WholesaleCartContext";
import { showSuccess } from "../../utils/toast";

const BuyWholesalePage: React.FC = () => {
  const { data: products = [], isLoading, isError } = useProducts();
  const { addItem } = useWholesaleCart();

  return (
    <ProtectedRoute allowedRoles={["retailer"]}>
      <div className="min-h-screen bg-slate-950 text-white">
        <Navbar />
        <WholesaleCartModal />

        <main className="max-w-6xl mx-auto px-6 py-10">

          {/* HEADER */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-wide">
              Buy Wholesale Products
            </h1>
            <p className="text-slate-400 mt-1">
              Restock your inventory directly from wholesalers.
            </p>
          </div>

          {/* LOADING / ERROR */}
          {isLoading && (
            <p className="text-slate-400 text-center">Loading wholesale products…</p>
          )}

          {isError && (
            <p className="text-red-400 text-center">Failed to load products.</p>
          )}

          {/* EMPTY STATE */}
          {!isLoading && !isError && products.length === 0 && (
            <div className="flex flex-col items-center mt-20">
              <div className="glass-card p-10 rounded-3xl text-center max-w-md">
                <p className="text-xl font-semibold mb-2">No Products Available</p>
                <p className="text-slate-400 text-sm mb-6">
                  Wholesalers haven't added any items yet.
                </p>
              </div>
            </div>
          )}

          {/* PRODUCT GRID */}
          {!isLoading && !isError && products.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {products.map((p) => (
                <div
                  key={p.id}
                  className="glass-card rounded-2xl p-5 hover:scale-[1.02] transition-all duration-300"
                >
                  {/* IMAGE */}
                  <div className="w-full h-40 mb-4 overflow-hidden rounded-xl">
                    <img
                      src={p.image_url ?? "/placeholder.png"}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* NAME */}
                  <h2 className="text-lg font-semibold mb-1">{p.name}</h2>

                  {/* DESCRIPTION */}
                  <p className="text-sm text-slate-400 mb-3 line-clamp-2">
                    {p.description ?? "No description available."}
                  </p>

                  {/* PRICE + BUTTON */}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-emerald-400 font-semibold text-lg">
                      ₹{p.price}
                    </span>

                    <button
                      onClick={() => {
                        addItem(p);
                        showSuccess("Added to wholesale cart");
                      }}
                      className="bg-gradient-to-r from-emerald-600 to-green-700 
                                 px-4 py-1.5 text-sm rounded-xl font-medium
                                 hover:opacity-90 transition shadow-md"
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
