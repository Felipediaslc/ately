"use client";

import React from "react";
import { Heart } from "lucide-react";
import { useFavorites } from "@/app/context/FavoritesContext";
import { useCart } from "@/app/context/cart/CartContext";
import { FavoritesCard } from "@/components/product/FavoriteCard";

export default function FavoritesPage() {
  const { favoriteItems, removeFavorite, clearFavorites } = useFavorites();
  const { addToCart } = useCart();

  if (favoriteItems.length === 0) {
    return (
      <div className="!flex !flex-col items-center justify-center gap-4 py-24 px-6 text-center text-gray-400">
        <Heart size={48} strokeWidth={1.5} />
        <p className="text-lg font-medium">Você ainda não tem favoritos</p>
        <p className="text-sm">Explore nossos produtos e salve os que você mais gostou.</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="!flex !flex-col sm:!flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h1 className="text-2xl text-gray-600 sm:text-3xl font-bold">Meus Favoritos</h1>
        
      </div>

      {/* Lista de itens */}
      <div className="!flex !flex-col gap-4">
        {favoriteItems.map((item) => (
          <FavoritesCard
            key={item.id}
            product={item}
            onRemove={() => removeFavorite(item.id)}
            onAddToCart={() => {
              addToCart(item, 1);
              removeFavorite(item.id);
            }}
          />
        ))}
      </div>

      {/* Limpar favoritos */}
      <div className="mt-6">
        <button
          onClick={clearFavorites}
          className="bg-gray-600 text-gray-100 text-sm px-6 py-3 rounded-xl hover:bg-gray-400 transition font-medium"
        >
          Limpar Favoritos
        </button>
      </div>
    </div>
  );
}