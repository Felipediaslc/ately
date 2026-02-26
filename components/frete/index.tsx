"use client";

import { useRef, useEffect, useState } from "react";

interface FreightBarProps {
  frases?: string[];
}

export default function FreightBar({
  frases = [
    "FRETE GRÁTIS ACIMA DE R$200",
    "ENTREGA RÁPIDA EM TODO BRASIL",
    "PARCELAMENTO EM ATÉ 10X SEM JUROS",
  ],
}: FreightBarProps) {
  const emblaTextRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Loop automático de frases
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % frases.length);
    }, 3000); // a cada 3 segundos
    return () => clearInterval(interval);
  }, [frases.length]);

  return (
    <div className=" w-full bg-emerald-600 py-2 md:py-2 flex items-center justify-center text-white text-sm md:text-base font-Instrument-Sans tracking-wide">
      <div className="overflow-hidden w-full" ref={emblaTextRef}>
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {frases.map((frase, index) => (
            <div key={index} className="min-w-full flex items-center justify-center">
              <span className="flex items-center gap-2 text-white text-[13px] md:text-sm font-semibold tracking-[0.5px] leading-none">
                {frase}
                {index === 0 && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-white"
                    viewBox="0 0 64 64"
                    fill="currentColor"
                  >
                    <path d="M2 36h34v-16c0-2-1-3-3-3H18c-2 0-3 1-4 2l-8 10H2v7z" />
                    <path d="M36 36h16c3 0 6-3 6-6v-4c0-2-1-3-2-4l-6-5c-1-1-2-1-3-1H36v20z" />
                    <circle cx="18" cy="44" r="6" />
                    <circle cx="48" cy="44" r="6" />
                    <rect x="4" y="24" width="18" height="3" rx="1.5" />
                    <rect x="4" y="18" width="22" height="3" rx="1.5" />
                    <rect x="4" y="12" width="26" height="3" rx="1.5" />
                  </svg>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}