// src/pages/customer/MyOrdersPage.tsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCustomerOrders } from "../../api/orders";
import OrderCard from "../../components/cards/OrderCard";

export default function MyOrdersPage() {
  const { data: orders, isLoading, isError } = useQuery({
    queryKey: ["customerOrders"],
    queryFn: fetchCustomerOrders,
  });

  if (isLoading) return <p className="text-center text-slate-400 mt-10">Loading orders...</p>;
  if (isError) return <p className="text-center text-red-400 mt-10">Failed to load orders.</p>;

  return (
    <div className="p-6 min-h-screen bg-slate-950">
      <h1 className="text-2xl font-bold text-white mb-4">My Orders</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {orders?.length ? (
          orders.map((o) => <OrderCard key={o.id} order={o} />)
        ) : (
          <p className="text-slate-500">You haven’t placed any orders yet.</p>
        )}
      </div>
    </div>
  );
}
