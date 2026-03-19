"use client";

import PromoBar from "@/components/promoBar/page";
import TickerBar from "@/components/TickerBar/page";
import Header from "@/components/MenuBar/page";
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
