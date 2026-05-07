import { Heart } from "lucide-react";
import { useFavorites } from "@/app/context/FavoritesContext";
import type { FavoriteItem } from "@/app/types/FavoriteItem";

interface FavoriteButtonProps {
  product: FavoriteItem;
}

export function FavoriteButton({ product }: FavoriteButtonProps) {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  const liked = isFavorite(product.productId);

  const handleClick = () => {
    if (liked) {
      removeFavorite(product.productId);
    } else {
      addFavorite(product);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="absolute top-3 right-3 p-2 rounded-full transition"
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