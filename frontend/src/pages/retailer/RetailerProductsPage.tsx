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
import ProtectedRoute from "../../routes/ProtectedRoute";

import { showSuccess, showError } from "../../utils/toast";

/* -------------------------------------------
   Template Images Stored in Frontend (Static)
-------------------------------------------- */
const templateImages = [
  { label: "Apple", path: "/product-images/apple.webp" },
  { label: "Children", path: "/product-images/children.webp" },
  { label: "Laptop", path: "/product-images/laptop.webp" },
  { label: "Shoe", path: "/product-images/shoe.webp" },
];

/* -------------------------------------------
   Cities list (same as Register Page)
-------------------------------------------- */
const Cities = [
  "Delhi",
  "Mumbai",
  "Bengaluru",
  "Chennai",
  "Hyderabad",
  "Kolkata",
  "Pune",
  "Ahmedabad",
];

/* -------------------------------------------
   API: Fetch Retailer's Own Products
-------------------------------------------- */
const fetchMyProducts = async (): Promise<Product[]> => {
  const { data } = await axiosInstance.get("/products/my-products");
  return data;
};

/* -------------------------------------------
   API: Add a New Product
-------------------------------------------- */
const addProductApi = async (product: ProductCreate) => {
  const payload = {
    ...product,
    product_type: "retail",
    description:
      ProductCategoryLabels[product.category] ||
      "Retail product description",
  };

  const { data } = await axiosInstance.post("/products/", payload);
  return data;
};

/* -------------------------------------------
   Component
-------------------------------------------- */
const RetailerProductsPage: React.FC = () => {
  const queryClient = useQueryClient();

  const [showModal, setShowModal] = useState(false);

  // ⭐ ADD "city" to initial form state
  const [form, setForm] = useState<ProductCreate>({
    name: "",
    price: 0,
    stock: 0,
    category: "fruits",
    delivery_time: 1,
    image_url: "",
    description: "",
    city: "",   // ⭐ NEW
  });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["myProducts"],
    queryFn: fetchMyProducts,
  });

  /* -------------------------------------------
     Mutation: Add Product
  -------------------------------------------- */
  const mutation = useMutation({
    mutationFn: addProductApi,
    onSuccess: () => {
      showSuccess("Product added successfully!");

      // Reset form after success
      setForm({
        name: "",
        price: 0,
        stock: 0,
        category: "fruits",
        delivery_time: 1,
        image_url: "",
        description: "",
        city: "",
      });

      setShowModal(false);
      queryClient.invalidateQueries(["myProducts"]);
    },
    onError: () => showError("Could not add product"),
  });

  const myProducts = products.filter((p) => p.product_type === "retail");

  /* -------------------------------------------
     UI Rendering
  -------------------------------------------- */
  return (
    <ProtectedRoute allowedRoles={["retailer"]}>
      <div className="min-h-screen bg-slate-950 text-white">
        <Navbar />
        <CartModal />

        <main className="max-w-6xl mx-auto p-6">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold tracking-wide">My Products</h1>

            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 rounded-xl bg-blue-700/50 backdrop-blur-md hover:bg-blue-700/70 transition text-white shadow-lg"
            >
              + Add Product
            </button>
          </div>

          {/* Product List */}
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
                      {[
                        "ID",
                        "Name",
                        "Category",
                        "Price",
                        "Stock",
                        "City",
                        "Type",
                      ].map((head) => (
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
                      <tr key={p.id} className="hover:bg-slate-900/40 transition">
                        <td className="px-4 py-3 text-sm">{p.id}</td>
                        <td className="px-4 py-3 text-sm font-medium">{p.name}</td>
                        <td className="px-4 py-3 text-sm">
                          {ProductCategoryLabels[p.category]}
                        </td>
                        <td className="px-4 py-3 text-sm">₹{p.price}</td>
                        <td className="px-4 py-3 text-sm">{p.stock}</td>
                        <td className="px-4 py-3 text-sm">{p.city}</td>
                        <td className="px-4 py-3 text-sm">{p.product_type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Add Product Modal */}
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
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className="input bg-slate-900 border border-slate-700 text-white"
                    required
                  />

                  <textarea
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    className="input bg-slate-900 border border-slate-700 text-white"
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

                  {/* ⭐ NEW CITY DROPDOWN */}
                  <select
                    value={form.city}
                    onChange={(e) =>
                      setForm({ ...form, city: e.target.value })
                    }
                    className="input bg-slate-900 border border-slate-700 text-white"
                    required
                  >
                    <option value="" disabled>Select Product City</option>
                    {Cities.map((c) => (
                      <option key={c} value={c} className="bg-slate-900">
                        {c}
                      </option>
                    ))}
                  </select>

                  <select
                    value={form.delivery_time}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        delivery_time: parseInt(e.target.value),
                      })
                    }
                    className="input bg-slate-900 border border-slate-700 text-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                      <option key={d} value={d}>
                        {d} {d === 1 ? "day" : "days"}
                      </option>
                    ))}
                  </select>

                  {/* Template Image Picker */}
                  <select
                    value={form.image_url}
                    onChange={(e) =>
                      setForm({ ...form, image_url: e.target.value })
                    }
                    className="input bg-slate-900 border border-slate-700 text-white"
                  >
                    <option value="">Choose an image</option>
                    {templateImages.map((img) => (
                      <option key={img.path} value={img.path}>
                        {img.label}
                      </option>
                    ))}
                  </select>

                  {/* Preview */}
                  {form.image_url && (
                    <img
                      src={form.image_url}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border border-slate-600 mx-auto"
                    />
                  )}

                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 rounded-lg bg-slate-800/70 hover:bg-slate-800"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-blue-700/70 hover:bg-blue-700 text-white"
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
