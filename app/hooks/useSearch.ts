"use client";

import { useEffect, useRef, useState } from "react";

type Product = {
  _id: string;
  title: string;
  price: number;
  images?: string[];
};

export function useSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const cache = useRef<Record<string, Product[]>>({});
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchResults = async (value: string) => {
    if (!value) {
      setResults([]);
      return;
    }

    if (cache.current[value]) {
      setResults(cache.current[value]);
      return;
    }

    abortRef.current?.abort();

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      setLoading(true);

      const res = await fetch(`/api/search?q=${value}`, {
        signal: controller.signal,
      });

      const data = await res.json();

      const safeResults = data?.results || [];

      cache.current[value] = safeResults;
      setResults(safeResults);
    } catch {
      // ignore abort
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (value: string) => {
    setQuery(value);

    // 🔥 debounce controlado via ref (SEM useMemo, SEM função externa)
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchResults(value);
    }, 300);
  };

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return {
    query,
    results,
    loading,
    handleChange,
  };
}
