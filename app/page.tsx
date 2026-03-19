import { Suspense } from "react";
import PromoCarousels from "@/components/Promot/PromoCarousels";
import Destaque from "@/components/Destaque/page";
import HomeProducts from "@/components/product/HomeProducts";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-10 lg:px-20">
   
      <PromoCarousels />

    
      <Destaque />

      
      <Suspense fallback={<div>Carregando produtos...</div>}>
        <HomeProducts />
      </Suspense>
    </main>
  );
}