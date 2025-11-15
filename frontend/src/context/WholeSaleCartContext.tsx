import React, { createContext, useContext, useState, useMemo } from "react";
import type { Product } from "../api/products";

type WholesaleCartItem = Product & { quantity: number };

type WholesaleCartCtx = {
  items: WholesaleCartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
};

const WholesaleCartContext = createContext<WholesaleCartCtx | undefined>(undefined);

export const WholesaleCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<WholesaleCartItem[]>([]);

  const addItem = (product: Product) => {
    setItems((prev) => {
      // Check for existing item with same ID or same name
      const existing = prev.find((i) => i.id === product.id || i.name === product.name);
      if (existing) {
        return prev.map((i) =>
          (i.id === product.id || i.name === product.name)
            ? { 
                ...i, 
                quantity: i.quantity + 1,
                // Preserve the original ID if we matched by name
                ...(i.id !== product.id && product.id && { id: product.id })
              } 
            : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeItem = (productId: number) => {
    setItems((prev) => prev.filter((i) => i.id !== productId));
  };

  const clearCart = () => setItems([]);

  const value = useMemo(() => ({ items, addItem, removeItem, clearCart }), [items]);

  return (
    <WholesaleCartContext.Provider value={value}>
      {children}
    </WholesaleCartContext.Provider>
  );
};

export const useWholesaleCart = () => {
  const ctx = useContext(WholesaleCartContext);
  if (!ctx) throw new Error("useWholesaleCart must be inside WholesaleCartProvider");
  return ctx;
};
