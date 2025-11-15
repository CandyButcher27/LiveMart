import React from "react";
import Navbar from "../../components/layout/Navbar";
import CartModal from "../../components/cart/CartModal";
import { Link } from "react-router-dom";

const RetailerDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <CartModal />

      <main className="max-w-6xl mx-auto p-6 text-white">
        <h1 className="text-2xl font-semibold mb-6">Retailer Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* My Products */}
          <div className="glass-card p-4 flex flex-col gap-4">
            <div className="text-lg font-medium">My Products</div>
            <Link
              to="/retailer/products"
              className="btn glass-card px-3 py-2 text-sm text-center"
            >
              Manage My Products
            </Link>
          </div>

          {/* Customer Orders */}
          <div className="glass-card p-4 flex flex-col gap-4">
            <div className="text-lg font-medium">Customer Orders</div>
            <Link
              to="/retailer/orders"
              className="btn glass-card px-3 py-2 text-sm text-center"
            >
              View Orders
            </Link>
          </div>

          {/* Wholesale Purchases */}
          <div className="glass-card p-4 flex flex-col gap-4">
            <div className="text-lg font-medium">My Wholesale Purchases</div>
            <Link
              to="/retailer/wholesale-orders"
              className="btn glass-card px-3 py-2 text-sm text-center"
            >
              View Wholesale Orders
            </Link>
          </div>

          {/* Explore Wholesale */}
          <div className="glass-card p-4 flex flex-col gap-4">
            <div className="text-lg font-medium">Buy from Wholesalers</div>
            <Link
              to="/retailer/buy-wholesale"
              className="btn glass-card px-3 py-2 text-sm text-center"
            >
              Explore Wholesale
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
};

export default RetailerDashboard;
