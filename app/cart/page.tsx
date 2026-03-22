"use client";

import React from "react";
import Image from "next/image";
import { useCart } from "@/app/context/cart/CartContext";
import { Trash2, Plus, Minus } from "lucide-react";

const formatPrice = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

export default function CartPage() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    total,
    clearCart,
    isLoaded,
  } = useCart();

  const shipping = 20;
  const grandTotal = total + shipping;

  if (!isLoaded) {
    return <div className="p-10 text-center">Carregando...</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-10 text-center">
        <h1 className="text-3xl font-bold mb-4">Seu carrinho está vazio!</h1>
        <p className="text-gray-500">
          Adicione produtos e volte aqui!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 sm:p-8 flex flex-col lg:flex-row gap-10">
      
      {/* LISTA */}
      <div className="flex-1 flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Meu Carrinho</h1>

        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row items-center gap-6 bg-white p-7 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300"
          >
            {/* IMAGEM */}
            <Image
              src={item.image}
              alt={item.title}
              width={100}
              height={100}
              className="rounded-lg object-cover"
            />

            {/* INFO */}
            <div className="flex-1 w-full">
              <h2 className="font-semibold text-lg">{item.title}</h2>

              <p className="text-lg font-bold mt-1">
                {formatPrice(item.price)}
              </p>

              {/* QUANTIDADE */}
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={() =>
                    updateQuantity(item.id, item.quantity - 1)
                  }
                  className="bg-gray-100 hover:bg-gray-200 active:scale-95 transition px-3 py-1 rounded-md"
                >
                  <Minus size={16} />
                </button>

                <span className="min-w-[30px] text-center font-medium">
                  {item.quantity}
                </span>

                <button
                  onClick={() =>
                    updateQuantity(item.id, item.quantity + 1)
                  }
                  className="bg-gray-100 hover:bg-gray-200 active:scale-95 transition px-3 py-1 rounded-md"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* SUBTOTAL + REMOVE */}
            <div className="flex flex-col items-end gap-4">
              <p className="text-sm text-gray-500">
                Subtotal
              </p>
              <p className="font-semibold">
                {formatPrice(item.price * item.quantity)}
              </p>

              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:text-red-700 transition"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {/* LIMPAR */}
        <button
          onClick={clearCart}
          className="mt-4 bg-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-300 transition"
        >
          Limpar Carrinho
        </button>
      </div>

      {/* RESUMO */}
      <div className="w-full lg:w-[380px] bg-white p-7 rounded-2xl shadow-md h-fit">
        <h2 className="text-xl font-semibold mb-6">Resumo do Pedido</h2>

        <div className="flex justify-between text-gray-600 mb-2">
          <span>Subtotal</span>
          <span>{formatPrice(total)}</span>
        </div>

        <div className="flex justify-between text-gray-600 mb-4">
          <span>Frete</span>
          <span>{formatPrice(shipping)}</span>
        </div>

        <div className="border-t border-gray-200 my-4"></div>

        <div className="flex justify-between text-lg font-bold mb-6">
          <span>Total</span>
          <span>{formatPrice(grandTotal)}</span>
        </div>

        <button className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-semibold shadow-md hover:shadow-lg transition">
          Finalizar Compra
        </button>
      </div>
    </div>
  );
}