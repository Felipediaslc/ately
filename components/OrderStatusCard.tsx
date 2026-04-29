"use client";

import { useState } from "react";
import {  type OrderStatus } from "@/app/utils/getStatusConfig";

import { UpdateStatusButtons } from "@/components/UpdateStatusButtons";
import { StatusBadge } from "@/components/StatusBadge";

type Props = {
  order: {
    _id: string;
    status: OrderStatus;
  };
};

const statusFlow: OrderStatus[] = ["pendente", "pago", "enviado", "entregue"];

// 🧠 mock de histórico (depois você pode puxar do backend se quiser)
const statusMeta: Record<OrderStatus, string> = {
  pendente: "Pedido criado",
  pago: "Pagamento confirmado",
  enviado: "Pedido enviado para transporte",
  entregue: "Entregue / aguardando confirmação",

  cancelado: "Pedido cancelado",
  estornado: "Pagamento estornado",
};

export function OrderStatusCard({ order }: Props) {
  const [status, setStatus] = useState<OrderStatus>(order.status);

  const currentIndex = statusFlow.indexOf(status);

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-5">
      {/* TITLE */}
      <div>
        <p className="text-sm text-zinc-400">Status do Pedido</p>
      </div>

      {/* TIMELINE */}
      <div className="flex items-center gap-2">
        {statusFlow.map((step, index) => {
          const isActive = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={step} className="flex items-center gap-2 group relative">
              {/* DOT */}
              <div
                className={`
                  w-3 h-3 rounded-full transition-all duration-300
                  ${isActive ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]" : "bg-zinc-700"}
                  ${isCurrent ? "scale-125" : ""}
                `}
              />

              {/* TOOLTIP */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-black text-xs text-white px-2 py-1 rounded-md whitespace-nowrap">
                {statusMeta[step]}
              </div>

              {/* CONNECTOR */}
              {index !== statusFlow.length - 1 && (
                <div
                  className={`
                    w-8 h-[2px] transition-all duration-300
                    ${index < currentIndex ? "bg-green-500" : "bg-zinc-700"}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* STATUS VISUAL */}
      <StatusBadge status={status} />

      {/* ACTIONS */}
      <div className="pt-2">
        <UpdateStatusButtons
          id={order._id}
          onStatusChange={(newStatus) => setStatus(newStatus)}
        />
      </div>
    </div>
  );
}
