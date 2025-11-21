// src/pages/customer/ProxyWholesalePage.tsx
import React from "react";
import axiosInstance from "../../api/axiosInstance";
import Navbar from "../../components/layout/Navbar";
import ProtectedRoute from "../../routes/ProtectedRoute";
import WholesaleCartModal from "../../components/cart/WholesaleCartModal";
import { useWholesaleCart } from "../../context/WholeSaleCartContext";
import ProductCard from "../../components/cards/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { showSuccess } from "../../utils/toast";

// GET wholesale products for proxy mode
const fetchProxyWholesale = async () => {
  const { data } = await axiosInstance.get("/products/proxy-wholesale");
  return data;
};

const ProxyWholesalePage: React.FC = () => {
  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ["proxyWholesale"],
    queryFn: fetchProxyWholesale,
  });

  const { addItem } = useWholesaleCart();

  return (
    <ProtectedRoute allowedRoles={["customer"]}>
      <div className="min-h-screen bg-slate-950 text-white">
        <Navbar />
        <WholesaleCartModal />

        <main className="max-w-6xl mx-auto p-6">
          <h1 className="text-3xl font-bold mb-6">Proxy Mode — Wholesale Market</h1>

          {isLoading && <p className="text-slate-400">Loading wholesale products…</p>}
          {isError && <p className="text-red-400">Failed to load data.</p>}

          {!isLoading && products.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <div key={p.id} className="relative">
                  <ProductCard product={p} />

                  {/* Add-to-wholesale button */}
                  <button
                    onClick={() => {
                      addItem(p);
                      showSuccess("Item added to wholesale cart");
                    }}
                    className="w-full mt-3 bg-gradient-to-r 
                    from-emerald-600 to-green-700 px-4 py-2 rounded-xl 
                    text-sm font-semibold shadow-md hover:opacity-90 transition"
                  >
                    Buy Wholesale
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default ProxyWholesalePage;
