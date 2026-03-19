"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getProducts } from "@/app/lib/products";
import ProdutosSection from "./ProdutosSection";
import type { Product } from "@/app/types/product";

export default function HomeProducts() {
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

  return <ProdutosSection products={products} />;
}