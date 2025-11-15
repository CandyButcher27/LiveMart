import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import type { Product, ProductCreate, ProductCategory } from "../../../types/products";
import { ProductCategoryLabels } from "../../../types/products";
import Navbar from "../../components/layout/Navbar";
import CartModal from "../../components/cart/CartModal";
import { showError, showSuccess } from "../../utils/toast";
import ProtectedRoute from "../../routes/ProtectedRoute";

const fetchMyProducts = async (): Promise<Product[]> => {
  const { data } = await axiosInstance.get("/products/my-products");
  return data;
};

const addProductApi = async (product: ProductCreate) => {
  const productData = {
    ...product,
    product_type: "retail",
    description:
      ProductCategoryLabels[product.category] || "Retail product description",
  };

  const { data } = await axiosInstance.post("/products/", productData);
  return data;
};

const RetailerProductsPage: React.FC = () => {
  const queryClient = useQueryClient();

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<ProductCreate>({
    name: "",
    price: 0,
    stock: 0,
    category: "fruits",
    delivery_time: 1,
  });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["myProducts"],
    queryFn: fetchMyProducts,
  });

  const mutation = useMutation({
    mutationFn: addProductApi,
    onSuccess: () => {
      showSuccess("Product added!");
      setShowModal(false);
      setForm({
        name: "",
        price: 0,
        stock: 0,
        category: "fruits",
        delivery_time: 1,
      });
      queryClient.invalidateQueries(["myProducts"]);
    },
    onError: () => showError("Could not add product"),
  });

  const myProducts = products.filter((p) => p.product_type === "retail");

  return (
    <ProtectedRoute allowedRoles={["retailer"]}>
      <div className="min-h-screen bg-slate-950 text-white">
        <Navbar />
        <CartModal />

        <main className="max-w-6xl mx-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold tracking-wide">My Products</h1>

            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 rounded-xl bg-blue-700/50 backdrop-blur-md hover:bg-blue-700/70 transition text-white shadow-lg"
            >
              + Add Product
            </button>
          </div>

          <div className="glass-card p-6 rounded-2xl">
            {isLoading ? (
              <p className="text-slate-400">Loading products...</p>
            ) : myProducts.length === 0 ? (
              <p className="text-slate-400">No products found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full rounded-xl overflow-hidden">

                  <thead>
                    <tr className="bg-slate-900/60 border-b border-slate-700">
                      {["ID", "Name", "Category", "Price", "Stock", "Type"].map((head) => (
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
                    {myProducts.map((p) => (
                      <tr
                        key={p.id}
                        className="hover:bg-slate-900/40 transition"
                      >
                        <td className="px-4 py-3 text-sm">{p.id}</td>
                        <td className="px-4 py-3 text-sm font-medium">{p.name}</td>
                        <td className="px-4 py-3 text-sm">
                          {ProductCategoryLabels[p.category]}
                        </td>
                        <td className="px-4 py-3 text-sm">₹{p.price}</td>
                        <td className="px-4 py-3 text-sm">{p.stock}</td>
                        <td className="px-4 py-3 text-sm">{p.product_type}</td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            )}
          </div>

          {/* ---------------------
              ADD PRODUCT MODAL
          --------------------- */}
          {showModal && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
              
              <div className="glass-card p-6 rounded-2xl w-full max-w-md animate-fadeIn">

                <h2 className="text-xl font-bold mb-4 tracking-wide">
                  Add New Product
                </h2>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    mutation.mutate(form);
                  }}
                  className="flex flex-col gap-4"
                >
                  <input
                    type="text"
                    placeholder="Product Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input bg-slate-900 border border-slate-700 text-white"
                    required
                  />

                  <select
                    value={form.category}
                    onChange={(e) => {
                      const newCategory = e.target.value as ProductCategory;
                      setForm({
                        ...form,
                        category: newCategory,
                        delivery_time: newCategory === "fruits" ? 1 : 3,
                      });
                    }}
                    className="input bg-slate-900 border border-slate-700 text-white"
                  >
                    {Object.entries(ProductCategoryLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    placeholder="Price"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: parseFloat(e.target.value) })
                    }
                    className="input bg-slate-900 border border-slate-700 text-white"
                    required
                  />

                  <input
                    type="number"
                    placeholder="Stock"
                    value={form.stock}
                    onChange={(e) =>
                      setForm({ ...form, stock: parseInt(e.target.value) })
                    }
                    className="input bg-slate-900 border border-slate-700 text-white"
                    required
                  />

                  <select
                    value={form.delivery_time}
                    onChange={(e) =>
                      setForm({ ...form, delivery_time: parseInt(e.target.value) })
                    }
                    className="input bg-slate-900 border border-slate-700 text-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map((days) => (
                      <option key={days} value={days}>
                        {days} {days === 1 ? "day" : "days"}
                      </option>
                    ))}
                  </select>

                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 rounded-lg bg-slate-800/70 hover:bg-slate-800 transition"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-blue-700/70 hover:bg-blue-700 transition text-white"
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

export default RetailerProductsPage;
