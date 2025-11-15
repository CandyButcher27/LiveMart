import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMyWholesaleOrders } from "../../api/orders";
import Navbar from "../../components/layout/Navbar";
import ProtectedRoute from "../../routes/ProtectedRoute";

const RetailerWholesaleOrdersPage = () => {
  const { data = [], isLoading } = useQuery({
    queryKey: ["retailerWholesaleOrders"],
    queryFn: fetchMyWholesaleOrders,
  });

  return (
    <ProtectedRoute allowedRoles={["retailer"]}>
      <div className="min-h-screen bg-slate-950 text-white">
        <Navbar />

        <main className="max-w-6xl mx-auto p-6">
          <h1 className="text-2xl font-semibold mb-6">My Wholesale Purchases</h1>

          <div className="glass-card p-4">
            {isLoading ? (
              <div className="text-slate-400">Loading...</div>
            ) : data.length === 0 ? (
              <div className="text-slate-400">No wholesale purchases found.</div>
            ) : (
              <table className="min-w-full divide-y divide-slate-700">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">Order ID</th>
                    <th className="px-4 py-2 text-left">Product</th>
                    <th className="px-4 py-2 text-left">Quantity</th>
                    <th className="px-4 py-2 text-left">Total (₹)</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {data.map((o: any) => (
                    <tr key={o.id}>
                      <td className="px-4 py-3">{o.id}</td>
                      <td className="px-4 py-3">{o.product_name}</td>
                      <td className="px-4 py-3">{o.quantity}</td>
                      <td className="px-4 py-3">₹{o.total_price}</td>
                      <td className="px-4 py-3">{o.status}</td>
                      <td className="px-4 py-3">{new Date(o.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default RetailerWholesaleOrdersPage;
