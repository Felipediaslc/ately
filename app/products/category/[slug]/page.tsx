import { notFound } from "next/navigation";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getProducts } from "@/app/lib/products";

interface GridProduct {
  id: string;
  title: string;
  price: number;
  image: string;
  pixPrice?: number;

  stock: number;
  isUnique: boolean;
  isHandmade: boolean;
  isLimited: boolean;
}

interface Props {
  params: { slug: string }; // ✅ corrigido
}

const categoryNamesMap: Record<string, string> = {
  terco: "Terço",
  imagem: "Imagem",
  mandala: "Mandala",
  chaveiro: "Chaveiro",
  pingente: "Pingente",
};

export default async function CategoryPage({ params }: Props) {
  const { slug } = params; // ✅ sem await

  // 🔹 busca produtos
  const products = await getProducts();

  // 🔹 filtra
  const filteredProducts = products.filter(
    (p) => p.categorySlug === slug
  );

  // ✅ valida corretamente
  if (!filteredProducts.length) return notFound();

  // 🔹 nome da categoria
  const categoryName = categoryNamesMap[slug] || slug;

  // 🔥 formatação correta
  const formattedProducts: GridProduct[] = filteredProducts.map((p) => ({
    id: p.id,
    title: p.title,
    price: p.price,
    image: p.images?.[0] || "/image/produto01.png",
    pixPrice: p.pixPrice,

    stock: p.stock ?? 0,
    isUnique: p.isUnique ?? false,
    isHandmade: p.isHandmade ?? false,
    isLimited: p.isLimited ?? false,
  }));

  return (
    <main className="container mx-auto px-4 py-10 lg:px-20">
      <Breadcrumb categoryName={categoryName} categorySlug={slug} />

      <h1 className="text-2xl font-semibold mb-6">
        {categoryName}
      </h1>

      <ProductGrid products={formattedProducts} />
    </main>
  );
}