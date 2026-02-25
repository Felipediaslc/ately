import { ProductCard } from "./ProductCard";
import { ProductSkeleton } from "./ProductSkeleton";

interface Product {
  id: string;
  image: string;
  title: string;
  price: number;
}

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

export function ProductGrid({ products = [], isLoading = false }: ProductGridProps) {
  if (isLoading || products.length === 0) {
    return <ProductSkeleton count={8} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}