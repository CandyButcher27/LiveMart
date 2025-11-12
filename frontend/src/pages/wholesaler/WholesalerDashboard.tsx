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
        <h1 className="text-2xl font-semibold mb-6">Wholesaler Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* My Products */}
          <div className="glass-card p-4 flex flex-col gap-4">
            <div>My Wholesale Listings</div>
            <Link
              to="/wholesaler/products"
              className="btn glass-card px-3 py-2 text-sm text-center"
            >
              Manage Products
            </Link>
          </div>

          {/* Incoming Orders */}
          <div className="glass-card p-4 flex flex-col gap-4">
            <div>Incoming Orders</div>
            <Link
              to="/wholesaler/orders"
              className="btn glass-card px-3 py-2 text-sm text-center"
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
