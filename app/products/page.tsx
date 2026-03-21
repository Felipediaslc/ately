import Breadcrumb from "@/components/ui/Breadcrumb";
import { Suspense } from "react";
import ClientProducts from "@/components/product/ProductsClient";

export default function ProductsPage() {
  return (
    <main className="container mx-auto px-4 py-10 lg:px-20">
    <Breadcrumb />
    <Suspense fallback={<div>Carregando produtos...</div>}>
      <ClientProducts />
    </Suspense>
    </main>
  );
}