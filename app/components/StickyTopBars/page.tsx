"use client";

import PromoBar from "../promoBar/page";
import TickerBar from "../TickerBar/page";
import Header from "../MenuBar/page";
import FreightBar from "../frete/page";

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