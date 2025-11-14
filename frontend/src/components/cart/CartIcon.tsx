// src/components/cart/CartIcon.tsx
import React from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../../context/CartContext";

const CartIcon: React.FC = () => {
  const { totalItems } = useCart();

  return (
    <div className="relative cursor-pointer hover:scale-105 transition">
      <ShoppingCart className="w-6 h-6 text-slate-300" />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-indigo-600 text-xs rounded-full px-1.5 py-0.5">
          {totalItems}
        </span>
      )}
    </div>
  );
};

export default CartIcon;
