import Link from "next/link";
import { cookies } from "next/headers";

import { Package, Plus,  Pencil } from "lucide-react";

type Product = {
  _id: string;
  title: string;
  price: number;
};

async function getProducts(): Promise<Product[]> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/admin/products`,
      {
        method: "GET",
        headers: { Cookie: cookieHeader },
        cache: "no-store",
      },
    );

    if (!res.ok) return [];
    const json = await res.json();
    if (!json.success || !Array.isArray(json.data)) return [];
    return json.data;
  } catch {
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-[#0f0f11] text-zinc-100 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-zinc-100">Produtos</h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              {products.length} produto{products.length !== 1 ? "s" : ""}{" "}
              cadastrado{products.length !== 1 ? "s" : ""}
            </p>
          </div>

          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 bg-sky-800/10 border border-sky-800/20 text-sky-400 hover:bg-sky-800/20 hover:border-sky-800/40 hover:text-sky-300 px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            <Plus size={15} />
            Novo Produto
          </Link>
        </div>

        {/* TABELA */}
        <div className="bg-[#111113] border border-zinc-800/60 rounded-xl overflow-hidden">
          {/* THEAD */}
          <div className="grid grid-cols-[1fr_auto_auto] border-b border-zinc-800/60 px-4 py-2.5">
            <span className="text-[11px] font-medium text-zinc-600 uppercase tracking-wide">
              Produto
            </span>
            <span className="text-[11px] font-medium text-zinc-600 uppercase tracking-wide text-right pr-12">
              Preço
            </span>
          </div>

          {products.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-zinc-600">
              <Package size={28} />
              <p className="text-sm">Nenhum produto encontrado</p>
              <Link
                href="/admin/products/new"
                className="text-xs text-violet-400 hover:text-violet-300 transition mt-1"
              >
                Criar primeiro produto →
              </Link>
            </div>
          )}

          {products.map((p, i) => (
            <div
              key={p._id}
              className={`grid grid-cols-[1fr_auto_auto] items-center px-4 py-3.5 hover:bg-zinc-800/20 transition ${
                i !== products.length - 1 ? "border-b border-zinc-800/30" : ""
              }`}
            >
              <div>
                <p className="text-sm font-medium text-zinc-200">{p.title}</p>
              </div>

              <p className="text-sm text-zinc-400 text-right pr-8">
                {p.price.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>

              <Link
                href={`/admin/products/${p._id}`}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-sky-800/10 border border-sky-800/20 text-sky-400 hover:bg-sky-800/20 hover:border-sky-800/40 hover:text-sky-300 transition-all duration-200"
              >
                <Pencil size={12} />
                Editar
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
