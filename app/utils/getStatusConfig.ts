import {
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  RotateCcw,
} from "lucide-react";

export type OrderStatus =
  | "pendente"
  | "pago"
  | "enviado"
  | "entregue"
  | "cancelado"
  | "estornado";

export function getStatusConfig(status: OrderStatus) {
  switch (status) {
    case "pendente":
      return {
        label: "Pendente",
        icon: Clock,
        className: "inline-flex items-center   px-2 py-1 text-xs font-medium  rounded border  border-yellow-500/40   text-yellow-300  bg-yellow-500/10   backdrop-blur-sm",
      };

    case "pago":
      return {
        label: "Pago",
        icon: CheckCircle,
        className: "bg-blue-100 text-blue-700",
      };

    case "enviado":
      return {
        label: "Enviado",
        icon: Truck,
        className: "bg-purple-100 text-purple-700 animate-pulse",
      };

    case "entregue":
      return {
        label: "Entregue",
        icon: CheckCircle,
        className: "bg-green-100 text-green-700",
      };

    case "cancelado":
      return {
        label: "Cancelado",
        icon: XCircle,
        className: "bg-red-100 text-red-700",
      };

    case "estornado":
      return {
        label: "Estornado",
        icon: RotateCcw,
        className: "bg-gray-100 text-gray-700",
      };

    default:
      return {
        label: status,
        icon: Clock,
        className: "bg-zinc-100 text-zinc-700",
      };
  }
}