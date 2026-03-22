"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/app/context/cart/CartContext";
import { QuantitySelector } from "@/components/filters/QuantitySelector";
import { FavoriteButton } from "@/components/product/FavoriteButton";

interface Props {
  product: {
    id: string;
    image: string; // sempre string
    title: string;
    price: number;
  };
}

export function ProductCard({ product }: Props) {
   const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  type BtnState = "idle" | "loading" | "done";
  const [btnState, setBtnState] = useState<BtnState>("idle");

  const handleAddToCart = () => {
    if (btnState !== "idle") return;

    // garante que quantity nunca seja menor que 1
    const safeQuantity = quantity < 1 ? 1 : quantity;

    setBtnState("loading");

    addToCart(
      {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
      },
      safeQuantity
    );

    setTimeout(() => {
      setBtnState("done");
      setTimeout(() => setBtnState("idle"), 1500);
    }, 800);
  };

  return (
    <div
      className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col"
      style={{ height: "100%" }}
    >
      {/* Imagem + Favorito */}
      <Link href={`/products/${product.id}`} className="relative w-full aspect-[3/4] bg-gray-100 block">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition duration-500"
        />
        <FavoriteButton />
      </Link>

      {/* Informações */}
      <div className="p-4 flex flex-col gap-2">
        <Link
          href={`/products/${product.id}`}
          className="line-clamp-2 h-[40px] text-sm font-medium text-gray-800 hover:text-fuchsia-700 transition-colors"
        >
          {product.title}
        </Link>

        <div className="mt-auto">
          <p className="text-xl font-semibold text-gray-900">R$ {product.price}</p>
          <p className="text-xs text-gray-500">ou 1x sem juros</p>

          {/* Área de ações: quantidade + comprar */}
          <div className="flex items-center gap-2 mt-4">
            <QuantitySelector value={quantity} onChange={setQuantity} />

            <button
              onClick={handleAddToCart}
              disabled={btnState !== "idle"}
              className={
                "flex-1 text-white text-sm py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 " +
                (btnState === "done"
                  ? "bg-emerald-500"
                  : "bg-green-600 hover:bg-green-700") +
                " disabled:opacity-90 disabled:cursor-not-allowed hover:scale-105"
              }
            >
              {btnState === "idle" && "Comprar"}
              {btnState === "loading" && (
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
              )}
              {btnState === "done" && "Adicionado!"}
            </button>
 
          </div>
        </div>
      </div>
    </div>
  );
}