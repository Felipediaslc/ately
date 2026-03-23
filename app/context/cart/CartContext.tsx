"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
} from "react";

import type { CartItem } from "@/app/types/cart"; // ajuste para seu tipo real
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
  syncWithBackend?: (userId: string) => Promise<void>; // futura função
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

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // =============================
  // LOAD (SSR SAFE) COM CORREÇÃO DO ESLINT
  // =============================
  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadCart = () => {
      const stored = getCartFromLocalStorage();
      setCartItems(stored);
      setIsLoaded(true);
    };

    // chama de forma assíncrona para evitar renderização em cascata
    setTimeout(loadCart, 0);
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
  const addToCart = (item: Omit<CartItem, "quantity">, quantity: number = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);

      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
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
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  // =============================
  // DERIVED STATE
  // =============================
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // =============================
  // FUTURE BACKEND SYNC
  // =============================
  const syncWithBackend = async () => {
    try {
      // 🔹 MOCK: buscar carrinho do backend
      const backendCart: CartItem[] = []; // aqui você faria fetch real

      // 🔹 Merge local + backend
      const mergedCart: CartItem[] = [...cartItems];

      backendCart.forEach((bItem) => {
        const exists = mergedCart.find((lItem) => lItem.id === bItem.id);
        if (exists) {
          exists.quantity += bItem.quantity;
        } else {
          mergedCart.push(bItem);
        }
      });

      setCartItems(mergedCart);
      saveCartToLocalStorage(mergedCart);

      // 🔹 MOCK: enviar carrinho mesclado pro backend
      console.log("Carrinho sincronizado com backend:", mergedCart);
    } catch (error) {
      console.error("Erro ao sincronizar carrinho com backend:", error);
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