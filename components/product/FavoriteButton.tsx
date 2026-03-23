
"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/app/context/FavoritesContext";
import type { FavoriteItem } from "@/app/types/FavoriteItem";

interface FavoriteButtonProps {
  product: FavoriteItem;
}

export function FavoriteButton({ product }: FavoriteButtonProps) {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  // Proteção caso product não venha definido
  const liked = product ? isFavorite(product.id) : false;

  const handleClick = () => {
    if (!product) return; // Evita erros caso product seja undefined

    if (liked) removeFavorite(product.id);
    else addFavorite(product);
  };

  return (
    <button
      onClick={handleClick}
      className="absolute top-3 right-3 p-2 rounded-full bg-transparent transition"
      aria-label={liked ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    >
      <Heart
        size={20}
        className={`transition ${
          liked ? "fill-fuchsia-900 text-fuchsia-900" : "text-primary"
        }`}
      />
    </button>
  );
}