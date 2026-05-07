"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
} from "react";

import type { FavoriteItem } from "@/app/types/FavoriteItem";
import {
  saveFavoritesToLocalStorage,
  getFavoritesFromLocalStorage,
  clearFavoritesFromLocalStorage,
} from "@/app/utils/localStorageHelpers";

const FALLBACK_IMAGE = "/image/logo.jpeg";

// =============================
// CONTEXT TYPE
// =============================
interface FavoritesContextType {
  favoriteItems: FavoriteItem[];
  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (id: string) => void;
  clearFavorites: () => void;
  isFavorite: (id: string) => boolean;
  totalFavorites: number;
  syncWithBackend?: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

// =============================
// PROVIDER
// =============================
export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // =============================
  // NORMALIZER (🔥 FIX PRINCIPAL)
  // =============================
 const normalizeFavorite = (item: FavoriteItem): FavoriteItem => {
  return {
    ...item,
    images:
      Array.isArray(item.images) && item.images.length > 0
        ? item.images
        : ["/image/logo.jpeg"],
  };
};

  // =============================
  // LOAD
  // =============================
  useEffect(() => {
    if (typeof window === "undefined") return;

    setTimeout(() => {
      const stored = getFavoritesFromLocalStorage();

      const safe = (stored || []).map(normalizeFavorite);

      setFavoriteItems(safe);
      setIsLoaded(true);
    }, 0);
  }, []);

  // =============================
  // SAVE
  // =============================
  useEffect(() => {
    if (!isLoaded) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const safe = favoriteItems.map(normalizeFavorite);
      saveFavoritesToLocalStorage(safe);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [favoriteItems, isLoaded]);

  // =============================
  // ACTIONS
  // =============================
  const addFavorite = (item: FavoriteItem) => {
    const safeItem = normalizeFavorite(item);

    setFavoriteItems((prev) => {
      if (prev.some((i) => i.productId === safeItem.productId)) return prev;
      return [...prev, safeItem];
    });
  };

  const removeFavorite = (id: string) => {
    setFavoriteItems((prev) => prev.filter((i) => i.productId !== id));
  };

  const clearFavorites = () => {
    setFavoriteItems([]);
    clearFavoritesFromLocalStorage();
  };

  const isFavorite = (id: string) =>
    favoriteItems.some((item) => item.productId === id);

  const totalFavorites = favoriteItems.length;

  // =============================
  // SYNC MOCK
  // =============================
  const syncWithBackend = async () => {
    try {
      const backendFavorites: FavoriteItem[] = [];

      const merged = [...favoriteItems];

      backendFavorites.forEach((bItem) => {
        if (!merged.some((i) => i.productId === bItem.productId)) {
          merged.push(normalizeFavorite(bItem));
        }
      });

      setFavoriteItems(merged);
      saveFavoritesToLocalStorage(merged);
    } catch (error) {
      console.error("Erro ao sincronizar favoritos:", error);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favoriteItems,
        addFavorite,
        removeFavorite,
        clearFavorites,
        isFavorite,
        totalFavorites,
        syncWithBackend,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

// =============================
// HOOK
// =============================
export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx)
    throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
};