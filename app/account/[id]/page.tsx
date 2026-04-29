import { notFound, redirect } from "next/navigation";
import { getUser } from "@/app/server/auth/getUser";
import { connectDB } from "@/app/server/db/connect";
import { OrderModel } from "@/app/server/db/models/Order";
import Image from "next/image";
import Link from "next/link";

type Props = {
  params: {
    id: string;
  };
};

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
  status: string;
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

function formatMoney(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

/**
 * 🎯 Timeline de status (UX nível produto real)
 */
const statusSteps = ["pendente", "pago", "enviado", "entregue"];

function StatusTimeline({ status }: { status: string }) {
  const currentIndex = statusSteps.indexOf(status);

  return (
    <div className="flex items-center justify-between mt-4">
      {statusSteps.map((step, index) => {
        const active = index <= currentIndex;

        return (
          <div key={step} className="flex-1 flex items-center">
            {/* CIRCLE */}
            <div
              className={`w-4 h-4 rounded-full ${
                active ? "bg-black" : "bg-gray-300"
              }`}
            />

            {/* LINE */}
            {index < statusSteps.length - 1 && (
              <div
                className={`flex-1 h-[2px] ${
                  index < currentIndex ? "bg-black" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = params;

  if (!id) redirect("/");

  const user = await getUser();
  if (!user) redirect("/");

  await connectDB();

  const order = await OrderModel.findById(id).lean<OrderDB>();

  if (!order) notFound();

  if (!order.userId || order.userId.toString() !== String(user._id)) {
    return notFound();
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">
            Pedido #{order._id.slice(-6)}
          </h1>
          <p className="text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleDateString("pt-BR")}
          </p>
        </div>

        <Link
          href="/products"
          className="text-sm px-4 py-2 bg-black text-white rounded-lg hover:opacity-90 transition"
        >
          Comprar novamente
        </Link>
      </div>

      {/* STATUS + TIMELINE */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Status</span>

          <span className="text-sm font-medium capitalize">
            {order.status}
          </span>
        </div>

        <StatusTimeline status={order.status} />
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-3 gap-6">

        {/* 📦 ITENS */}
        <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Itens</h2>

          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={`${item.productId}-${item.quantity}`}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={item.image || "/placeholder.png"}
                    alt={item.title}
                    width={60}
                    height={60}
                    className="w-14 h-14 object-cover rounded-lg"
                  />

                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-gray-500">
                      {item.quantity}x {formatMoney(item.price)}
                    </p>
                  </div>
                </div>

                <div className="text-sm font-semibold">
                  {formatMoney(item.quantity * item.price)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 🧾 RESUMO + ENDEREÇO */}
        <div className="space-y-6">

          {/* 💰 RESUMO */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Resumo</h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatMoney(order.subtotal)}</span>
              </div>

              <div className="flex justify-between">
                <span>Frete</span>
                <span>{formatMoney(order.shipping.price)}</span>
              </div>

              <div className="flex justify-between font-semibold text-base mt-2">
                <span>Total</span>
                <span>{formatMoney(order.total)}</span>
              </div>
            </div>
          </div>

          {/* 🏠 ENDEREÇO */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">
              Endereço de entrega
            </h2>

            <div className="text-sm text-gray-700 space-y-1">
              <p>
                {order.address.street || "-"},{" "}
                {order.address.number || "-"}
              </p>
              <p>{order.address.neighborhood || "-"}</p>
              <p>
                {order.address.city || "-"} -{" "}
                {order.address.state || "-"}
              </p>
              <p>CEP: {order.address.zipCode}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}