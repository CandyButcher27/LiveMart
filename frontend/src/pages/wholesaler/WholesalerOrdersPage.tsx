import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import Navbar from "../../components/layout/Navbar";
import CartModal from "../../components/cart/CartModal";
import ProtectedRoute from "../../routes/ProtectedRoute";
import { showError, showSuccess } from "../../utils/toast";
import { updateOrderStatus } from "../../api/orders";

const fetchWholesalerOrders = async () => {
  const { data } = await axiosInstance.get("/orders/wholesaler");
  return data;
};

const statusColors: Record<string, string> = {
  Pending: "bg-yellow-700/40 text-yellow-300",
  Shipped: "bg-blue-700/40 text-blue-300",
  Delivered: "bg-emerald-700/40 text-emerald-300",
  Cancelled: "bg-red-700/40 text-red-300",
};

const WholesalerOrdersPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ["wholesalerOrders"],
    queryFn: fetchWholesalerOrders,
  });

  if (error) showError("Failed to fetch orders");

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateOrderStatus(id, status);
      showSuccess("Order status updated!");
      queryClient.invalidateQueries(["wholesalerOrders"]);
    } catch (e) {
      showError("Failed to update status");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["wholesaler"]}>
      <div className="min-h-screen bg-slate-950 text-white">
        <Navbar />
        <CartModal />

        <main className="max-w-6xl mx-auto p-6">
          <h1 className="text-3xl font-semibold mb-6 tracking-wide">
            Incoming Orders
          </h1>

          <div className="glass-card p-5 rounded-2xl">
            {isLoading ? (
              <div className="py-10 text-center text-slate-400">
                Loading orders...
              </div>
            ) : orders.length === 0 ? (
              <div className="py-10 text-center text-slate-400">
                No incoming orders yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-800">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-sm text-slate-300">
                        Order ID
                      </th>
                      <th className="px-4 py-3 text-left text-sm text-slate-300">
                        Product
                      </th>
                      <th className="px-4 py-3 text-right text-sm text-slate-300">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-right text-sm text-slate-300">
                        Total (₹)
                      </th>
                      <th className="px-4 py-3 text-left text-sm text-slate-300">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-sm text-slate-300">
                        Date
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-800">
                    {orders.map((o: any) => (
                      <tr
                        key={o.id}
                        className="hover:bg-slate-900/40 transition"
                      >
                        <td className="px-4 py-3 text-sm">{o.id}</td>

                        <td className="px-4 py-3 text-sm font-medium">
                          {o.product_name ?? o.product_id}
                        </td>

                        <td className="px-4 py-3 text-right text-sm">
                          {o.quantity}
                        </td>

                        <td className="px-4 py-3 text-right text-sm">
                          ₹{o.total_price}
                        </td>

                        {/* STATUS BADGE */}
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs ${
                              statusColors[o.status] ??
                              "bg-slate-700/40 text-slate-300"
                            }`}
                          >
                            {o.status}
                          </span>
                        </td>

                        {/* DATE */}
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

export default WholesalerOrdersPage;
