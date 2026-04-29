import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminKpis } from "@/app/server/services/admin/getAdminKpis";
import { KpiCard } from "@/components/admin/KpiCard";
import {
  ShoppingCart,
  DollarSign,
  Clock,
  LayoutDashboard,
  Package,
  ListOrdered,
  Users,
  Settings,
  LogOut,
  ChevronRight,
  Calendar,
} from "lucide-react";
import type { RecentOrder } from "@/app/types/order";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export default async function AdminPage() {
  const token = (await cookies()).get("admin_token")?.value;
  if (!token) redirect("/admin/login");

  let email: string;
  try {
    const { payload } = await jwtVerify(token, secret);
    email = payload.email as string;
  } catch {
    redirect("/admin/login");
  }

  const kpis = await getAdminKpis();

  const navItems = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard size={16} />,
      active: true,
    },
    {
      label: "Pedidos",
      href: "/admin/orders",
      icon: <ListOrdered size={16} />,
    },
    { label: "Produtos", href: "/admin/products", icon: <Package size={16} /> },
    { label: "Clientes", href: "/admin/customers", icon: <Users size={16} /> },
    {
      label: "Configurações",
      href: "/admin/settings",
      icon: <Settings size={16} />,
    },
  ];

  const recentOrders = kpis.recentOrders ?? [];

  return (
    <div className="flex min-h-screen bg-[#0f0f11] text-zinc-100">
   
      

      {/* MAIN */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* TOPBAR */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-zinc-100">Dashboard</h1>
              <p className="text-xs text-zinc-500 mt-0.5">
                Visão geral da sua loja
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-400">
                <Calendar size={12} />
                Últimos 30 dias
              </div>
              <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-900 flex items-center justify-center text-xs font-semibold text-indigo-400">
                {email.slice(0, 2).toUpperCase()}
              </div>
            </div>
          </div>

          {/* KPI GRID */}
          <div className="grid md:grid-cols-3 gap-3">
            <KpiCard
              title="Pedidos"
              value={kpis.totalOrders}
              icon={<ShoppingCart size={18} />}
              iconBg="bg-violet-500/10"
              iconColor="text-violet-400"
              trendValue="+23%"
              trendType="up"
              subtitle="vs período anterior"
            />
            <KpiCard
              title="Faturamento"
              value={kpis.revenue.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
              icon={<DollarSign size={18} />}
              iconBg="bg-emerald-500/10"
              iconColor="text-emerald-400"
              trendValue="+31%"
              trendType="up"
              subtitle="vs período anterior"
            />
            <KpiCard
              title="Pendentes"
              value={kpis.pendingOrders}
              icon={<Clock size={18} />}
              iconBg="bg-amber-500/10"
              iconColor="text-amber-400"
              trendValue="-8%"
              trendType="down"
              subtitle="vs período anterior"
            />
          </div>

          {/* TABELA DE PEDIDOS */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium text-zinc-200">
                Últimos pedidos
              </h2>
              <Link
                href="/admin/orders"
                className="text-xs text-violet-400 hover:text-violet-300 transition"
              >
                Ver todos →
              </Link>
            </div>

            <div className="bg-[#111113] border border-zinc-800/60 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800/60">
                    {["Pedido", "Cliente", "Data", "Status", "Total", ""].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left text-[11px] font-medium text-zinc-600 uppercase tracking-wide px-4 py-3"
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {(recentOrders as RecentOrder[]).map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-zinc-800/30 hover:bg-zinc-800/20 transition"
                    >
                      <td className="px-4 py-3 font-medium text-zinc-200">
                        #{order._id.toString().slice(-4)}
                      </td>
                      <td className="px-4 py-3 text-zinc-400">
                        {order.customer.name}
                      </td>
                      <td className="px-4 py-3 text-zinc-500 text-xs">
                        {new Date(order.createdAt).toLocaleString("pt-BR")}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center text-[11px] font-medium px-2.5 py-1 rounded-full ${
                            order.status === "pago"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-amber-500/10 text-amber-400"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-zinc-200">
                        {order.total.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                      <td className="px-4 py-3 text-zinc-700">
                        <ChevronRight size={14} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="grid md:grid-cols-3 gap-3">
            {[
              {
                label: "Produtos",
                desc: "Gerenciar catálogo",
                href: "/admin/products",
                icon: <Package size={16} />,
                color: "bg-violet-500/10 text-violet-400",
              },
              {
                label: "Pedidos",
                desc: "Ver todas as vendas",
                href: "/admin/orders",
                icon: <ListOrdered size={16} />,
                color: "bg-emerald-500/10 text-emerald-400",
              },
              {
                label: "Configurações",
                desc: "Em breve",
                href: "#",
                icon: <Settings size={16} />,
                color: "bg-amber-500/10 text-amber-400",
                disabled: true,
              },
            ].map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className={`flex items-center gap-3 bg-[#111113] border border-zinc-800/60 p-4 rounded-xl transition group ${
                  action.disabled
                    ? "opacity-50 pointer-events-none"
                    : "hover:bg-zinc-800/30 hover:border-zinc-700"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${action.color}`}
                >
                  {action.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-200">
                    {action.label}
                  </p>
                  <p className="text-xs text-zinc-600">{action.desc}</p>
                </div>
                <ChevronRight
                  size={14}
                  className="text-zinc-700 group-hover:text-zinc-500 transition"
                />
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
