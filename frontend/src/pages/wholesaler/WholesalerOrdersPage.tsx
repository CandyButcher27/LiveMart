import React from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import Navbar from "../../components/layout/Navbar";
import CartModal from "../../components/cart/CartModal";
import { showError } from "../../utils/toast";
import ProtectedRoute from "../../routes/ProtectedRoute";
import { updateOrderStatus } from "../../api/orders";
import { useQueryClient } from "@tanstack/react-query";
import { showSuccess } from "../../utils/toast";


const fetchWholesalerOrders = async () => {
  const { data } = await axiosInstance.get("/orders/wholesaler");
  return data;
};

const WholesalerOrdersPage: React.FC = () => {
  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ["wholesalerOrders"],
    queryFn: fetchWholesalerOrders,
  });

  if (error) showError("Failed to fetch orders");

  return (
    <ProtectedRoute allowedRoles={["wholesaler"]}>
      <div className="min-h-screen bg-slate-950 text-white">
        <Navbar />
        <CartModal />
        <main className="max-w-6xl mx-auto p-6">
          <h1 className="text-2xl font-semibold mb-6">Incoming Orders</h1>

          <div className="glass-card p-4">
            {isLoading ? (
              <p className="text-slate-400">Loading...</p>
            ) : orders.length === 0 ? (
              <p className="text-slate-400">No incoming orders yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-sm text-slate-300">
                        Order ID
                      </th>
                      <th className="px-4 py-2 text-left text-sm text-slate-300">
                        Product
                      </th>
                      <th className="px-4 py-2 text-right text-sm text-slate-300">
                        Quantity
                      </th>
                      <th className="px-4 py-2 text-right text-sm text-slate-300">
                        Total Price
                      </th>
                      <th className="px-4 py-2 text-left text-sm text-slate-300">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {orders.map((o: any) => (
                      <tr key={o.id} className="hover:bg-slate-900/40">
                        <td className="px-4 py-3 text-sm">{o.id}</td>
                        <td className="px-4 py-3 text-sm">{o.product_id}</td>
                        <td className="px-4 py-3 text-right text-sm">{o.quantity}</td>
                        <td className="px-4 py-3 text-right text-sm">
                          ₹{o.total_price}
                        </td>
                        <td className="px-4 py-3 text-sm">{o.status}</td>
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
