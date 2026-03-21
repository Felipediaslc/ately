"use client";

import Link from "next/link";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductSkeleton } from "@/components/product/ProductSkeleton";
import type { Product } from "@/app/types/product";
import { CategoryFilter } from "@/components/filters/CategoryFilter";
import { PriceFilter } from "@/components/filters/PriceFilter";
import { MobileFilterWrapper } from "@/components/product/MobileFilterWrapper";

interface Props {
  products: Product[];
  showSeeAllButton?: boolean;
}

export default function ProdutosSection({ products, showSeeAllButton }: Props) {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Título */}
      <div className="flex flex-col items-center mb-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-primary text-center">
          Explore nossos produtos
        </h2>
      </div>

      {/* Mobile Filters */}
      <MobileFilterWrapper />

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
        {/* Sidebar Desktop */}
        <aside className="hidden lg:block space-y-6">
          <PriceFilter />
          <CategoryFilter />
        </aside>

        {/* Produtos */}
        <div className="flex flex-col">
          {products && products.length > 0 ? (
            <>
              <ProductGrid
                products={products.map((p) => ({
                  id: p.id,
                  title: p.title,
                  price: p.price,
                  image: p.images[0] || "/image/produto01.png", // primeira imagem ou fallback
                }))}
              />

              {/* Botão "Ver todos os produtos" só se não estiver em /products */}
              {showSeeAllButton && (
                <div className="text-center mt-6 lg:mt-10">
                  <Link
                    href="/products"
                    className="text-fuchsia-900 bg-transparent border border-fuchsia-900 px-6 py-2 rounded-lg transition"
                  >
                    Ver todos os produtos
                  </Link>
                </div>
              )}
            </>
          ) : (
            <ProductSkeleton count={8} />
          )}
        </div>
      </div>
    </div>
  );
}