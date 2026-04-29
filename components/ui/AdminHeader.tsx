"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, ListOrdered, Package,  LogOut } from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactElement;
  disabled?: boolean;
};

const navItems:NavItem[] = [
  
  { label: "Pedidos", href: "/admin/orders", icon: <ListOrdered size={15} /> },
  { label: "Produtos", href: "/admin/products", icon: <Package size={15} /> },
];

export default function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-[#0f0f11] backdrop-blur">
      <div className="flex items-center justify-between px-6 py-3">

        {/* LEFT - BRAND + NAV */}
        
        <div className="flex items-center gap-6">
          <Link href="/admin" className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-sky-800 rounded-md flex items-center justify-center">
              <LayoutDashboard size={13} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-zinc-200"> Painel Admin</span>
          </div>
</Link>
          <nav className="hidden md:flex items-center gap-0.5 text-sm">
            {navItems.map((item) =>
              item.disabled ? (
                <span
                  key={item.label}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-zinc-700 cursor-not-allowed text-sm"
                >
                  {item.icon}
                  {item.label}
                </span>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition text-sm ${
                    isActive(item.href)
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              )
            )}
          </nav>
        </div>

        {/* RIGHT */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition px-3 py-1.5 rounded-md border border-zinc-800 hover:border-zinc-700 bg-zinc-900/30"
        >
          <LogOut size={14} />
          Sair
        </button>

      </div>
    </header>
  );
}