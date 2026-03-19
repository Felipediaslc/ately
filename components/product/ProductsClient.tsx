"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { Product } from "@/app/types/product";
import ProdutosSection from "@/components/product/ProdutosSection";
import { getProducts } from "@/app/lib/products";

export default function ProductsClient() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);

  const price = searchParams.get("price") || "";
  const category = searchParams.get("category") || "";

  useEffect(() => {
    async function fetchProducts() {
      const data = await getProducts(price, category);
      setProducts(data);
    }
    fetchProducts();
  }, [price, category]);

  return  (
    <main className="container mx-auto px-4 py-10 lg:px-20">
      <ProdutosSection products={products} />
    </main>
  );
}