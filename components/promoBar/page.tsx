"use client";

import { useEffect, useState } from "react";

function calculateTimeLeft() {
  const difference =
    +new Date("2026-05-01T00:00:00") - +new Date();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

export default function PromoBar() {
  const [timeLeft, setTimeLeft] = useState({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
});

  useEffect(() => {
    const interval = setInterval(() => {
     setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);
const format = (value: number) => String(value).padStart(2, "0");
return (
    <div className="sticky top-0 z-50 w-full bg-gray-900 text-white shadow-md">
      <div className="flex w-full items-center justify-center px-4 py-2">
        
        {/* Conteúdo central em linha, responsivo */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-center">

          {/* Texto Promo */}
          <span className="text-xs sm:text-base md:text-sm font-bold tracking-wide font-Instrument-Sans w-full sm:w-auto mb-1 sm:mb-0">
            LEVE 4 PAGUE 3
          </span>

          {/* Countdown */}
          <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-3">
            <TimeBox value={format(timeLeft.days)} label="Dia(s)" />
            <Separator />
            <TimeBox value={format(timeLeft.hours)} label="Hora(s)" />
            <Separator />
            <TimeBox value={format(timeLeft.minutes)} label="Min(s)" />
            <Separator />
            <TimeBox value={format(timeLeft.seconds)} label="Seg(s)" />
          </div>

        </div>
      </div>
    </div>
  );
}

/* 🔢 Caixa tempo */
function TimeBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center leading-none min-w-[40px]">
      <span className="font-bold tabular-nums font-Instrument-Sans text-xs sm:text-base md:text-sm">
        {value}
      </span>
      <span className="text-[10px] sm:text-xs font-Instrument-Sans opacity-80">
        {label}
      </span>
    </div>
  );
}

/* : Separador */
function Separator() {
  return (
    <span className="pb-1 sm:pb-3 text-sm sm:text-base md:text-lg opacity-70">
      :
    </span>
  );
}