"use client";

import { Search, X } from "lucide-react";
import { useSearch } from "@/app/hooks/useSearch";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function SearchBar() {
  const { query, results, handleChange, loading } = useSearch();
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const router = useRouter();

  /**
   * 🔥 Highlight (texto buscado)
   */
  function highlight(text: string, query: string) {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className="font-semibold text-black">
          {part}
        </span>
      ) : (
        part
      )
    );
  }

  /**
   * 🔥 Navegação teclado
   */
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!results.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < results.length - 1 ? prev + 1 : 0
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : results.length - 1
      );
    }

    if (e.key === "Enter" && activeIndex >= 0) {
      const product = results[activeIndex];
      router.push(`/products/${product._id}`);
    }
  }

  return (
    <div className="relative w-full max-w-xl">

      {/* INPUT */}
      <div className="flex items-center rounded-lg bg-white px-3 shadow-sm">
        <Search size={18} />

        <input
          value={query}
          onChange={(e) => {
            handleChange(e.target.value);
            setActiveIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Buscar produtos..."
          className="w-full bg-transparent px-2 py-2 text-sm outline-none"
        />

        {query && (
          <button onClick={() => handleChange("")}>
            <X size={16} />
          </button>
        )}
      </div>

      {/* DROPDOWN */}
      {query && (
        <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-lg border bg-white shadow-lg overflow-hidden">

          {/* 🔥 LOADING (SKELETON) */}
          {loading && (
            <div className="p-3 space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-10 h-10 bg-gray-200 rounded" />
                  <div className="flex-1 space-y-1">
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* RESULTADOS */}
          {!loading && results?.length > 0 && (
            results.map((p, index) => (
              <div
                key={p._id}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => router.push(`/products/${p._id}`)}
                className={`flex items-center gap-3 px-4 py-2 cursor-pointer transition
                  ${index === activeIndex ? "bg-gray-100" : "hover:bg-gray-100"}
                `}
              >
                <Image
                  src={p.images?.[0] || "/placeholder.png"}
                  alt={p.title}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded object-cover"
                />

                <div>
                  <p className="text-sm">
                    {highlight(p.title, query)}
                  </p>
                  <p className="text-xs text-gray-500">
                    R$ {p.price}
                  </p>
                </div>
              </div>
            ))
          )}

          {/* EMPTY */}
          {!loading && results.length === 0 && (
            <div className="p-3 text-sm text-gray-500">
              Nenhum produto encontrado
            </div>
          )}
        </div>
      )}
    </div>
  );
}