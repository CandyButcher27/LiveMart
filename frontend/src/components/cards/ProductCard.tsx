import React from "react";
import type { Product } from "../../api/products";
import { useCart } from "../../context/CartContext";
import { showSuccess } from "../../utils/toast";

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      type: "retail",
    });
    showSuccess(`${product.name} added to cart`);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col hover:scale-[1.02] transition">
      <img
        src={product.image_url || "https://via.placeholder.com/150"}
        alt={product.name}
        className="rounded-xl mb-3 object-cover h-40 w-full"
      />
      <h3 className="text-lg font-semibold text-white">{product.name}</h3>
      <p className="text-slate-400 text-sm line-clamp-2">{product.description}</p>
      <div className="flex items-center justify-between mt-3">
        <span className="text-indigo-400 font-semibold">₹{product.price}</span>
        <button
          onClick={handleAdd}
          className="bg-gradient-to-r from-purple-600 to-blue-700 px-3 py-1 rounded-md text-sm hover:brightness-110"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
