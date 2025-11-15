import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import type {
  Product,
  ProductCreate,
  ProductCategory,
} from "../../../types/products";
import { ProductCategoryLabels } from "../../../types/products";
import Navbar from "../../components/layout/Navbar";
import CartModal from "../../components/cart/CartModal";
import { showError, showSuccess } from "../../utils/toast";
import ProtectedRoute from "../../routes/ProtectedRoute";

const fetchWholesaleProducts = async (): Promise<Product[]> => {
  const { data } = await axiosInstance.get("/products/my-products");
  return data;
};

const addProductApi = async (product: ProductCreate) => {
  const productData = {
    ...product,
    product_type: "wholesale",
    description: ProductCategoryLabels[product.category] || "No description",
  };

  const { data } = await axiosInstance.post("/products/", productData);
  return data;
};

const categoryColors: Record<string, string> = {
  fruits: "bg-green-700/30 text-green-300 border-green-800/50",
  vegetables: "bg-lime-700/30 text-lime-300 border-lime-800/50",
  dairy: "bg-yellow-700/30 text-yellow-300 border-yellow-800/50",
  meat: "bg-red-700/30 text-red-300 border-red-800/50",
  grains: "bg-orange-700/30 text-orange-300 border-orange-800/50",
};

const WholesalerProductsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState<ProductCreate>({
    name: "",
    price: 0,
    stock: 0,
    category: "fruits",
    delivery_time: 1,
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
      setForm({
        name: "",
        price: 0,
        stock: 0,
        category: "fruits",
        delivery_time: 1,
      });
      queryClient.invalidateQueries(["wholesaleProducts"]);
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
            <h1 className="text-3xl font-semibold tracking-wide">
              My Wholesale Products
            </h1>

            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 rounded-lg bg-blue-700/60 hover:bg-blue-700 transition font-medium shadow-md"
            >
              + Add Product
            </button>
          </div>

          {/* TABLE */}
          <div className="glass-card p-5 rounded-2xl">
            {isLoading ? (
              <p className="text-slate-400">Loading products...</p>
            ) : myProducts.length === 0 ? (
              <p className="text-slate-400">No wholesale products yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-800">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-sm text-slate-300">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-sm text-slate-300">
                        Category
                      </th>
                      <th className="px-4 py-3 text-right text-sm text-slate-300">
                        Price (₹)
                      </th>
                      <th className="px-4 py-3 text-right text-sm text-slate-300">
                        Stock
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-800">
                    {myProducts.map((p) => (
                      <tr
                        key={p.id}
                        className="hover:bg-slate-900/40 transition"
                      >
                        <td className="px-4 py-3 text-sm font-medium">
                          {p.name}
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 text-xs rounded-full border ${
                              categoryColors[p.category] ??
                              "bg-slate-700/40 text-slate-300 border-slate-600"
                            }`}
                          >
                            {ProductCategoryLabels[p.category]}
                          </span>
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

          {/* MODAL */}
          {showModal && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
              <div className="glass-card p-6 w-full max-w-md rounded-2xl shadow-xl">
                <h2 className="text-xl font-semibold mb-4">
                  Add New Wholesale Product
                </h2>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    mutation.mutate(form);
                  }}
                  className="flex flex-col gap-4"
                >
                  {/* NAME */}
                  <input
                    type="text"
                    placeholder="Product name"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-600"
                    required
                  />

                  {/* CATEGORY */}
                  <select
                    value={form.category}
                    onChange={(e) => {
                      const newCat = e.target.value as ProductCategory;
                      setForm({
                        ...form,
                        category: newCat,
                        delivery_time: newCat === "fruits" ? 1 : 3,
                      });
                    }}
                    className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-600"
                  >
                    {(Object.entries(
                      ProductCategoryLabels
                    ) as [ProductCategory, string][]).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>

                  {/* PRICE */}
                  <input
                    type="number"
                    placeholder="Price"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: Number(e.target.value) })
                    }
                    className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-600"
                    required
                  />

                  {/* STOCK */}
                  <input
                    type="number"
                    placeholder="Stock"
                    value={form.stock}
                    onChange={(e) =>
                      setForm({ ...form, stock: Number(e.target.value) })
                    }
                    className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-600"
                    required
                  />

                  {/* DELIVERY TIME */}
                  <select
                    value={form.delivery_time}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        delivery_time: Number(e.target.value),
                      })
                    }
                    className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-600"
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                      <option value={d} key={d}>
                        {d} {d === 1 ? "day" : "days"}
                      </option>
                    ))}
                  </select>

                  <div className="flex justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-blue-700/70 hover:bg-blue-700 transition"
                    >
                      Save Product
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
