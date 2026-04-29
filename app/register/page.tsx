
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erro ao criar conta");
        return;
      }

      router.push("/account");
    } catch (_err) {
      setError("Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
   <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 font-sans">
  <div className="w-full max-w-sm relative overflow-hidden bg-white border border-gray-200 rounded-2xl px-8 py-10 shadow-sm">

    {/* Glow de identidade (igual login) */}
    <div className="absolute -top-20 -right-20 w-56 h-56 bg-fuchsia-500/10 blur-3xl rounded-full pointer-events-none" />

    {/* Header */}
    <div className="mb-8">
      <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-gray-400">
        Comece agora
      </p>

      <h1 className="text-[24px] font-semibold text-gray-900 mt-2">
        Criar sua conta
      </h1>

      <p className="text-[13px] text-gray-500 mt-1">
        Leva menos de um minuto
      </p>
    </div>

    {/* Nome */}
    <label className="block text-[12px] font-medium text-gray-600 mb-1.5">
      Nome
    </label>
    <input
      className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition
      focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-100"
      placeholder="Seu nome"
      value={name}
      onChange={(e) => setName(e.target.value)}
    />

    {/* Email */}
    <label className="block text-[12px] font-medium text-gray-600 mt-4 mb-1.5">
      Email
    </label>
    <input
      className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition
      focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-100"
      placeholder="seu@email.com"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />

    {/* Senha */}
    <label className="block text-[12px] font-medium text-gray-600 mt-4 mb-1.5">
      Senha
    </label>
    <input
      className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition
      focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-100"
      type="password"
      placeholder="••••••••"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />

    {/* Error */}
    {error && (
      <div className="mt-3 text-[12px] text-red-500 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
        {error}
      </div>
    )}

    {/* Button */}
    <button
      onClick={handleRegister}
      disabled={loading}
      className="w-full mt-6 py-3 bg-fuchsia-600 hover:bg-fuchsia-500
      disabled:opacity-50 disabled:cursor-not-allowed
      text-white text-sm font-medium rounded-xl tracking-wide
      transition active:scale-[0.98] shadow-sm"
    >
      {loading ? "Criando..." : "Criar conta"}
    </button>

    {/* Footer */}
    <p className="text-center mt-6 text-[13px] text-gray-500">
      Já tem conta?{" "}
      <Link
        href="/login"
        className="text-fuchsia-600 font-medium hover:text-fuchsia-700 transition"
      >
        Entrar
      </Link>
    </p>
  </div>
</div>
  );
}