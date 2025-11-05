import { useEffect, useState } from "react";
import { getMyOrders } from "../utils/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await getMyOrders(token);
      setOrders(res.data);
    };
    fetchOrders();
  }, [token]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">My Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Order ID</th>
              <th className="border px-4 py-2">Product ID</th>
              <th className="border px-4 py-2">Quantity</th>
              <th className="border px-4 py-2">Total Price</th>
              <th className="border px-4 py-2">Payment</th>
              <th className="border px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="border px-4 py-2">{o.id}</td>
                <td className="border px-4 py-2">{o.product_id}</td>
                <td className="border px-4 py-2">{o.quantity}</td>
                <td className="border px-4 py-2">₹{o.total_price}</td>
                <td className="border px-4 py-2">{o.payment_mode}</td>
                <td className="border px-4 py-2">{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
