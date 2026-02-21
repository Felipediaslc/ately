"use client";

import { useEffect, useState } from "react";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export default function PromoBar() {
  const targetDate = new Date("2026-02-23T23:59:59").getTime();

  const calculateTimeLeft = (): TimeLeft => {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const format = (value: number) => String(value).padStart(2, "0");

  return (
    <div className="sticky top-0 z-50 w-full bg-gray-900 text-white shadow-md">
      <div className="flex w-full items-center justify-center px-4 py-2">
        
        {/* Conteúdo central em linha */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-center">
          
          {/* Texto Promo */}
          <span className="text-xs font-bold tracking-wide sm:text-base md:text-sm font-Instrument-Sans">
            LEVE 4 PAGUE 3
          </span>

          {/* Countdown */}
          <div className="flex items-center gap-3">
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
    <div className="flex flex-col items-center leading-none">
      <span className="font-bold tabular-nums  font-Instrument-Sans text-xs sm:text-base md:text-sm">
        {value}
      </span>
      <span className="text-[10px] opacity-80 sm:text-xs font-Instrument-Sans">
        {label}
      </span>
    </div>
  );
}

/* : Separador */
function Separator() {
  return (
    <span className="pb-3 text-sm opacity-70 sm:text-base md:text-lg">
      :
    </span>
  );
}