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
      
      
      <h2 className="text-center text-sm bg-yellow-100 text-yellow-800 py-2 px-4 rounded-lg mb-6">
         🚧 PageUser provisória — layout ainda em desenvolvimento
      </h2>

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