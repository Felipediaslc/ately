"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useCallback,
  useEffect,
} from "react";

import type { CartItem } from "@/app/types/cart";
import {
  saveCartToLocalStorage,
  getCartFromLocalStorage,
  clearCartFromLocalStorage,
} from "@/app/utils/localStorageHelpers";

// =============================
// CONTEXT TYPE
// =============================
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  updateQuantity: (id: string, quantity: number) => void;
  total: number;
  syncWithBackend: (userId: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FALLBACK_IMAGE = "/image/logo.jpeg";

// =============================
// PROVIDER
// =============================
export const CartProvider = ({ children }: { children: ReactNode }) => {
  // =============================
  // NORMALIZER
  // =============================
  const normalizeItem = useCallback(
    (item: Partial<CartItem>): CartItem | null => {
      const id = item.productId;

      if (!id || !item.title || typeof item.price !== "number") return null;

      const image =
        typeof item.image === "string" && item.image.trim() !== ""
          ? item.image
          : Array.isArray(item.images) && item.images.length > 0
          ? item.images[0]
          : FALLBACK_IMAGE;

      return {
        productId: id,
        title: item.title,
        price: item.price,
        quantity: item.quantity ?? 1,
        image,
        images: Array.isArray(item.images) ? item.images : [],
        sku: item.sku,
        pixPrice: item.pixPrice,
        installment: item.installment,
      };
    },
    []
  );

  // =============================
  // STATE (SSR SAFE)
  // =============================
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];

    const stored = getCartFromLocalStorage();

    return stored
      .map((item: Partial<CartItem>) => normalizeItem(item))
      .filter((item): item is CartItem => item !== null);
  });

  // =============================
  // PERSISTÊNCIA (ÚNICO E LIMPO)
  // =============================
  useEffect(() => {
    if (typeof window === "undefined") return;

    const timeout = setTimeout(() => {
      saveCartToLocalStorage(cartItems);
    }, 200);

    return () => clearTimeout(timeout);
  }, [cartItems]);

  // =============================
  // ACTIONS
  // =============================
  const addToCart = (item: Omit<CartItem, "quantity">, quantity = 1) => {
    const normalized = normalizeItem({ ...item, quantity });
    if (!normalized) return;

    setCartItems((prev) => {
      const exists = prev.find(
        (i) => i.productId === normalized.productId
      );

      if (exists) {
        return prev.map((i) =>
          i.productId === normalized.productId
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }

      return [...prev, normalized];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.productId !== id));
  };

  const clearCart = () => {
    setCartItems([]);
    clearCartFromLocalStorage();
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCartItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.productId !== id);
      }

      return prev.map((item) =>
        item.productId === id ? { ...item, quantity } : item
      );
    });
  };

  // =============================
  // TOTAL
  // =============================
  const total = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }, [cartItems]);

  // =============================
  // BACKEND SYNC
  // =============================
  const syncWithBackend = async () => {
    try {
      const backendCart: CartItem[] = [];

      setCartItems((prev) => {
        const map = new Map<string, CartItem>();

        [...prev, ...backendCart].forEach((item) => {
          const existing = map.get(item.productId);

          if (existing) {
            map.set(item.productId, {
              ...existing,
              quantity: existing.quantity + item.quantity,
            });
          } else {
            map.set(item.productId, item);
          }
        });

        const merged = Array.from(map.values());
        saveCartToLocalStorage(merged);

        return merged;
      });
    } catch (err) {
      console.error("Erro sync carrinho:", err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        total,
        syncWithBackend,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// =============================
// HOOK
// =============================
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};