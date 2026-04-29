export type OrderStatus = "pendente" | "pago" | "enviado" | "entregue" | "cancelado" | "estornado";

export type RecentOrder = {
  _id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  total: number;
  status: OrderStatus;
  createdAt: string;
};