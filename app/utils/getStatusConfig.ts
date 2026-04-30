import {
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  RotateCcw,
  PackageCheck,
} from "lucide-react";
 
export type OrderStatus =
  | "pendente"
  | "pago"
  | "enviado"
  | "entregue"
  | "cancelado"
  | "estornado";
 
const baseClass =
  "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border";
 
export function getStatusConfig(status: OrderStatus) {
  switch (status) {
    case "pendente":
      return {
        label: "Pendente",
        icon: Clock,
        className: `${baseClass} bg-yellow-50 border-yellow-300 text-yellow-700`,
      };
 
    case "pago":
      return {
        label: "Pago",
        icon: CheckCircle,
        className: `${baseClass} bg-blue-50 border-blue-300 text-blue-700`,
      };
 
    case "enviado":
      return {
        label: "Enviado",
        icon: Truck,
        className: `${baseClass} bg-purple-50 border-purple-300 text-purple-700`,
      };
 
    case "entregue":
      return {
        label: "Entregue",
        icon: PackageCheck,
        className: `${baseClass} bg-green-50 border-green-300 text-green-700`,
      };
 
    case "cancelado":
      return {
        label: "Cancelado",
        icon: XCircle,
        className: `${baseClass} bg-red-50 border-red-300 text-red-700`,
      };
 
    case "estornado":
      return {
        label: "Estornado",
        icon: RotateCcw,
        className: `${baseClass} bg-zinc-100 border-zinc-300 text-zinc-600`,
      };
 
    default:
      return {
        label: status,
        icon: Clock,
        className: `${baseClass} bg-zinc-100 border-zinc-300 text-zinc-600`,
      };
  }
}
 