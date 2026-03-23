"use client";

import React from "react";
import Image from "next/image";
import { ShoppingCart, Trash2 } from "lucide-react";
import type { FavoriteItem } from "@/app/types/FavoriteItem";

interface FavoritesCardProps {
  product: FavoriteItem;
  onRemove: () => void;
  onAddToCart: () => void;
}

export function FavoritesCard({ product, onRemove, onAddToCart }: FavoritesCardProps) {
  return (
    <div className="relative flex items-center gap-4 bg-white p-4 sm:p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">

      {/* Lixeira — canto superior direito */}
      <button
        onClick={onRemove}
        className="absolute top-3 right-4 text-gray-300 hover:text-red-500 transition p-2"
        aria-label="Remover dos favoritos"
      >
        <Trash2 size={16} />
      </button>

      {/* Imagem */}
      <div className="shrink-0">
        <Image
          src={product.image}
          alt={product.title}
          width={80}
          height={80}
          className="rounded-xl object-contain w-[72px] h-[72px] sm:w-[96px] sm:h-[96px]"
        />
      </div>

      {/* Info + ações */}
      <div className="flex-1 min-w-0 flex flex-col gap-2 pr-8">
        <h2 className="font-semibold text-sm sm:text-base leading-snug line-clamp-2">
          {product.title}
        </h2>

        {/* Preço + botão na mesma linha */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <p className="text-base sm:text-lg font-bold text-gray-800">
            R$ {product.price.toFixed(2)}
          </p>

          <button
            onClick={onAddToCart}
            className="flex items-center gap-1.5 bg-primary text-white text-xs sm:text-sm px-4 py-2 rounded-xl hover:bg-primary-dark active:scale-95 transition font-medium"
          >
            <ShoppingCart size={14} />
            Adicionar ao carrinho
          </button>
        </div>
      </div>

    </div>
  );
}