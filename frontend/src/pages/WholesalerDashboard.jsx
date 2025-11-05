import { useEffect, useState } from "react";
import axios from "axios";

export default function WholesalerDashboard() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/wholesalers/orders", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err));
  }, [token]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Wholesaler Dashboard</h1>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Order ID</th>
            <th className="border px-4 py-2">Retailer</th>
            <th className="border px-4 py-2">Product</th>
            <th className="border px-4 py-2">Quantity</th>
            <th className="border px-4 py-2">Total Price</th>
            <th className="border px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td className="border px-4 py-2">{o.id}</td>
              <td className="border px-4 py-2">{o.retailer_id}</td>
              <td className="border px-4 py-2">{o.product_id}</td>
              <td className="border px-4 py-2">{o.quantity}</td>
              <td className="border px-4 py-2">₹{o.total_price}</td>
              <td className="border px-4 py-2">{o.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
