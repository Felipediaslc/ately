"use client";

import Link from "next/link";
import { ProductGrid } from "@/components/product/ProductGrid";
import type { Product } from "@/app/types/product";

interface Props {
  products: Product[];
}

export default function HomeProducts({ products }: Props) {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Título */}
      <div className="flex flex-col items-center mb-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-primary text-center">
          Explore nossos produtos
        </h2>
      </div>

      {/* Grid */}
      <ProductGrid
        products={products.map((p) => ({
          id: p.id,
          title: p.title,
          price: p.price,
          image: p.images[0] || "/image/produto01.png",
         
          pixPrice: p.pixPrice,

          // ✅ NOVO (consistência total)
          stock: p.stock,
          isUnique: p.isUnique,
          isLimited: p.isLimited,
          isHandmade: p.isHandmade,
        }))}
      />

      {/* Botão */}
      <div className="text-center mt-6 lg:mt-10">
        <Link
          href="/products"
          className="text-fuchsia-900 border border-fuchsia-900 px-6 py-2 rounded-lg transition hover:bg-fuchsia-900 hover:text-white"
        >
          Ver todos os produtos
        </Link>
      </div>
    </div>
  );
}