// localStorageHelpers.ts

import type { CartItem } from "@/app/types/cart"; // ou FavoriteItem se tiver separado
import type { FavoriteItem  } from "@/app/types/FavoriteItem"

// =============================
// CARRINHO
// =============================
export const saveCartToLocalStorage = (cart: CartItem[]) => {
  try {
    localStorage.setItem("cart", JSON.stringify(cart));
  } catch (error) {
    console.error("Erro ao salvar carrinho:", error);
  }
};

export const getCartFromLocalStorage = (): CartItem[] => {
  try {
    const stored = localStorage.getItem("cart");
    if (stored) return JSON.parse(stored) as CartItem[];
    return [];
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