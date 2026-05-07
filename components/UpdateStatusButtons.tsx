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
      console.log("🔥 CLICK STATUS:", status);

      const res = await fetch(`/api/orders/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      console.log("📡 STATUS RESPONSE:", res.status);

      const data = await res.json();
      console.log("📦 DATA RESPONSE:", data);

      if (!res.ok) {
        setError(data?.error || "Erro ao atualizar status");
        return;
      }

      console.log("✅ STATUS UPDATED:", data.data.status);

      const newStatus = data.data.status;

setCurrentStatus(newStatus);
onStatusChange(newStatus);

    } catch (err) {
      console.error("❌ FETCH ERROR:", err);
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
          className={`${baseBtn} bg-lime-600 text-white hover:bg-lime-700`}
        >
          Pago
        </button>

        <button
          disabled={isDisabled}
          onClick={() => updateStatus("enviado")}
          className={`${baseBtn} bg-blue-600 text-white hover:bg-blue-700`}
        >
          {loading ? "Atualizando..." : "Enviar"}
        </button>

        <button
          disabled={isDisabled}
          onClick={() => updateStatus("entregue")}
          className={`${baseBtn} bg-green-900 text-white hover:bg-green-800`}
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
        <p className="text-sm text-lime-600">
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