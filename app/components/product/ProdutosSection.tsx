import type { Product } from "../../types/product";
import { getProducts } from "../../lib/products";
import { ProductGrid } from "./ProductGrid";
import { ProductSkeleton } from "./ProductSkeleton";
import { PriceFilter } from "../filters/PriceFilter";
import { MobileFilterWrapper } from "./MobileFilterWrapper";

interface Props {
  price?: string;
}

export default async function ProdutosSection({ price }: Props) {
  // ✅ Busca produtos (simulação de banco)
  const products: Product[] = await getProducts(price);

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