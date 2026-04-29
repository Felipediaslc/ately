"use client";

import { useCallback, useEffect, useState } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  role?: string;
} | null;

export function useAuth() {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", {
        cache: "no-store",
      });

      const data = await res.json();

      setUser(data.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔥 FIX REAL (sem ESLint reclamar)
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          cache: "no-store",
        });

        const data = await res.json();

        setUser(data.user ?? null);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []); // 👈 sem refresh aqui

  return {
    user,
    loading,
    refresh, // ainda útil pra logout/login manual
  };
}