"use client";

import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { Heart } from "lucide-react";

type Product = {
  id: number;
  image: string;
  title: string;
  price: string;
  installment: string;
  pixPrice: string;
};

export default function FeaturedProducts() {
  // 🔹 Autoplay estabilizado
  const autoplay = React.useMemo(() => {
    return Autoplay({
      delay: 3000,
      stopOnInteraction: false,
    });
  }, []);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [autoplay]);

  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);

  // 🔥 Estado centralizado de favoritos (padrão real)
  const [favorites, setFavorites] = React.useState<number[]>([]);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id],
    );
  };

  const products: Product[] = [
    {
      id: 1,
      image: "/image/produto01.png",
      title: "Brinco Oval com Pérolas Dourado",
      price: "R$59,90",
      installment: "2x de R$29,95 sem juros",
      pixPrice: "R$56,91 com Pix",
    },
    {
      id: 2,
      image: "/image/produto02.png",
      title: "Brinco Pérola Alongada Dourado",
      price: "R$89,90",
      installment: "3x de R$29,97 sem juros",
      pixPrice: "R$85,41 com Pix",
    },
    {
      id: 3,
      image: "/image/produto03.png",
      title: "Brinco Pérola Alongada Prateado",
      price: "R$89,90",
      installment: "3x de R$29,97 sem juros",
      pixPrice: "R$85,41 com Pix",
    },
    {
      id: 4,
      image: "/image/produto04.png",
      title: "Brinco Mini Gotas Dourado Aço Inox",
      price: "R$59,90",
      installment: "2x de R$29,95 sem juros",
      pixPrice: "R$56,91 com Pix",
    },
    {
      id: 5,
      image: "/image/produto05.png",
      title: "Brinco Mini Gotas Prateado Aço Inox",
      price: "R$59,90",
      installment: "2x de R$29,95 sem juros",
      pixPrice: "R$56,91 com Pix",
    },
    {
      id: 6,
      image: "/image/produto06.png",
      title: "Brinco Mini Gotas Dourado Aço Inox",
      price: "R$59,90",
      installment: "2x de R$29,95 sem juros",
      pixPrice: "R$56,91 com Pix",
    },
    {
      id: 7,
      image: "/image/produto07.png",
      title: "Brinco Mini Gotas Prateado Aço Inox",
      price: "R$59,90",
      installment: "2x de R$29,95 sem juros",
      pixPrice: "R$56,91 com Pix",
    },
  ];

  // 🔹 Atualiza índice e snaps
  React.useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    const onInit = () => {
      setScrollSnaps(emblaApi.scrollSnapList());
    };

    onInit();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onInit);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onInit);
    };
  }, [emblaApi]);

  const scrollTo = React.useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index);
    },
    [emblaApi],
  );

  return (
    <section className="w-full bg-[#ffffff] py-12 px-6 lg:px-20">
      {/* Cabeçalho */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-primary">
          Destaque
        </h2>
      </div>

      {/* Carrossel */}
      <div className="overflow-hidden py-4" ref={emblaRef}>
        <div className="flex">
          {products.map((product) => {
            const isFavorite = favorites.includes(product.id);

            return (
              <div
                key={product.id}
                className="flex-[0_0_95%] sm:flex-[0_0_90%] md:flex-[0_0_33.33%] lg:flex-[0_0_25%] px-3"
              >
                <div className="bg-[#ffffff]  rounded-lg flex flex-col">
                  {/* Imagem */}
                  <div className="relative w-full h-64 bg-[#ffffff] rounded-lg overflow-hidden flex items-center justify-center group">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* ❤️ Ícone profissional */}
                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className="absolute bottom-4 right-4 bg-transparent p-2  hover:scale-110 transition"
                    >
                      <Heart
                        size={20}
                        className={`transition-colors ${
                          isFavorite
                            ? "fill-red-500 text-red-500"
                            : "text-primary"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Conteúdo */}
                  <div className="mt-4 space-y-1">
                    <h3 className="text-sm font-medium text-primary leading-snug">
                      {product.title}
                    </h3>

                    <p className="text-lg font-bold text-black">
                      {product.price}
                    </p>

                    <p className="text-xs text-primary">
                      {product.installment}
                    </p>

                    <p className="text-xs text-gray-400 line-through">
                      {product.pixPrice}
                    </p>

                    <button
                      className=" mt-3
                                  w-32
                                  sm:w-36
                                  lg:w-[7vw]
                                  py-1.5
                                  text-sm
                                bg-green-600
                                hover:bg-green-700
                                text-[#ffffff] 
                                font-medium    
                                     
                                 rounded-md
                                transition">
                                 Comprar
                                </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center mt-6 gap-2">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === selectedIndex
                ? "bg-gray-800 scale-110"
                : "bg-gray-400/60 hover:bg-gray-500"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
