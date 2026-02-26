"use client";

import PromoBar from "@/components/promoBar";
import TickerBar from "@/components/TickerBar";
import Header from "@/components/MenuBar";
import FreightBar from "@/components/frete";

export default function StickyTopBars() {
  return (
    <div className="sticky top-0 z-50 w-full">
      <PromoBar />

      <TickerBar />

      <Header />

      <FreightBar />
    </div>
  );
}
