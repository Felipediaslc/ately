"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { Product } from "@/app/types/product";
import ProdutosSection from "@/components/product/ProdutosSection";
import { getProducts } from "@/app/lib/products";

export default function ProductsClient() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[] | null>(null);

  const price = searchParams.get("price");
  const category = searchParams.get("category");

  useEffect(() => {
    let isMounted = true;

    async function fetchProducts() {
      try {
        const data = await getProducts();

        const priceNumber = Number(price);

        const filtered = data.filter((p) => {
          const matchCategory = category
            ? p.categorySlug === category
            : true;

          const matchPrice =
            price && !isNaN(priceNumber)
              ? p.price <= priceNumber
              : true;

          return matchCategory && matchPrice;
        });

        const formattedProducts: Product[] = filtered.map((p) => ({
          ...p,
          images:
            p.images && p.images.length > 0
              ? p.images
              : ["/image/produto01.png"],
        }));

        if (isMounted) setProducts(formattedProducts);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);

        if (isMounted) setProducts([]);
      }
    }

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [price, category]);

  if (!products) {
    return (
      <div className="py-10 text-center">
        Carregando produtos...
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-10 text-center">
        Nenhum produto encontrado.
      </div>
    );
  }

  return <ProdutosSection products={products} />;
}