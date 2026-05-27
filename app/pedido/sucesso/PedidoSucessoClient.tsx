"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

type Status = "loading" | "pendente" | "pago";

export default function PedidoSucessoClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<Status>("loading");

  const name = searchParams.get("name") || "";
  const email = searchParams.get("email") || "";
  const orderId = searchParams.get("orderId") || "";

  // 🔥 POLLING STATUS DO PEDIDO
  useEffect(() => {
    if (!orderId) return;

    const fetchStatus = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();

        const orderStatus = data?.status;

        if (orderStatus === "pago") {
          setStatus("pago");
          clearInterval(interval);
        } else {
          setStatus("pendente");
        }
      } catch {
        setStatus("pendente");
      }
    };

    fetchStatus();

    const interval = setInterval(fetchStatus, 3000);

    return () => clearInterval(interval);
  }, [orderId]);

  // 🔐 CRIAR CONTA
  async function handleCreateAccount() {
    if (!password) return;

    try {
      setLoading(true);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, orderId }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "EMAIL_EXISTS") {
          setError("Você já tem conta. Faça login.");
          return;
        }

        throw new Error("Erro ao criar conta");
      }

      router.push("/account");
    } catch (err) {
      console.error(err);
      alert("Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  }

  // 🎯 UI dinâmica
  const title =
    status === "pago"
      ? "Pagamento confirmado!"
      : status === "pendente"
      ? "Aguardando confirmação..."
      : "Processando pagamento...";

  const description =
    status === "pago"
      ? "Seu pedido foi confirmado e já está sendo preparado."
      : "Assim que o pagamento for confirmado, atualizaremos automaticamente.";

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-4 px-4">

      {/* ICON */}
      <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-2">
        <svg
          className="w-8 h-8 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h1 className="text-2xl font-semibold text-zinc-900">
        {title}
      </h1>

      <p className="text-zinc-400 text-sm max-w-xs leading-relaxed">
        {description}
      </p>

      {/* 👇 SÓ MOSTRA SE PAGAMENTO CONFIRMADO */}
      {status === "pago" && (
        <div className="mt-6 w-full max-w-xs">
          <h2 className="text-sm font-medium text-zinc-900 mb-2">
            Crie sua conta para acompanhar seus pedidos
          </h2>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Crie uma senha"
            className="w-full border rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-zinc-900"
          />

          <button
            onClick={handleCreateAccount}
            disabled={loading}
            className="w-full bg-zinc-900 text-white text-sm py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Criando..." : "Criar conta"}
          </button>

          {error && (
            <p className="text-xs text-red-500 mt-2">{error}</p>
          )}

          <button
            onClick={() => router.push("/login")}
            className="text-xs text-zinc-500 mt-2 hover:underline"
          >
            Já tem conta? Entrar
          </button>
        </div>
      )}
    </div>
  );
}