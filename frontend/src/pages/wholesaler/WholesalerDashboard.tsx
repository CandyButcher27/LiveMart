// src/pages/wholesaler/WholesalerDashboard.tsx
import React from "react";
import Navbar from "../../components/layout/Navbar";
import CartModal from "../../components/cart/CartModal";
import { Link } from "react-router-dom";

const WholesalerDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <CartModal />

      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-semibold mb-6 tracking-wide">
          Wholesaler Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* My Wholesale Listings */}
          <div className="glass-card p-6 rounded-2xl flex flex-col gap-3 hover:bg-slate-900/40 transition">
            <div className="text-lg font-medium">My Wholesale Listings</div>
            <p className="text-slate-400 text-sm">
              Manage the products you are selling to retailers.
            </p>
            <Link
              to="/wholesaler/products"
              className="px-4 py-2 bg-blue-700/60 hover:bg-blue-700 rounded-lg text-center text-sm font-medium transition"
            >
              Manage Products
            </Link>
          </div>

          {/* Incoming Orders */}
          <div className="glass-card p-6 rounded-2xl flex flex-col gap-3 hover:bg-slate-900/40 transition">
            <div className="text-lg font-medium">Incoming Orders</div>
            <p className="text-slate-400 text-sm">
              Retailers who purchased your wholesale items.
            </p>
            <Link
              to="/wholesaler/orders"
              className="px-4 py-2 bg-emerald-700/60 hover:bg-emerald-700 rounded-lg text-center text-sm font-medium transition"
            >
              View Orders
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
};

export default WholesalerDashboard;
