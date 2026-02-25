"use client";

import { useEffect, useState } from "react";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export default function PromoBar() {
  const targetDate = new Date("2026-04-04T23:59:59").getTime();

  const calculateTimeLeft = (): TimeLeft => {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const format = (value: number) => String(value).padStart(2, "0");

  return (
    <div className="sticky top-0 z-50 w-full bg-gray-900 text-white shadow-md">
      <div className="flex flex-col sm:flex-row w-full items-center justify-center px-4 py-2 gap-2 sm:gap-4">
        {/* Texto promocional */}
        <span className="text-xs sm:text-base md:text-sm font-bold tracking-wide font-Instrument-Sans">
          LEVE 4 PAGUE 3
        </span>

        {/* Cronômetro */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
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
  );
}

function TimeBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center leading-none">
      <span className="font-bold tabular-nums font-Instrument-Sans text-xs sm:text-base md:text-sm">
        {value}
      </span>
      <span className="text-[10px] sm:text-xs opacity-80 font-Instrument-Sans">
        {label}
      </span>
    </div>
  );
}

function Separator() {
  return <span className="pb-1 sm:pb-3 text-sm sm:text-base md:text-lg opacity-70">:</span>;
}