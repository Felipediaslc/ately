/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";

const frases = [
  [
    { texto: "FRETE", cor: "text-senary" },
    { texto: " GRÁTIS ", cor: "text-senary" },
    { texto: " na", cor: "text-secundary" },
    { texto: " sua", cor: "text-secundary" },
    { texto: " compra!", cor: "text-secundary" },
    
  ],
  [
    { texto: "Aproveite:", cor: "text-secundary" },
    { texto: " comprando a ", cor: "text-secundary" },
    { texto: " partir", cor: "text-secundary" },
    { texto: " de", cor: "text-secundary" },
    { texto: " R$199,00!", cor: "text-senary" }
  ],
   [
    { texto: "você", cor: "text-secundary" },
    { texto: " ganha", cor: "text-senary" },
    
  ]
];




const imagens = [
  "/advogy.png",
  "/bannerys.png",
  "/escritup.png",
  // Ajuste os caminhos caso necessário, imagens na pasta /public/images/
];

export default function PromoCarousels() {
  const [emblaTextRef] = useEmblaCarousel(
    { loop: true, containScroll: false, align: "center" },
    [Autoplay({ delay: 3000, stopOnInteraction: false }), Fade()]
  );

  const [emblaImgRef, emblaImgApi] = useEmblaCarousel(
    { loop: true },
    [Autoplay({ delay: 3500, stopOnInteraction: false })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaImgApi) return;
    setSelectedIndex(emblaImgApi.selectedScrollSnap());
  }, [emblaImgApi]);

  useEffect(() => {
    if (!emblaImgApi) return;
    emblaImgApi.on("select", onSelect);
    onSelect();
  }, [emblaImgApi, onSelect]);

  const scrollPrev = () => emblaImgApi && emblaImgApi.scrollPrev();
  const scrollNext = () => emblaImgApi && emblaImgApi.scrollNext();
  const scrollTo = (index: number) => emblaImgApi && emblaImgApi.scrollTo(index);

  return (
    <section className="w-full flex flex-col gap-0">
      {/* Frases faixa preta */}
      <div className="w-full bg-lime-500 text-white py-0.5 select-none">
  <div ref={emblaTextRef} className="relative overflow-hidden h-8">
        <div className="flex">
      {frases.map((frase, idx) => (
        <div
          key={idx}
          className="absolute w-full font-author top-2.5 left-0 flex  items-center justify-center font-bold text-xs  uppercase tracking-wider px-3 opacity-0 transition-opacity duration-1000"
        >
          <span>
            {frase.map((item, itemIdx) => (
              <span key={itemIdx} className={item.cor}>
                {item.texto}
              </span>
            ))}
          </span>
        </div>
      ))}
    </div>
  </div>
</div>

      {/* Carrossel de imagens */}
      <div className="relative w-full h-[70vh] flex-1 mx-auto bg-transparent max-w-full overflow-hidden">
        <div className="overflow-hidden h-full" ref={emblaImgRef}>
          <div className="flex h-full">
            {imagens.map((src, idx) => (
              <div
                key={idx}
                className="min-w-full flex-shrink-0 flex items-center justify-center h-[70vh]"
              >
                <img
                  src={src}
                  alt={`oferta-${idx + 1}`}
                  className="w-full h-[70vh] object-cover"
                  draggable={false}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Botões */}
        <button
          className="absolute top-1/2 left-2 -translate-y-1/2 bg-transparent rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition"
          onClick={scrollPrev}
          aria-label="Anterior"
          type="button"
        >
          <svg className="w-6 h-6 text-secundary" viewBox="0 0 20 20" fill="currentColor">
            <path d="M12.7 15.3a1 1 0 01-1.4 0l-5-5a1 1 0 010-1.4l5-5a1 1 0 111.4 1.4L9.42 9H17a1 1 0 110 2H9.42l3.29 3.29a1 1 0 010 1.42z" />
          </svg>
        </button>
        <button
          className="absolute top-1/2 right-2 -translate-y-1/2 bg-transparent rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition"
          onClick={scrollNext}
          aria-label="Próximo"
          type="button"
        >
          <svg className="w-6 h-6 text-secundary" viewBox="0 0 20 20" fill="currentColor">
            <path d="M7.3 4.7a1 1 0 010 1.4L4 9.42V9a1 1 0 10-2 0v2a1 1 0 001 1h7.58l-3.3 3.3a1 1 0 001.42 1.42l5-5a1 1 0 000-1.42l-5-5a1 1 0 00-1.42 1.42z" />
          </svg>
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-3">
          {imagens.map((_, idx) => (
            <button
              key={idx}
              className={`w-3 h-3 rounded-full ${
                selectedIndex === idx ? "bg-quinary" : "bg-quaternary"
              } transition`}
              onClick={() => scrollTo(idx)}
              aria-label={`Ir para slide ${idx + 1}`}
              type="button"
            />
          ))}
        </div>
      </div>
    </section>
  );
}