import { ProductCard } from "@/components/product/ProductCard";
import { ProductSkeleton } from "@/components/product/ProductSkeleton";

interface Product {
  productId: string;
   sku?: string;
  images: string[];
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
console.log("🧠 PRODUCTS RAW (CATEGORIA):", products);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => {
  console.log("🖼️ PRODUCT IMAGE DEBUG:", {
    productId: product.productId,
    title: product.title,
    images: product.images,
    firstImage: product.images?.[0],
  });

  return (
    <ProductCard
      key={product.productId}
      product={product}
    />
  );
})}
    </div>
  );
}