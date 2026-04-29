"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { z } from "zod";

// =============================
// SCHEMA (ZOD)
// =============================
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Digite seu email")
    .email("Email inválido"),
  password: z
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  // =============================
  // LOGIN
  // =============================
  async function handleLogin(e?: React.FormEvent) {
    e?.preventDefault();

    if (loading) return;

    setErrors({});
    setLoading(true);

    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;

      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });

      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result.data),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({
          general:
            data.error === "Invalid credentials"
              ? "Email ou senha incorretos"
              : data.error || "Erro ao fazer login",
        });

        setLoading(false);
        return;
      }

      // 🔥 IMPORTANTE: só redireciona (cookie já resolve auth)
      router.push("/account");
    } catch (err) {
      console.error(err);

      setErrors({
        general: "Erro de conexão. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 font-sans">
      <div className="w-full max-w-sm relative overflow-hidden bg-white border border-gray-200 rounded-2xl px-8 py-10 shadow-sm">

        <div className="absolute -top-20 -right-20 w-56 h-56 bg-fuchsia-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="mb-8">
          <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-gray-400">
            Bem-vindo de volta
          </p>

          <h1 className="text-[24px] font-semibold text-gray-900 mt-2">
            Entrar na sua conta
          </h1>

          <p className="text-[13px] text-gray-500 mt-1">
            Acesse sua área
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-0">

          {/* EMAIL */}
          <label className="block text-[12px] font-medium text-gray-600 mb-1.5">
            Email
          </label>

          <input
            type="email"
            disabled={loading}
            className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email)
                setErrors((prev) => ({ ...prev, email: undefined }));
            }}
          />

          {errors.email && (
            <p className="mt-1 text-[12px] text-red-500">{errors.email}</p>
          )}

          {/* SENHA */}
          <label className="block text-[12px] font-medium text-gray-600 mt-4 mb-1.5">
            Senha
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              disabled={loading}
              className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 pr-10 text-sm"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password)
                  setErrors((prev) => ({ ...prev, password: undefined }));
              }}
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {errors.password && (
            <p className="mt-1 text-[12px] text-red-500">
              {errors.password}
            </p>
          )}

          {/* ERROR GERAL */}
          {errors.general && (
            <div className="mt-3 text-[12px] text-red-500 bg-red-50 px-3 py-2 rounded-lg">
              {errors.general}
            </div>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full mt-6 py-3 bg-fuchsia-600 text-white rounded-xl flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="text-center mt-6 text-[13px] text-gray-500">
          Não tem conta?{" "}
          <Link href="/register" className="text-fuchsia-600 font-medium">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}