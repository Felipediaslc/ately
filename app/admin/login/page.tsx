"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Preencha os campos");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao fazer login");
        return;
      }

      router.push("/admin");
    } catch {
      setError("Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f11] px-4">
      <div className="w-full max-w-sm space-y-6">

        {/* LOGO */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 bg-sky-700 rounded-xl flex items-center justify-center">
            <LayoutDashboard size={18} className="text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-lg font-semibold text-zinc-100">Painel Admin</h1>
            <p className="text-xs text-zinc-500 mt-0.5">Faça login para continuar</p>
          </div>
        </div>

        {/* CARD */}
        <div className="bg-[#111113] border border-zinc-800/60 rounded-xl p-6 space-y-4">

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-3 py-2.5 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs text-zinc-500">Email</label>
            <input
              type="email"
              placeholder="admin@email.com"
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-zinc-500">Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-sky-700 hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-medium transition mt-2"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

        </div>
      </div>
    </div>
  );
}