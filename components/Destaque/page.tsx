"use client";

import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { Heart } from "lucide-react";
import { useCart } from "@/app/context/cart/CartContext"; // 👈 IMPORTANTE

type Product = {
  id: number;
  image: string;
  title: string;
  price: string;
  installment: string;
  pixPrice: string;
};

export default function FeaturedProducts() {
  const { addToCart } = useCart(); // 👈 HOOK DO CARRINHO

  const autoplay = React.useMemo(() => {
    return Autoplay({
      delay: 3000,
      stopOnInteraction: false,
    });
  }, []);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [autoplay]);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);
  const [favorites, setFavorites] = React.useState<number[]>([]);

  // 
  const [addedId, setAddedId] = React.useState<number | null>(null);

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


  // 🔥 Função de compra
  const handleAddToCart = (product: Product) => {
    const priceNumber = Number(
      product.price.replace("R$", "").replace(",", ".")
    );

    addToCart({
      id: String(product.id),
      title: product.title,
      price: priceNumber,
      image: product.image,
    });

    // feedback visual
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1200);
  };

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
      <div className="mb-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-primary">
          Destaque
        </h2>
      </div>

      <div className="overflow-hidden py-4" ref={emblaRef}>
        <div className="flex">
          {products.map((product) => {
            const isFavorite = favorites.includes(product.id);
            const isAdded = addedId === product.id;

            return (
              <div
                key={product.id}
                className="flex-[0_0_95%] sm:flex-[0_0_90%] md:flex-[0_0_33.33%] lg:flex-[0_0_25%] px-3"
              >
                <div className="bg-[#ffffff] rounded-lg flex flex-col transition hover:shadow-lg">
                  {/* IMAGEM */}
                  <div className="relative w-full h-64 rounded-lg overflow-hidden group">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw" // 👈 resolve warning
                      className="object-contain p-6 group-hover:scale-105 transition"
                    />

                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className="absolute bottom-4 right-4 p-2"
                    >
                      <Heart
                        size={20}
                        className={`transition ${
                          isFavorite
                            ? "fill-fuchsia-900 text-fuchsia-900"
                            : "text-primary"
                        }`}
                      />
                    </button>
                  </div>

                  {/* CONTEÚDO */}
                  <div className="mt-4 space-y-1">
                    <h3 className="text-sm font-medium text-primary">
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

                    {/* BOTÃO */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      className={`mt-3 w-full py-2 text-sm rounded-md font-medium transition-all
                        ${
                          isAdded
                            ? "bg-green-800 scale-95"
                            : "bg-green-600 hover:bg-green-700 hover:scale-105"
                        } text-white`}
                    >
                      {isAdded ? "Adicionado ✓" : "Comprar"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center mt-6 gap-2">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`w-3 h-3 rounded-full ${
              index === selectedIndex
                ? "bg-gray-800 scale-110"
                : "bg-gray-400/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

 