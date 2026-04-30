import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { StatusBadge } from "@/components/StatusBadge";
import { connectDB } from "@/app/server/db/connect";
import { OrderModel } from "@/app/server/db/models/Order";

import type { OrderStatus } from "@/app/utils/getStatusConfig";
import { formatMoney } from "@/app/utils/formatMoney";

type Order = {
  _id: string;
  customer?: {
    name?: string;
    email?: string;
  };
  total?: number;
  status?: OrderStatus;
  createdAt: string;
};

async function getOrders(): Promise<Order[]> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!token) redirect("/admin/login");

    await connectDB();

    const orders = await OrderModel.find()
      .sort({ createdAt: -1 })
      .lean();

    return orders.map((order) => ({
      ...order,
      _id: order._id.toString(),
    })) as Order[];
  } catch {
    return [];
  }
}

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Pedidos</h1>
          <p className="text-sm text-zinc-500">
            Gerencie os pedidos da sua loja
          </p>
        </div>

        {/* TABLE WRAPPER */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-zinc-400 border-b border-zinc-800">
              <tr>
                <th className="text-left p-4">ID</th>
                <th className="text-left p-4">Cliente</th>
                <th className="text-left p-4">Total</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Data</th>
              </tr>
            </thead>

            <tbody>
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-zinc-500">
                    Nenhum pedido encontrado
                  </td>
                </tr>
              )}

              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-t border-zinc-800 hover:bg-zinc-800/50 transition"
                >
                  <td colSpan={5} className="p-0">
                    <Link
                      href={`/admin/orders/${order._id}`}
                      className="block w-full"
                    >
                      <div className="grid grid-cols-5 items-center p-4">

                        {/* ID */}
                        <div className="font-mono text-xs text-zinc-500">
                          #{order._id.slice(-6)}
                        </div>

                        {/* CLIENTE */}
                        <div>
                          <div className="font-medium text-zinc-100">
                            {order.customer?.name}
                          </div>
                          <div className="text-xs text-zinc-500">
                            {order.customer?.email}
                          </div>
                        </div>

                        {/* TOTAL */}
                        <div className="text-zinc-200 font-medium">
                          {formatMoney(order.total ?? 0)}
                        </div>

                        {/* STATUS */}
                        <div>
                          <StatusBadge status={order.status ?? "pendente"} />
                        </div>

                        {/* DATA */}
                        <div className="text-zinc-500 text-xs">
                          {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                        </div>

                      </div>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
