import PromoCarousels from "@/components/Promot/PromoCarousels";
import Destaque from "@/components/Destaque/page";
import { getFeaturedProducts } from "@/app/lib/products";
import HomeProducts from "@/components/product/HomeProducts";

export default async function Home() {
  const products = await getFeaturedProducts();
  return (
    <main className="container  mx-auto px-0.2 py-0  ">
      <PromoCarousels />
      <Destaque />
      <HomeProducts products={products} />
    </main>
  );
}