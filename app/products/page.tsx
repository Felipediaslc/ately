import Breadcrumb from "@/components/ui/Breadcrumb";
import { Suspense } from "react";
import ClientProducts from "@/components/product/ProductsClient";

export default function ProductsPage() {
  return (
    <main className="max-w-[1800px] mx-auto px-4 py-10 lg:px-6">
    <Breadcrumb />
    <Suspense fallback={<div>Carregando produtos...</div>}>
      <ClientProducts />
    </Suspense>
    </main>
  );
}