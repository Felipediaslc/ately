"use client";

import React from "react";
import Image from "next/image";
import { useCart } from "@/app/context/cart/CartContext";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";

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
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-400 text-sm animate-pulse">Carregando...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6 text-center">
        <ShoppingCart size={48} className="text-gray-300" />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Seu carrinho está vazio!
        </h1>
        <p className="text-gray-500 text-sm sm:text-base max-w-xs">
          Adicione produtos e volte aqui para finalizar sua compra.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
        Meu Carrinho
      </h1>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">

        {/* LISTA DE ITENS */}
        <div className="w-full flex-1 flex flex-col gap-4">

          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-start sm:items-center gap-4 bg-white p-4 sm:p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              {/* IMAGEM */}
              <div className="shrink-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={80}
                  height={80}
                  className="rounded-xl object-cover w-[72px] h-[72px] sm:w-[96px] sm:h-[96px]"
                />
              </div>

              {/* INFO + CONTROLES */}
              <div className="flex-1 min-w-0 flex flex-col gap-2">
                <h2 className="font-semibold text-sm sm:text-base leading-snug line-clamp-2">
                  {item.title}
                </h2>

                <p className="text-base sm:text-lg font-bold text-gray-800">
                  {formatPrice(item.price)}
                </p>

                {/* LINHA: quantidade + subtotal + lixeira */}
                <div className="flex items-center justify-between gap-3 mt-1 flex-wrap">
                  {/* QUANTIDADE */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="bg-gray-100 hover:bg-gray-200 active:scale-95 transition p-1.5 rounded-md"
                      aria-label="Diminuir quantidade"
                    >
                      <Minus size={14} />
                    </button>

                    <span className="min-w-[28px] text-center text-sm font-medium">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="bg-gray-100 hover:bg-gray-200 active:scale-95 transition p-1.5 rounded-md"
                      aria-label="Aumentar quantidade"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* SUBTOTAL + LIXEIRA */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-gray-400 leading-none mb-0.5">
                        Subtotal
                      </p>
                      <p className="text-sm font-semibold text-gray-800">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-800 hover:text-gray-600 transition p-1"
                      aria-label="Remover item"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* LIMPAR CARRINHO */}
          <button
            onClick={clearCart}
            className="mt-2 w-full sm:w-auto self-start bg-gray-100 text-gray-600 text-sm px-6 py-3 rounded-xl hover:bg-gray-200 transition font-medium"
          >
            Limpar Carrinho
          </button>
        </div>

        {/* RESUMO DO PEDIDO */}
        <div className="w-full lg:w-[360px] lg:sticky lg:top-6 bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold mb-5">Resumo do Pedido</h2>

          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>

            <div className="flex justify-between">
              <span>Frete</span>
              <span>{formatPrice(shipping)}</span>
            </div>
          </div>

          <div className="border-t border-gray-100 my-4" />

          <div className="flex justify-between text-base font-bold mb-6">
            <span>Total</span>
            <span>{formatPrice(grandTotal)}</span>
          </div>

          <button className="w-full bg-green-600 hover:bg-green-700 active:scale-[0.98] text-white py-3.5 rounded-xl font-semibold text-sm shadow hover:shadow-md transition-all">
            Finalizar Compra
          </button>
        </div>

      </div>
    </div>
  );
}
