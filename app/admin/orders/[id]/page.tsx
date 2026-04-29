import { connectDB } from "@/app/server/db/connect";
import { OrderModel } from "@/app/server/db/models/Order";
import { notFound } from "next/navigation";
import { OrderStatusCard } from "@/components/OrderStatusCard";
import type { OrderStatus } from "@/app/utils/getStatusConfig";
import { formatMoney } from "@/app/utils/formatMoney";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Types } from "mongoose";

type OrderItemDB = {
  _id?: Types.ObjectId;
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
};

type OrderItem = {
  _id?: string;
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
};

type Order = {
  _id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  address: {
    zipCode: string;
    street?: string;
    number?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
  };
  items: OrderItem[];
  subtotal: number;
  shipping?: {
    price: number;
  };
  total: number;
  status: OrderStatus;
  createdAt: string;
};

type Props = {
  params: Promise<{ id: string }>;
};

async function getOrder(id: string): Promise<Order | null> {
  await connectDB();

  const order = await OrderModel.findById(id).lean();

  if (!order) return null;

  return {
    ...order,
    _id: order._id.toString(),
    items: order.items.map((item: OrderItemDB): OrderItem => ({
      ...item,
      _id: item._id?.toString(),
    })),
  };
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;

  const order = await getOrder(id);

  if (!order) return notFound();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* BREADCRUMB + BACK */}
        <div className="flex items-center justify-between">
          
          <Link
            href="/admin/orders"
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition"
          >
            <ArrowLeft size={16} />
            Voltar
          </Link>

          <div className="text-xs text-zinc-500">
            <Link href="/admin" className="hover:text-zinc-300">Painel</Link>
            {" / "}
            <Link href="/admin/orders" className="hover:text-zinc-300">Pedidos</Link>
            {" / "}
            <span className="text-zinc-300">Detalhe</span>
          </div>
        </div>

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Pedido #{order._id.slice(-6)}
          </h1>
          <p className="text-sm text-zinc-500">
            Criado em {new Date(order.createdAt).toLocaleString("pt-BR")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* STATUS */}
          <OrderStatusCard order={order} />

          {/* DETALHES */}
          <div className="md:col-span-2 space-y-6">

            {/* CLIENTE */}
            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl">
              <p className="text-sm text-zinc-400 mb-2">Cliente</p>
              <p className="font-medium">{order.customer.name}</p>
              <p className="text-sm text-zinc-500">{order.customer.email}</p>
              <p className="text-sm text-zinc-500">{order.customer.phone}</p>
            </div>

            {/* ENDEREÇO */}
            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl">
              <p className="text-sm text-zinc-400 mb-2">Endereço</p>
              <p>{order.address.street}, {order.address.number}</p>
              <p className="text-sm text-zinc-500">{order.address.neighborhood}</p>
              <p className="text-sm text-zinc-500">
                {order.address.city} - {order.address.state}
              </p>
              <p className="text-sm text-zinc-500">
                CEP: {order.address.zipCode}
              </p>
            </div>

            {/* PRODUTOS */}
            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl">
              <p className="text-sm text-zinc-400 mb-3">Produtos</p>

              {order.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex justify-between text-sm border-b border-zinc-800 py-2"
                >
                  <span>
                    {item.title} x{item.quantity}
                  </span>
                  <span className="font-medium">
                    {formatMoney(item.price * item.quantity)}
                  </span>
                </div>
              ))}

              <div className="flex justify-between text-sm mt-4 text-zinc-400">
                <span>Subtotal</span>
                <span>{formatMoney(order.subtotal)}</span>
              </div>

              <div className="flex justify-between text-sm text-zinc-400">
                <span>Frete</span>
                <span>{formatMoney(order.shipping?.price ?? 0)}</span>
              </div>

              <div className="flex justify-between mt-3 font-semibold border-t border-zinc-800 pt-3">
                <span>Total</span>
                <span className="text-green-400">
                  {formatMoney(order.total)}
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}