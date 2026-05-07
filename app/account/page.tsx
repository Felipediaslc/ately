import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/app/server/auth/getUser";
import { connectDB } from "@/app/server/db/connect";
import { OrderModel } from "@/app/server/db/models/Order";
import { StatusBadge } from "@/app/utils/StatusBadge";
import type { OrderStatus } from "@/app/utils/getStatusConfig";

type OrderDB = {
  _id: string;
  total: number;
  status: OrderStatus;
  createdAt: Date;
};

export default async function AccountPage() {
  const user = await getUser();

  if (!user) {
    redirect("/");
  }

  await connectDB();

const orders = await OrderModel.find({
  $or: [
    { userId: user._id.toString() }, // pedidos logado
    { "customer.email": user.email }, // pedidos guest
  ],
})
  .sort({ createdAt: -1 })
  .lean();

const formattedOrders: OrderDB[] = orders.map((order) => ({
  _id: String(order._id),
  total: order.total,
  status: order.status,
  createdAt: order.createdAt,
}));
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Minha Conta</h1>
        <p className="text-sm text-gray-500">
          Gerencie seus dados, pedidos e endereço
        </p>
      </div>

      {/* GRID PRINCIPAL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* 👤 DADOS */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
          <h2 className="text-lg font-semibold mb-4">Dados</h2>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-600">
              {user.name?.[0]}
            </div>

            <div>
              <p className="text-base font-medium">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>

        {/* 🏠 ENDEREÇO */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Endereço</h2>

            <Link
              href="/account/address"
              className="text-sm text-blue-600 hover:underline"
            >
              {user.address?.zipCode ? "Editar" : "Adicionar"}
            </Link>
          </div>

          {user.address?.zipCode ? (
            <div className="text-sm space-y-1 text-gray-700">
              <p>
                {user.address.street}, {user.address.number}
              </p>
              <p>{user.address.neighborhood}</p>
              <p>
                {user.address.city} - {user.address.state}
              </p>
              <p>CEP: {user.address.zipCode}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Nenhum endereço salvo.
            </p>
          )}
        </div>

        {/* 📦 PEDIDOS */}
        <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
          <h2 className="text-lg font-semibold mb-4">Meus Pedidos</h2>

          {formattedOrders.length === 0 ? (
            <div className="text-sm text-gray-500 space-y-3">
              <p>Você ainda não fez pedidos.</p>

              <Link
                href="/products"
                className="inline-block text-sm bg-black text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
              >
                Ver produtos
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {formattedOrders.map((order) => (
                
                <Link
                  key={order._id}
                  href={`/account/${order._id}`}
                  
                  className="block rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition"
                >
                  <div className="flex justify-between mb-2 text-xs text-gray-500">
                    <span>Pedido #{order._id.slice(-6)}</span>
                    <span>
                      {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>

                  <div className="  flex justify-between items-center">
                    <StatusBadge status={order.status} />

                    <span className="font-semibold text-base">
                      {order.total.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                  </div>

                  <div className="mt-2 text-xs text-gray-400">
                    Toque para ver detalhes
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}