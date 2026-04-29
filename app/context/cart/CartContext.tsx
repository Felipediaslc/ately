"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
  useMemo,
} from "react";

import type { CartItem } from "@/app/types/cart";
import {
  saveCartToLocalStorage,
  getCartFromLocalStorage,
  clearCartFromLocalStorage,
} from "@/app/utils/localStorageHelpers";

// =============================
// TYPES
// =============================
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  updateQuantity: (id: string, quantity: number) => void;
  total: number;
  isLoaded: boolean;
  syncWithBackend: (userId: string) => Promise<void>;
}

// =============================
// CONTEXT
// =============================
const CartContext = createContext<CartContextType | undefined>(undefined);

// =============================
// PROVIDER
// =============================
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // =============================
  // LOAD (SSR SAFE)
  // =============================
 useEffect(() => {
  const load = () => {
    const stored = getCartFromLocalStorage();
    setCartItems(stored);
    setIsLoaded(true);
  };

  const id = setTimeout(load, 0);

  return () => clearTimeout(id);
}, []);

  // =============================
  // SAVE (DEBOUNCE)
  // =============================
  useEffect(() => {
    if (!isLoaded) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      saveCartToLocalStorage(cartItems);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [cartItems, isLoaded]);

  // =============================
  // ACTIONS
  // =============================
  const addToCart = (
    item: Omit<CartItem, "quantity">,
    quantity: number = 1
  ) => {
    if (quantity <= 0) return;

    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);

      if (existing) {
        return prev.map((i) =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }

      return [...prev, { ...item, quantity }];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
    clearCartFromLocalStorage();
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCartItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.id !== id);
      }

      return prev.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );
    });
  };

  // =============================
  // DERIVED STATE
  // =============================
  const total = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }, [cartItems]);

  // =============================
  // BACKEND SYNC (SAFE FUTURE)
  // =============================
  const syncWithBackend = async (userId: string) => {
    try {
      // 🔹 Exemplo futuro:
      // const res = await fetch(`/api/cart?userId=${userId}`);
      // const data = await res.json();
      // const backendCart: CartItem[] = data.items;

      const backendCart: CartItem[] = [];

      setCartItems((prev) => {
        const mergedMap = new Map<string, CartItem>();

        [...prev, ...backendCart].forEach((item) => {
          const existing = mergedMap.get(item.id);

          if (existing) {
            mergedMap.set(item.id, {
              ...existing,
              quantity: existing.quantity + item.quantity,
            });
          } else {
            mergedMap.set(item.id, { ...item });
          }
        });

        const mergedCart = Array.from(mergedMap.values());

        saveCartToLocalStorage(mergedCart);

        console.log(`Carrinho sincronizado (user: ${userId})`, mergedCart);

        return mergedCart;
      });
    } catch (error) {
      console.error("Erro ao sincronizar carrinho:", error);
    }
  };

  // =============================
  // PROVIDER
  // =============================
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        total,
        isLoaded,
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

  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }

  return ctx;
};