import { notFound, redirect } from "next/navigation";
import { getUser } from "@/app/server/auth/getUser";
import { connectDB } from "@/app/server/db/connect";
import { OrderModel } from "@/app/server/db/models/Order";
import Image from "next/image";
import Link from "next/link";

import { StatusBadge } from "@/app/utils/StatusBadge";
import type { OrderStatus } from "@/app/utils/getStatusConfig";



type OrderItem = {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image?: string | null;
};

type OrderDB = {
  _id: string;
  userId?: string;
  status: OrderStatus;
  createdAt: Date;
  subtotal: number;
  total: number;
  items: OrderItem[];
  address: {
    street?: string;
    number?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zipCode: string;
  };
  shipping: {
    price: number;
    method?: string;
  };
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) redirect("/");

  const user = await getUser();
  if (!user) redirect("/");

  await connectDB();

  const order = await OrderModel.findById(id).lean<OrderDB>();
  const items: OrderItem[] = order?.items ?? [];

  if (!order) notFound();

  if (!order.userId || order.userId.toString() !== user._id.toString()) {
    notFound();
  }

  const orderIdShort = String(order._id).slice(-6);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <div className="text-xs text-gray-400 mb-2 flex items-center gap-2">
            <Link href="/account" className="hover:underline">
              Minha conta
            </Link>

            <span>/</span>

            <span className="text-gray-500">Pedido #{orderIdShort}</span>
          </div>
          <h1 className="text-2xl font-semibold">
            Pedido #{orderIdShort}
          </h1>

          <p className="text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleDateString("pt-BR")}
          </p>
        </div>

        {/* 🔥 STATUS GLOBAL */}
        <div className="flex items-center gap-2 bg-yellow-100">
        <StatusBadge status={order.status} />
        </div>
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* ITENS */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Itens</h2>

          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex justify-between items-center"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={item.image || "/placeholder.png"}
                    alt={item.title}
                    width={60}
                    height={60}
                    className="rounded-lg object-cover"
                  />

                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-gray-500">
                      {item.quantity}x R$ {item.price}
                    </p>
                  </div>
                </div>

                <p className="font-semibold">R$ {item.quantity * item.price}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RESUMO + ENDEREÇO */}
        <div className="space-y-6">
          {/* RESUMO */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Resumo</h2>

            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>R$ {order.subtotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Frete</span>
                <span>R$ {order.shipping.price}</span>
              </div>

              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>R$ {order.total}</span>
              </div>
            </div>
          </div>

          {/* ENDEREÇO */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Endereço</h2>

            <div className="text-sm text-gray-700 space-y-1">
              <p>
                {order.address.street}, {order.address.number}
              </p>
              <p>{order.address.neighborhood}</p>
              <p>
                {order.address.city} - {order.address.state}
              </p>
              <p>CEP: {order.address.zipCode}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
