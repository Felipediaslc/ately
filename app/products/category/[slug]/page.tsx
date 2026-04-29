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
  params: Promise<{ slug: string }>; // ✅ Next 16
}

const categoryNamesMap: Record<string, string> = {
  terco: "Terço",
  imagem: "Imagem",
  mandala: "Mandala",
  chaveiro: "Chaveiro",
  pingente: "Pingente",
};

//
// 🔥 SEO POR CATEGORIA (NOVO)
//
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;

  const categoryName = categoryNamesMap[slug] || slug;

  return {
    title: `${categoryName} | SD Ateliê`,
    description: `Confira nossos ${categoryName.toLowerCase()} artesanais exclusivos.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  // ✅ Next 16 (await obrigatório)
  const { slug } = await params;

  // 🔹 busca produtos
  const products = await getProducts();

  // 🔹 filtra por categoria
  const filteredProducts = products.filter(
    (p) => p.categorySlug === slug
  );

  // ✅ valida corretamente
  if (!filteredProducts.length) return notFound();

  // 🔹 nome da categoria
  const categoryName = categoryNamesMap[slug] || slug;

  // 🔹 formatação pro grid
  const formattedProducts: GridProduct[] = filteredProducts.map((p) => ({
    id: p._id,
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