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

const statusColors: Record<string, string> = {
  Pending: "bg-yellow-700/40 text-yellow-300",
  Shipped: "bg-blue-700/40 text-blue-300",
  Delivered: "bg-green-700/40 text-green-300",
  Cancelled: "bg-red-700/40 text-red-300",
};

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
      queryClient.invalidateQueries(["retailerOrders"]);
    } catch (err) {
      showError("Failed to update status");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["retailer"]}>
      <div className="min-h-screen bg-slate-950 text-white">
        <Navbar />

        <main className="max-w-6xl mx-auto p-6">
          <h1 className="text-3xl font-bold mb-6 tracking-wide">
            Customer Orders
          </h1>

          <div className="glass-card p-6 rounded-2xl">
            {isLoading ? (
              <p className="py-6 text-slate-400 text-center">
                Loading orders…
              </p>
            ) : isError ? (
              <p className="py-6 text-red-400 text-center">
                Failed to load orders.
              </p>
            ) : orders.length === 0 ? (
              <p className="py-6 text-slate-400 text-center">
                No orders found.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full rounded-xl overflow-hidden">
                  
                  <thead>
                    <tr className="bg-slate-900/60 border-b border-slate-700">
                      {[
                        "Order ID",
                        "Product ID",
                        "Customer ID",
                        "Qty",
                        "Total (₹)",
                        "Status",
                        "Date",
                      ].map((head) => (
                        <th
                          key={head}
                          className="px-4 py-3 text-left text-sm text-slate-300"
                        >
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-800">
                    {orders.map((o) => (
                      <tr
                        key={o.id}
                        className="hover:bg-slate-900/40 transition"
                      >
                        <td className="px-4 py-3 text-sm">{o.id}</td>
                        <td className="px-4 py-3 text-sm">{o.product_id}</td>
                        <td className="px-4 py-3 text-sm">{o.customer_id}</td>
                        <td className="px-4 py-3 text-sm">{o.quantity}</td>
                        <td className="px-4 py-3 text-sm">₹{o.total_price}</td>

                        {/* STATUS DROPDOWN */}
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs ${statusColors[o.status]}`}
                            >
                              {o.status}
                            </span>

                            <select
                              value={o.status}
                              onChange={(e) =>
                                handleStatusChange(o.id, e.target.value)
                              }
                              className="bg-slate-800 border border-slate-700 text-white px-2 py-1 rounded-md text-xs focus:ring-2 focus:ring-blue-600"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>
                        </td>

                        <td className="px-4 py-3 text-sm">
                          {formatDate(o.created_at)}
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

export default RetailerOrdersPage;
