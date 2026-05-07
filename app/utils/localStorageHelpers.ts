// localStorageHelpers.ts

import type { CartItem } from "@/app/types/cart"; // ou FavoriteItem se tiver separado
import type { FavoriteItem  } from "@/app/types/FavoriteItem"

// =============================
// CARRINHO
// =============================
export const saveCartToLocalStorage = (cart: CartItem[]) => {
  try {
    const safeCart = cart.filter((item) => item?.productId?.trim());
    localStorage.setItem("cart", JSON.stringify(safeCart));
  } catch (error) {
    console.error("Erro ao salvar carrinho:", error);
  }
};

export const getCartFromLocalStorage = (): CartItem[] => {
  try {
    const stored = localStorage.getItem("cart");
    if (!stored) return [];

    const parsed: unknown[] = JSON.parse(stored);

    return parsed
      .map((item) => {
        const i = item as Partial<CartItem> & { _id?: string };

        const productId = i.productId ?? i._id ?? "";

        return {
          productId,
          title: i.title ?? "",
          price: i.price ?? 0,
          image: i.image ?? "",
          sku: i.sku,
          pixPrice: i.pixPrice,
          quantity: i.quantity ?? 1,
        };
      })
      .filter((item) => {
        // 🔥 BLOQUEIA LIXO ANTIGO
        return item.productId && item.productId.length > 10;
      });
  } catch (error) {
    console.error("Erro ao ler carrinho:", error);
    return [];
  }
};

export const clearCartFromLocalStorage = () => {
  try {
    localStorage.removeItem("cart");
  } catch (error) {
    console.error("Erro ao limpar carrinho:", error);
  }
};
////////////////////////////////////////////////////////
// =============================
// FAVORITOS
// =============================
export const saveFavoritesToLocalStorage = (favorites: FavoriteItem[]) => {
  try {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  } catch (error) {
    console.error("Erro ao salvar favoritos:", error);
  }
};

export const getFavoritesFromLocalStorage = (): FavoriteItem[] => {
  try {
    const stored = localStorage.getItem("favorites");
    if (stored) return JSON.parse(stored) as FavoriteItem[];
    return [];
  } catch (error) {
    console.error("Erro ao ler favoritos:", error);
    return [];
  }
};

export const clearFavoritesFromLocalStorage = () => {
  try {
    localStorage.removeItem("favorites");
  } catch (error) {
    console.error("Erro ao limpar favoritos:", error);
  }
};