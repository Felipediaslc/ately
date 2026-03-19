import { Suspense } from "react";
import ClientProducts from "@/components/product/ProductsClient";

export default function ProductsPage() {
  return (
    <main className="container mx-auto px-4 py-10 lg:px-20">
      <Suspense fallback={<div>Carregando produtos...</div>}>
        <ClientProducts />
      </Suspense>
    </main>
  );
}