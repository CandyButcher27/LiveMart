// src/pages/customer/MyOrdersPage.tsx

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCustomerOrders } from "../../api/orders";
import OrderCard from "../../components/cards/OrderCard";
import Navbar from "../../components/layout/Navbar";

export default function MyOrdersPage() {
  const { data: orders = [], isLoading, isError } = useQuery({
    queryKey: ["customerOrders"],
    queryFn: fetchCustomerOrders,
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-10">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-wide">
            My Orders
          </h1>
          <p className="text-slate-400 mt-1">
            View all your past and ongoing orders
          </p>
        </div>

        {/* LOADING */}
        {isLoading && (
          <p className="text-center text-slate-400 mt-14 text-lg">
            Loading your orders…
          </p>
        )}

        {/* ERROR */}
        {isError && (
          <p className="text-center text-red-400 mt-14 text-lg">
            Failed to load orders. Please try again.
          </p>
        )}

        {/* EMPTY STATE */}
        {!isLoading && !isError && orders.length === 0 && (
          <div className="flex flex-col items-center mt-20">
            <div className="glass-card p-10 rounded-3xl text-center max-w-md">
              <p className="text-xl font-semibold mb-2">No Orders Yet</p>
              <p className="text-slate-400 text-sm mb-6">
                You haven’t placed any orders yet.
              </p>
              <a
                href="/customer"
                className="bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2 rounded-xl font-semibold hover:opacity-90 transition"
              >
                Start Shopping
              </a>
            </div>
          </div>
        )}

        {/* ORDER GRID */}
        {!isLoading && !isError && orders.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {orders.map((o) => (
              <OrderCard key={o.id} order={o} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
