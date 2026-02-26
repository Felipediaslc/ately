
"use client";

import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";



const imagens = [
  {
    desktop: "/image/bannerDesktop.png",
    mobile: "/image/bannerMobile.png",
  },
  {
    desktop: "/image/banner2Desktop.png",
    mobile: "/image/banner02Mobile.jpeg",
  },
  {
   desktop: "/image/bannerDesktop.png",
    mobile: "/image/bannerMobile.png",
  },
];

export default function PromoCarousels() {
  const [emblaImgRef, emblaImgApi] = useEmblaCarousel(
    { loop: true },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
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

  const scrollPrev = () => emblaImgApi?.scrollPrev();
  const scrollNext = () => emblaImgApi?.scrollNext();
  const scrollTo = (index: number) => emblaImgApi?.scrollTo(index);

  return (
    <section className="
         w-full flex flex-col">

     

      {/* 🎯 CARROSSEL */}
      <div className="relative w-full h-[70vh] overflow-hidden">
        <div className="overflow-hidden h-full" ref={emblaImgRef}>
          <div className="flex h-full">
            {imagens.map((src, idx) => (
              <div
                key={idx}
                className="min-w-full flex-shrink-0 flex items-center justify-center h-[70vh]"
              >
                <picture className="w-full h-full">
                  <source media="(min-width: 768px)" srcSet={src.desktop} />
                  <img
                    src={src.mobile}
                    alt={`oferta-${idx + 1}`}
                    className="w-full h-[70vh] "
                    draggable={false}
                  />
                </picture>
              </div>
            ))}
          </div>
        </div>

        {/* BOTÕES */}
        <button
          className="absolute top-1/2 left-4 -translate-y-1/2"
          onClick={scrollPrev}
        >
          <svg className="w-6 h-6 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path d="M12.7 15.3a1 1 0 01-1.4 0l-5-5a1 1 0 010-1.4l5-5a1 1 0 111.4 1.4L9.42 9H17a1 1 0 110 2H9.42l3.29 3.29a1 1 0 010 1.42z" />
          </svg>
        </button>

        <button
          className="absolute top-1/2 right-4 -translate-y-1/2"
          onClick={scrollNext}
        >
          <svg className="w-6 h-6 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path d="M7.3 4.7a1 1 0 010 1.4L4 9.42V9a1 1 0 10-2 0v2a1 1 0 001 1h7.58l-3.3 3.3a1 1 0 001.42 1.42l5-5a1 1 0 000-1.42l-5-5a1 1 0 00-1.42 1.42z" />
          </svg>
        </button>

        {/* DOTS */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-3">
          {imagens.map((_, idx) => (
            <button
              key={idx}
              className={`w-3 h-3 rounded-full ${
                selectedIndex === idx ? "bg-white" : "bg-white/50"
              } transition`}
              onClick={() => scrollTo(idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}