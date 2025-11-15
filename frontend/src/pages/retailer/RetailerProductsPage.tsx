// src/pages/retailer/RetailerProductsPage.tsx
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
    product_type: 'retail',
    description: ProductCategoryLabels[product.category] || 'No description' // Add description based on category
  };
  try {
    const { data } = await axiosInstance.post("/products/", productData);
    return data;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

const RetailerProductsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<ProductCreate>({
    name: "",
    price: 0,
    stock: 0,
    category: 'fruits',
    delivery_time: 1 // Default to 1 day for fruits
  });

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["myProducts"],
    queryFn: fetchMyProducts,
  });

  const mutation = useMutation({
    mutationFn: addProductApi,
    onSuccess: () => {
      showSuccess("Product added successfully!");
      setShowModal(false);
      setForm({ name: "", price: 0, stock: 0, category: 'fruits', delivery_time: 1 }); // Reset to default values
      queryClient.invalidateQueries({ queryKey: ["myProducts"] });
    },
    onError: () => showError("Failed to add product"),
  });

  const myProducts = products.filter((p) => p.product_type === "retail"); // just retailer items

  return (
    <ProtectedRoute allowedRoles={["retailer"]}>
      <div className="min-h-screen bg-slate-950 text-white">
        <Navbar />
        <CartModal />
        <main className="max-w-6xl mx-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">My Products</h1>
            <button
              onClick={() => setShowModal(true)}
              className="btn glass-card px-3 py-2"
            >
              + Add Product
            </button>
          </div>

          <div className="glass-card p-4">
            {isLoading ? (
              <div className="text-slate-400">Loading products...</div>
            ) : myProducts.length === 0 ? (
              <div className="text-slate-400">No products yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-sm text-slate-300">#</th>
                      <th className="px-4 py-2 text-left text-sm text-slate-300">Name</th>
                      <th className="px-4 py-2 text-left text-sm text-slate-300">
                        Category
                      </th>
                      <th className="px-4 py-2 text-right text-sm text-slate-300">
                        Price
                      </th>
                      <th className="px-4 py-2 text-right text-sm text-slate-300">
                        Stock
                      </th>
                      <th className="px-4 py-2 text-left text-sm text-slate-300">
                        Type
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {myProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-900/40">
                        <td className="px-4 py-3 text-sm">{p.id}</td>
                        <td className="px-4 py-3 text-sm font-medium">{p.name}</td>
                        <td className="px-4 py-3 text-sm text-slate-300">
                          {ProductCategoryLabels[p.category]}
                        </td>
                        <td className="px-4 py-3 text-right text-sm">₹{p.price}</td>
                        <td className="px-4 py-3 text-right text-sm">{p.stock}</td>
                        <td className="px-4 py-3 text-sm">{p.product_type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* --- Add Product Modal --- */}
          {showModal && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
              <div className="glass-card p-6 w-full max-w-md rounded-2xl">
                <h2 className="text-lg font-semibold mb-4">Add New Product</h2>
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
                  <select
                    value={form.category}
                    onChange={(e) => {
                      const newCategory = e.target.value as ProductCategory;
                      setForm({ 
                        ...form, 
                        category: newCategory,
                        delivery_time: newCategory === 'fruits' ? 1 : 3
                      });
                    }}
                    className="input bg-black text-white border border-gray-600 rounded p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    style={{ backgroundColor: 'black' }}
                  >
                    {(Object.entries(ProductCategoryLabels) as [ProductCategory, string][]).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
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
                  <select
                    value={form.delivery_time}
                    onChange={(e) =>
                      setForm({ ...form, delivery_time: parseInt(e.target.value) })
                    }
                    className="input bg-black text-white border border-gray-600 rounded p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{ backgroundColor: 'black' }}
                    required
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map((days) => (
                      <option key={days} value={days}>
                        {days} {days === 1 ? 'day' : 'days'} delivery
                      </option>
                    ))}
                  </select>

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

export default RetailerProductsPage;
