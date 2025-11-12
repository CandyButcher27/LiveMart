import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import type { Product, ProductCreate } from "../../types/products";
import Navbar from "../../components/layout/Navbar";
import CartModal from "../../components/cart/CartModal";
import { showError, showSuccess } from "../../utils/toast";
import ProtectedRoute from "../../routes/ProtectedRoute";

const fetchWholesaleProducts = async (): Promise<Product[]> => {
  const { data } = await axiosInstance.get("/products/");
  return data;
};

const addProductApi = async (product: ProductCreate) => {
  const { data } = await axiosInstance.post("/products/", product);
  return data;
};

const WholesalerProductsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<ProductCreate>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
  });

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["wholesaleProducts"],
    queryFn: fetchWholesaleProducts,
  });

  const mutation = useMutation({
    mutationFn: addProductApi,
    onSuccess: () => {
      showSuccess("Wholesale product added!");
      setShowModal(false);
      setForm({ name: "", description: "", price: 0, stock: 0 });
      queryClient.invalidateQueries({ queryKey: ["wholesaleProducts"] });
    },
    onError: () => showError("Failed to add product"),
  });

  const myProducts = products.filter((p) => p.product_type === "wholesale");

  return (
    <ProtectedRoute allowedRoles={["wholesaler"]}>
      <div className="min-h-screen bg-slate-950 text-white">
        <Navbar />
        <CartModal />
        <main className="max-w-6xl mx-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">My Wholesale Listings</h1>
            <button
              onClick={() => setShowModal(true)}
              className="btn glass-card px-3 py-2"
            >
              + Add Product
            </button>
          </div>

          <div className="glass-card p-4">
            {isLoading ? (
              <p className="text-slate-400">Loading products...</p>
            ) : myProducts.length === 0 ? (
              <p className="text-slate-400">No wholesale products yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-sm text-slate-300">
                        Name
                      </th>
                      <th className="px-4 py-2 text-left text-sm text-slate-300">
                        Description
                      </th>
                      <th className="px-4 py-2 text-right text-sm text-slate-300">
                        Price
                      </th>
                      <th className="px-4 py-2 text-right text-sm text-slate-300">
                        Stock
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {myProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-900/40">
                        <td className="px-4 py-3 text-sm">{p.name}</td>
                        <td className="px-4 py-3 text-sm text-slate-400">
                          {p.description}
                        </td>
                        <td className="px-4 py-3 text-right text-sm">
                          ₹{p.price}
                        </td>
                        <td className="px-4 py-3 text-right text-sm">
                          {p.stock}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {showModal && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
              <div className="glass-card p-6 w-full max-w-md rounded-2xl">
                <h2 className="text-lg font-semibold mb-4">Add Wholesale Product</h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    mutation.mutate(form);
                  }}
                  className="flex flex-col gap-3"
                >
                  <input
                    type="text"
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="input"
                  />
                  <textarea
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    required
                    className="input"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: parseFloat(e.target.value) })
                    }
                    required
                    className="input"
                  />
                  <input
                    type="number"
                    placeholder="Stock"
                    value={form.stock}
                    onChange={(e) =>
                      setForm({ ...form, stock: parseInt(e.target.value) })
                    }
                    required
                    className="input"
                  />

                  <div className="flex justify-end gap-3 mt-3">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="btn glass-card px-3 py-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn glass-card px-3 py-2 bg-blue-700/60 hover:bg-blue-700"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default WholesalerProductsPage;
