import Destaque from "./components/Destaque/page";
import Promot from "./components/Promot/page";
import ProdutosSection from "./components/product/ProdutosSection";

interface PageProps {
  searchParams: Promise<{
    price?: string;
  }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <div>
      <Promot />
      <Destaque />
      <ProdutosSection price={params?.price} />
    </div>
  );
}
