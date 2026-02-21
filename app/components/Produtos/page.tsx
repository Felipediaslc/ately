"use client"
import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

export default function FeaturedProducts() {
  // 🔹 Autoplay estabilizado (não recria a cada render)
  const autoplay = React.useMemo(() => {
    return Autoplay({
      delay: 3000,
      stopOnInteraction: false,
    });
  }, []);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true },
    [autoplay]
  );

  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);

  const products = [
    { image: "/image/produto04.png", title: "Painting of tiger", author: "Jhone smith", price: "From $90.00" },
    { image: "/image/produto05.png", title: "Painting of tiger", author: "Jhone smith", price: "From $90.00" },
    { image: "/image/produto06.png", title: "Painting of tiger", author: "Jhone smith", price: "From $90.00" },
    { image: "/image/produto07.png", title: "Painting of tiger", author: "Jhone smith", price: "From $90.00" },
    { image: "/image/produto04.png", title: "Painting of tiger", author: "Jhone smith", price: "From $90.00" },
    { image: "/image/produto05.png", title: "Painting of tiger", author: "Jhone smith", price: "From $90.00" },
    { image: "/image/produto06.png", title: "Painting of tiger", author: "Jhone smith", price: "From $90.00" },
    { image: "/image/produto07.png", title: "Painting of tiger", author: "Jhone smith", price: "From $90.00" },
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

  // 🔹 Função memoizada para navegação
  const scrollTo = React.useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index);
    },
    [emblaApi]
  );

  return (
    <section className="w-full bg-amber-50 py-12 px-6 lg:px-20">
      {/* Cabeçalho */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold font-author text-secondary">
          <br /> Destaque
        </h2>
       { /*<div className="mt-4 lg:mt-0 max-w-lg text-secondary">
          <p className="mb-4 text-sm sm:text-base font-author">
            Agende visitas online, negocie sem intermediários e assine o contrato
            digitalmente. Sem fiador. Sem depósito caução. Sem filas.
          </p>
          <a
            href="#"
            className="font-author inline-block px-6 py-3 bg-quinary/70 text-gray-800 font-medium rounded-full shadow hover:bg-primary/50 transition-colors text-sm sm:text-base"
          >
            See All Collection
          </a>
        </div>*/}
      </div>

      {/* Carrossel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {products.map((product, index) => (
            <div
              key={index}
              className="flex-[0_0_95%] sm:flex-[0_0_90%] md:flex-[0_0_33.33%] lg:flex-[0_0_25%] px-2"
            >
              <div className="bg-white rounded-xl shadow-lg shadow-gray-300 overflow-hidden flex flex-col">
                <div className="relative w-full h-52 sm:h-60">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className=""
                  />
                </div>
                <div className="p-4 font-author flex flex-col flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-quinary">
                    {product.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">
                    By {product.author}
                  </p>
                  <span className="mt-2 text-quinary font-author font-semibold text-sm sm:text-base">
                    {product.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots de navegação */}
      <div className="flex justify-center mt-6 gap-2">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === selectedIndex
                ? "bg-secondary scale-110"
                : "bg-secondary/60 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

