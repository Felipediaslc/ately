"use client";

import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductSkeleton } from "@/components/product/ProductSkeleton";
import { PriceFilter } from "@/components/filters/PriceFilter";
import { MobileFilterWrapper } from "@/components/product/MobileFilterWrapper";
import type { Product } from "@/app/types/product";

interface Props {
  price?: string;
  products: Product[];
}

export default function ProdutosSection({ price, products }: Props) {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Título centralizado */}
      <div className="flex flex-col items-center mb-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-primary text-center">
          Explore nossos produtos
        </h2>
      </div>

      {/* Mobile Controls */}
      <MobileFilterWrapper />

      {/* Grid principal: sidebar desktop + produtos */}
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block">
          <PriceFilter />
        </aside>

        {/* Grid de produtos ou Skeleton */}
        {products && products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <ProductSkeleton count={8} />
        )}
      </div>
    </div>
  );
}