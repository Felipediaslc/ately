import PromoCarousels from "@/components/Promot/PromoCarousels";
import Destaque from "@/components/Destaque/page";
import { getFeaturedProducts } from "@/app/lib/products";
import HomeProducts from "@/components/product/HomeProducts";

export default async function Home() {
  const products = await getFeaturedProducts();
  return (
    <main className="container mx-auto px-4 py-10 lg:px-20">
      <PromoCarousels />
      <Destaque />
      <HomeProducts products={products} />
    </main>
  );
}