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
          <h1 className="text-3xl font-semibold mb-6 tracking-wide">
            My Wholesale Purchases
          </h1>

          <div className="glass-card p-6 rounded-2xl">
            {isLoading ? (
              <div className="text-slate-400">Loading wholesale orders...</div>
            ) : data.length === 0 ? (
              <div className="text-slate-400">No wholesale purchases found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full rounded-xl overflow-hidden">
                  <thead>
                    <tr className="bg-slate-900/60 border-b border-slate-700">
                      {["Order ID", "Product", "Qty", "Total (₹)", "Status", "Date"].map(
                        (head) => (
                          <th
                            key={head}
                            className="px-4 py-3 text-left text-sm text-slate-300"
                          >
                            {head}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-800">
                    {data.map((o: any) => (
                      <tr
                        key={o.id}
                        className="hover:bg-slate-900/40 transition"
                      >
                        <td className="px-4 py-3 text-sm">{o.id}</td>
                        <td className="px-4 py-3 text-sm font-medium">
                          {o.product_name}
                        </td>
                        <td className="px-4 py-3 text-sm">{o.quantity}</td>
                        <td className="px-4 py-3 text-sm">₹{o.total_price}</td>
                        <td className="px-4 py-3 text-sm">{o.status}</td>
                        <td className="px-4 py-3 text-sm">
                          {new Date(o.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default RetailerWholesaleOrdersPage;
