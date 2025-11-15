import React, { useState } from "react";
import { useWholesaleCart } from "../../context/WholeSaleCartContext";
import { showError, showSuccess } from "../../utils/toast";
import axiosInstance from "../../api/axiosInstance";

const WholesaleCartModal: React.FC = () => {
  const { items, removeItem, clearCart } = useWholesaleCart();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setLoading(true);
    try {
      for (const item of items) {
        await axiosInstance.post("/orders/wholesale", {
          product_id: item.id,
          quantity: item.quantity,
        });
      }
      showSuccess("Wholesale order placed!");
      clearCart();
      setOpen(false);
    } catch (err) {
      showError("Checkout failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-emerald-600 text-white px-4 py-2 rounded-full shadow-lg"
      >
        Wholesale Cart ({items.length})
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-xl p-6 w-96 text-white">
            <h2 className="text-xl mb-4 font-semibold">Wholesale Cart</h2>
            {items.length === 0 ? (
              <p className="text-slate-400">No items added.</p>
            ) : (
              <div className="space-y-4">
                {items.map((i) => (
                  <div key={i.id} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{i.name}</div>
                      <div className="text-sm text-slate-400">Qty: {i.quantity}</div>
                    </div>
                    <button
                      onClick={() => removeItem(i.id)}
                      className="text-red-400 hover:text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-6 flex justify-between">
              <button onClick={clearCart} className="text-slate-400 hover:text-slate-300">
                Clear
              </button>
              <button
                onClick={handleCheckout}
                disabled={loading || items.length === 0}
                className="bg-emerald-600 px-4 py-2 rounded-md hover:bg-emerald-700 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Checkout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WholesaleCartModal;
