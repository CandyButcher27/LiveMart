// src/pages/customer/CustomerDashboard.tsx
import React from "react";
import Navbar from "../../components/layout/Navbar";
import ProductCard from "../../components/cards/ProductCard";
import { useProducts } from "../../api/products";
import CartModal from "../../components/cart/CartModal";
import { Link } from "react-router-dom";

const CustomerDashboard: React.FC = () => {
  const { data: products = [], isLoading } = useProducts();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
        <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold mb-4">Available Products</h1>
            <Link to="/customer/orders" className="btn glass-card px-3 py-2 text-sm">
                My Orders
            </Link>
        </div>
      <Navbar />
      <CartModal />
      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Available Products</h1>

        {isLoading ? (
          <p className="text-slate-400">Loading products...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomerDashboard;
