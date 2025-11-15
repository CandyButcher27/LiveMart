import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchRetailerOrders, updateOrderStatus } from "../../api/orders";
import { showError, showSuccess } from "../../utils/toast";
import Navbar from "../../components/layout/Navbar";
import ProtectedRoute from "../../routes/ProtectedRoute";

function formatDate(iso?: string) {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleString();
}

const RetailerOrdersPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading, isError } = useQuery({
    queryKey: ["retailerOrders"],
    queryFn: fetchRetailerOrders,
    onError: () => showError("Failed to fetch orders"),
  });

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      showSuccess("Order status updated!");
      queryClient.invalidateQueries(["retailerOrders"]); // refresh table
    } catch (err) {
      showError("Failed to update status");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["retailer"]}>
      <div className="min-h-screen bg-slate-950 text-white">
        <Navbar />
        <main className="max-w-6xl mx-auto p-6">
          <h1 className="text-2xl font-semibold mb-6">Orders for Your Products</h1>

          <div className="glass-card p-4">
            {isLoading ? (
              <div className="py-8 text-slate-400">Loading orders...</div>
            ) : isError ? (
              <div className="py-8 text-red-400">Failed to load orders.</div>
            ) : orders.length === 0 ? (
              <div className="py-8 text-slate-400">No orders found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-sm text-slate-300">Order ID</th>
                      <th className="px-4 py-2 text-left text-sm text-slate-300">Product ID</th>
                      <th className="px-4 py-2 text-left text-sm text-slate-300">Customer ID</th>
                      <th className="px-4 py-2 text-right text-sm text-slate-300">Quantity</th>
                      <th className="px-4 py-2 text-right text-sm text-slate-300">Total (₹)</th>
                      <th className="px-4 py-2 text-left text-sm text-slate-300">Status</th>
                      <th className="px-4 py-2 text-left text-sm text-slate-300">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-900/40">
                        <td className="px-4 py-3 text-sm">{o.id}</td>
                        <td className="px-4 py-3 text-sm">{o.product_id}</td>
                        <td className="px-4 py-3 text-sm">{o.customer_id}</td>
                        <td className="px-4 py-3 text-right text-sm">{o.quantity}</td>
                        <td className="px-4 py-3 text-right text-sm">₹{o.total_price}</td>

                        {/* ⭐ STATUS DROPDOWN */}
                        <td className="px-4 py-3 text-sm">
                          <select
                            value={o.status}
                            onChange={(e) => handleStatusChange(o.id, e.target.value)}
                            className="bg-slate-800 border border-slate-700 text-white px-2 py-1 rounded"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>

                        <td className="px-4 py-3 text-sm">{formatDate(o.created_at)}</td>
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

export default RetailerOrdersPage;
