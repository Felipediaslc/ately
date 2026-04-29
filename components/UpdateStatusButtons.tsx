"use client";

import { useState } from "react";
import type { OrderStatus } from "@/app/utils/getStatusConfig";

type Props = {
  id: string;
  onStatusChange: (status: OrderStatus) => void;
};

export function UpdateStatusButtons({ id, onStatusChange }: Props) {
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<OrderStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function updateStatus(status: OrderStatus) {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Erro ao atualizar status");
        return;
      }

      setCurrentStatus(data.status);
      onStatusChange(data.status);

    } catch (err) {
      console.error(err);
      setError("Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  const baseBtn =
    "px-3 py-1 rounded-md text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed";

  const isDisabled = loading;

  return (
    <div className="flex flex-col gap-3">

      <div className="flex flex-wrap gap-2">

        <button
          disabled={isDisabled}
          onClick={() => updateStatus("pago")}
          className={`${baseBtn} bg-blue-600 text-white hover:bg-blue-700`}
        >
          Pago
        </button>

        <button
          disabled={isDisabled}
          onClick={() => updateStatus("enviado")}
          className={`${baseBtn} bg-black text-white hover:bg-zinc-800`}
        >
          {loading ? "Atualizando..." : "Enviar"}
        </button>

        <button
          disabled={isDisabled}
          onClick={() => updateStatus("entregue")}
          className={`${baseBtn} bg-green-600 text-white hover:bg-green-700`}
        >
          Entregue
        </button>

        <button
          disabled={isDisabled}
          onClick={() => updateStatus("cancelado")}
          className={`${baseBtn} bg-red-600 text-white hover:bg-red-700`}
        >
          Cancelar
        </button>

      </div>

      {/* feedback sucesso */}
      {currentStatus && !error && (
        <p className="text-sm text-blue-600">
          Status atualizado: <strong>{currentStatus}</strong>
        </p>
      )}

      {/* feedback erro */}
      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}

    </div>
  );
}