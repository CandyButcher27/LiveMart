// src/components/cards/OrderCard.tsx
import type { Order } from "../../../types/orders";

const statusColor = (status: string) => {
  switch (status) {
    case "pending": return "bg-yellow-500/20 text-yellow-300";
    case "completed": return "bg-green-500/20 text-green-300";
    case "cancelled": return "bg-red-500/20 text-red-300";
    default: return "bg-slate-700 text-slate-300";
  }
};

export default function OrderCard({ order }: { order: Order }) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-md hover:scale-[1.01] transition">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-white">{order.product_name}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(order.status)}`}>
          {order.status}
        </span>
      </div>
      <p className="text-slate-400 text-sm mt-2">
        Qty {order.quantity} · ₹{order.total_price.toFixed(2)}
      </p>
      <div className="flex justify-between items-center mt-2">
        <p className="text-slate-500 text-xs">
          {new Date(order.created_at).toLocaleString()}
        </p>
        <p className="text-blue-400 text-xs font-medium">
          🚚 {order.category === 'electronics' ? '3-7' : (order.delivery_time || 1)} {order.category === 'electronics' ? 'days' : (order.delivery_time === 1 ? 'day' : 'days')} delivery
        </p>
      </div>
    </div>
  );
}
