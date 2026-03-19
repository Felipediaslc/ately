"use client";

import * as React from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

import { FavoriteButton } from "@/components/product/FavoriteButton";
import { QuantitySelector } from "@/components/filters/SortSelect";
import { ProductGrid } from "@/components/product/ProductGrid";

interface Product {
  id: string;
  title: string;
  price: number;
  pixPrice?: number;
  installment?: string;
  images: string[];
  description?: string;
  relatedProducts?: Product[];
}

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default function ProductPage({ params }: Props) {
  const resolvedParams = React.use(params); // ✅ resolve a Promise
  const { id } = resolvedParams;

  // MOCK do produto
  const [product, setProduct] = React.useState<Product | null>(null);

  React.useEffect(() => {
    const mockProduct: Product = {
      id,
      title: "Imagem de Nossa Senhora Aparecida",
      price: 89.9,
      pixPrice: 85.41,
      installment: "3x de R$29,97 sem juros",
      images: ["/image/produto01.png", "/image/produto01tras.png"],
      description: "Descrição detalhada do produto com todas as informações.",
      relatedProducts: [
        {
          id: "2",
          title: "Brinco Pérola Alongada Dourado",
          price: 89.9,
          images: ["/image/produto02.png"],
        },
        {
          id: "3",
          title: "Brinco Pérola Alongada Prateado",
          price: 89.9,
          images: ["/image/produto03.png"],
        },
      ],
    };
    setProduct(mockProduct);
  }, [id]);

  // Slider Embla
  const autoplay = React.useMemo(() => Autoplay({ delay: 4000, stopOnInteraction: false }), []);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [autoplay]);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

 React.useEffect(() => {
  if (!emblaApi) return;

  const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());

  emblaApi.on("select", onSelect);
  onSelect();

  return () => {
    emblaApi.off("select", onSelect); // ✅ sem retornar nada
  };
}, [emblaApi]);

  const scrollTo = (index: number) => emblaApi?.scrollTo(index);

  if (!product) return <div>Carregando...</div>;

  return (
    <main className="container mx-auto px-4 py-10 lg:px-20">
      {/* Galeria + Informações */}
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Galeria */}
        <div className="lg:w-1/2">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {product.images.map((src, idx) => (
                <div key={idx} className="min-w-full flex-shrink-0 relative h-[400px] lg:h-[500px]">
                  <Image src={src} alt={`${product.title} - ${idx + 1}`} fill className="object-contain" />
                </div>
              ))}
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2 mt-4 justify-center">
            {product.images.map((src, idx) => (
              <button key={idx} onClick={() => scrollTo(idx)}>
                <Image
                  src={src}
                  alt={`thumb-${idx}`}
                  width={60}
                  height={60}
                  className={`border rounded transition ${
                    selectedIndex === idx ? "border-fuchsia-900" : "border-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Informações */}
        <div className="lg:w-1/2 flex flex-col gap-6">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-semibold text-primary">{product.title}</h1>
            <FavoriteButton />
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-2xl font-bold text-black">R$ {product.price}</p>
            {product.installment && <p className="text-sm text-primary">{product.installment}</p>}
            {product.pixPrice && <p className="text-sm text-gray-400 line-through">R$ {product.pixPrice} com Pix</p>}
          </div>

          {product.description && (
            <div className="text-sm text-gray-700 leading-relaxed">{product.description}</div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mt-4">
            <QuantitySelector />
            <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-all duration-200 hover:scale-105">
              Adicionar ao carrinho
            </button>
          </div>
        </div>
      </div>

      {/* Produtos relacionados */}
      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-primary mb-6">Produtos Relacionados</h2>
          <ProductGrid
            products={product.relatedProducts.map((p) => ({
              id: p.id,
              title: p.title,
              price: p.price,
              image: p.images[0],
            }))}
          />
        </section>
      )}
    </main>
  );
}