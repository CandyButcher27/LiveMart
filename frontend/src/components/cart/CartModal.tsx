// src/components/cart/CartModal.tsx
import React, { useState } from "react";
import { X, Trash2 } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { showSuccess , showError} from "../../utils/toast";
import axiosInstance from "../../api/axiosInstance";

const CartModal: React.FC = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleCheckout = async () => {
  if (cart.length === 0) return;
  setLoading(true);

  try {
    const endpoint =
      cart[0].type === "wholesale" ? "/wholesalers/orders/" : "/orders/";

    // Send one POST per cart item
    for (const item of cart) {
      const payload = {
        product_id: item.id,
        quantity: item.quantity,
        total_price: item.price * item.quantity,
      };

      console.log("Posting order:", payload); // 🧠 debug in console

      await axiosInstance.post(endpoint, payload);
    }

    showSuccess("All items ordered successfully!");
    clearCart();
    setOpen(false);
  } catch (err: any) {
    console.error("Checkout failed:", err?.response?.data || err);
    showError("Checkout failed. Please try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-blue-700 text-white px-4 py-3 rounded-full shadow-lg hover:scale-105 transition"
      >
        🛒 View Cart
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 p-6 rounded-2xl w-full max-w-lg border border-slate-800 shadow-xl relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-semibold mb-4 text-white">Your Cart</h2>

            {cart.length === 0 ? (
              <p className="text-slate-400 text-sm">Your cart is empty.</p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-slate-800/60 p-3 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-white">{item.name}</p>
                      <p className="text-slate-400 text-sm">
                        ₹{item.price} × {item.quantity}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {cart.length > 0 && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-indigo-400 font-semibold">Total: ₹{total}</p>
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-600 to-blue-700 px-4 py-2 rounded-lg text-white font-medium hover:brightness-110 disabled:opacity-60"
                >
                  {loading ? "Placing..." : "Checkout"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CartModal;
