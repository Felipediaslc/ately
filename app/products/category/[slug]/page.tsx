import { notFound } from "next/navigation";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getProducts } from "@/app/lib/products";

interface GridProduct {
  productId: string;

  title: string;
  price: number;

  images: string[];

  pixPrice?: number;

  stock: number;
  isUnique: boolean;
  isHandmade: boolean;
  isLimited: boolean;
}

interface Props {
  params: Promise<{ slug: string }>;
}

const categoryNamesMap: Record<string, string> = {
  terco: "Terço",
  imagem: "Imagem",
  mandala: "Mandala",
  chaveiro: "Chaveiro",
  pingente: "Pingente",
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;

  const categoryName = categoryNamesMap[slug] || slug;

  return {
    title: `${categoryName} | SD Ateliê`,
    description: `Confira nossos ${categoryName.toLowerCase()} artesanais exclusivos.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  const products = await getProducts();

  const filteredProducts = products.filter(
    (p) => p.categorySlug === slug
  );

  if (!filteredProducts.length) return notFound();

  const categoryName = categoryNamesMap[slug] || slug;

  const formattedProducts: GridProduct[] = filteredProducts.map((p) => ({
    productId: p.productId.toString(),

    title: p.title,
    price: p.price,

    images: p.images?.length
      ? p.images
      : ["/image/logo.jpeg"],

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