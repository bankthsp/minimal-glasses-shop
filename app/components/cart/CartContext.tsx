// app/components/cart/CartContext.tsx
"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "../../data/products";
import { CART_ENABLED } from "../../config/shopConfig";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  totalQuantity: number;
  totalAmount: number;
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  enabled: boolean;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  function addToCart(product: Product, qty: number = 1) {
    if (!CART_ENABLED) return; // ถ้ายังไม่เปิดระบบ cart ให้ไม่ทำอะไร
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (!existing) {
        return [...prev, { product, quantity: qty }];
      }
      return prev.map((i) =>
        i.product.id === product.id
          ? { ...i, quantity: i.quantity + qty }
          : i
      );
    });
  }

  function removeFromCart(productId: string) {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }

  function clearCart() {
    setItems([]);
  }

  const totalQuantity = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const totalAmount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity * item.product.price, 0),
    [items]
  );

  const value: CartContextValue = {
    items,
    totalQuantity,
    totalAmount,
    addToCart,
    removeFromCart,
    clearCart,
    enabled: CART_ENABLED,
  };

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
