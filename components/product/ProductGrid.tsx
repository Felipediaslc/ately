import { ProductCard } from "@/components/product/ProductCard";
import { ProductSkeleton } from "@/components/product/ProductSkeleton";

interface Product {
  id: string;
  image: string;
  title: string;
  price: number;
  pixPrice?: number;

  stock: number;
  isUnique: boolean;
  isHandmade: boolean;
  isLimited: boolean;
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style={{ alignItems: "start" }}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}