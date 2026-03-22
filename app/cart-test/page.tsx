"use client";

import React from "react";
import { useCart } from "@/app/context/cart/CartContext";
import { ProductCard } from "@/components/product/ProductCard";

const testProducts = [
  { id: "1", title: "Terço Cristal", price: 15.5, image: "/image/produto01.png" },
  { id: "2", title: "Mandala Decorativa", price: 45.9, image: "/image/produto02.png" },
];

export default function CartTestPage() {
  const { cartItems, removeFromCart, clearCart, total } = useCart();

  return (
    <div className="p-6 flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Teste do Carrinho</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
        <h2 className="font-semibold text-lg mb-2">Carrinho</h2>
        {cartItems.length === 0 ? (
          <p className="text-gray-500">O carrinho está vazio.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <span>{item.title} x {item.quantity}</span>
                <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                <button
                  className="text-red-500 text-xs"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remover
                </button>
              </div>
            ))}
            <hr className="my-2" />
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
            <button
              className="mt-2 bg-red-500 text-white px-3 py-1 rounded"
              onClick={clearCart}
            >
              Limpar Carrinho
            </button>
          </div>
        )}
      </div>
    </div>
  );
}