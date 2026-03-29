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
  params: Promise<{ slug: string }>;
}

// 🔹 Mapa de nomes reais das categorias (com acentos)
const categoryNamesMap: Record<string, string> = {
  terco: "Terço",
  imagem: "Imagem",
  biblia: "Bíblia",
  cruz: "Cruz",
  vela: "Vela",
  decoracao: "Decoração",
};

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  // 🔹 busca produtos
  const products = await getProducts(undefined, slug);

  if (!products.length) return notFound();

  // 🔹 nome correto da categoria
  const categoryName = categoryNamesMap[slug] || slug;

  // 🔥 FORMATAÇÃO CORRIGIDA (ESSENCIAL)
  const formattedProducts: GridProduct[] = products.map((p) => ({
    id: p.id,
    title: p.title,
    price: p.price,
    image: p.images?.[0] || "/image/produto01.png",
    pixPrice: p.pixPrice,

    // ✅ novos campos
    stock: p.stock ?? 0,
    isUnique: p.isUnique ?? false,
    isHandmade: p.isHandmade ?? false,
    isLimited: p.isLimited ?? false,
  }));

  return (
    <main className="container mx-auto px-4 py-10 lg:px-20">
      {/* Breadcrumb */}
      <Breadcrumb categoryName={categoryName} categorySlug={slug} />

      {/* Título */}
      <h1 className="text-2xl font-semibold mb-6">
        {categoryName}
      </h1>

      {/* Grid */}
      <ProductGrid products={formattedProducts} />
    </main>
  );
}