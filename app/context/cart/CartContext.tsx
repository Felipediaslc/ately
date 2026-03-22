"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
} from "react";

// =============================
// TYPES
// =============================
export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  updateQuantity: (id: string, quantity: number) => void;
  total: number;
  isLoaded: boolean; // 👈 importante pra evitar flicker
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
  // LOAD (SSR SAFE)
  // =============================
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem("cart");

      if (stored) {
        const parsed: CartItem[] = JSON.parse(stored);
        setCartItems(parsed);
      }
    } catch (error) {
      console.error("Erro ao carregar carrinho:", error);
      setCartItems([]);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // =============================
  // SAVE (DEBOUNCE)
  // =============================
  useEffect(() => {
    if (!isLoaded) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      try {
        localStorage.setItem("cart", JSON.stringify(cartItems));
      } catch (error) {
        console.error("Erro ao salvar carrinho:", error);
      }
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
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
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