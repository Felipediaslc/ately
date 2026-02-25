import { getProducts } from "../../lib/products";
import { ProductGrid } from "./ProductGrid";
import { PriceFilter } from "../filters/PriceFilter";
import { MobileFilterWrapper } from "./MobileFilterWrapper";

interface Props {
  price?: string;
}

export async function ProdutosSection({ price }: Props) {
  const products = await getProducts(price);

  return (
    <div className="container mx-auto px-4 py-8">
      
      {/* Título centralizado, igual à seção destaque */}
      <div className="flex flex-col items-center mb-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-primary text-center">
          Explore nossos produtos
        </h2>
      </div>

      {/* Mobile Controls */}
      <MobileFilterWrapper />

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
        
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block">
          <PriceFilter />
        </aside>

        <ProductGrid products={products} />
      </div>
    </div>
  );
}