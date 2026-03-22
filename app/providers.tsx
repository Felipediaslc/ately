"use client";

import { ReactNode } from "react";
import { CartProvider } from "@/app/context/cart/CartContext";

export function Providers({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}