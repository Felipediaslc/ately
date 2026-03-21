import { notFound } from "next/navigation";
import ProductDetails from "@/components/product/ProductDetails";
import { getProductById } from "@/app/lib/products";
import Breadcrumb from "@/components/ui/Breadcrumb";

interface Props {
  params: Promise<{ id: string }>;
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

export default async function ProductPage({ params }: Props) {
  const { id } = await params;

  const product = await getProductById(id);

  if (!product) return notFound();

  // 🔹 Categoria com nome correto
  const categoryName = categoryNamesMap[product.categorySlug] || product.category;

  return (
    <main className="container mx-auto px-4 py-10 lg:px-20">
      <Breadcrumb
        categoryName={categoryName}
        categorySlug={product.categorySlug}
        productName={product.title}
      />

      <ProductDetails product={product} />
    </main>
  );
}