import Destaque from "@/components/Destaque";
import Promot from "@/components/Promot";
import ProdutosSection from "@/components/product/ProdutosSection";
import { getProducts } from "@/app/lib/products";

export default async function Home({ searchParams }: { searchParams: Promise<{ price?: string }> }) {
  const params = await searchParams; // ✅ await para "desempacotar" a Promise
  const price = params?.price;
  const products = await getProducts(price); // fetch no server

  return (
    <div>
      <Promot />
      <Destaque />
      <ProdutosSection price={price} products={products} />
    </div>
  );
}