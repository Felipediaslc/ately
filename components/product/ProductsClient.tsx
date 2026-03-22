"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { Product } from "@/app/types/product";
import ProdutosSection from "@/components/product/ProdutosSection";
import { getProducts } from "@/app/lib/products";





export default function ProductsClient() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[] | null>(null);

  const price = searchParams.get("price") ?? "";
  const category = searchParams.get("category") ?? "";

  useEffect(() => {
    let isMounted = true;

    async function fetchProducts() {
      const data = await getProducts(price, category);

      // 🔹 Garantir que todos os produtos tenham pelo menos uma imagem
      const formattedProducts: Product[] = data.map((p) => ({
        ...p,
        images: p.images?.length ? p.images : ["/image/produto01.png"],
      }));

      if (isMounted) setProducts(formattedProducts);
    }

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [price, category]);

  if (!products) {
    return (
      <main className="container mx-auto px-4 py-10 lg:px-20">
        <div>Carregando produtos...</div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-10 lg:px-20">
      <ProdutosSection products={products} />
    </main>
  );
}