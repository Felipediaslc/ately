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

// =============================
// TYPES
// =============================
interface FavoritesContextType {
  favoriteItems: FavoriteItem[];
  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (id: string) => void;
  clearFavorites: () => void;
  isFavorite: (id: string) => boolean;
  totalFavorites: number;
  syncWithBackend?: () => Promise<void>; // futura integração
}

// =============================
// CONTEXT
// =============================
const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

// =============================
// PROVIDER
// =============================
export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // =============================
  // LOAD FAVORITES (SSR SAFE, evita warning de setState síncrono)
  // =============================
  useEffect(() => {
    if (typeof window === "undefined") return;

    setTimeout(() => {
      const stored = getFavoritesFromLocalStorage();
      if (stored) setFavoriteItems(stored);
      setIsLoaded(true);
    }, 0);
  }, []);

  // =============================
  // SAVE FAVORITES (DEBOUNCE)
  // =============================
  useEffect(() => {
    if (!isLoaded) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      saveFavoritesToLocalStorage(favoriteItems);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [favoriteItems, isLoaded]);

  // =============================
  // ACTIONS
  // =============================
  const addFavorite = (item: FavoriteItem) => {
    setFavoriteItems((prev) => {
      if (prev.some((i) => i.id === item.id)) return prev; // evita duplicados
      return [...prev, item];
    });
  };

  const removeFavorite = (id: string) => {
    setFavoriteItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearFavorites = () => {
    setFavoriteItems([]);
    clearFavoritesFromLocalStorage();
  };

  const isFavorite = (id: string) => favoriteItems.some((item) => item.id === id);

  const totalFavorites = favoriteItems.length;

  // =============================
  // SYNC WITH BACKEND (MOCK)
  // =============================
  const syncWithBackend = async () => {
    try {
      const backendFavorites: FavoriteItem[] = []; // MOCK
      const mergedFavorites = [...favoriteItems];

      backendFavorites.forEach((bItem) => {
        if (!mergedFavorites.some((lItem) => lItem.id === bItem.id)) {
          mergedFavorites.push(bItem);
        }
      });

      setFavoriteItems(mergedFavorites);
      saveFavoritesToLocalStorage(mergedFavorites);

      console.log("Favoritos sincronizados com backend:", mergedFavorites);
    } catch (error) {
      console.error("Erro ao sincronizar favoritos com backend:", error);
    }
  };

  // =============================
  // PROVIDER
  // =============================
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