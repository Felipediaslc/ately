"use client";

import { useState } from "react";
import { MobileFilterDrawer } from "@/components/product/MobileFilterDrawer";
import { MobileFilterButton } from "@/components/ui/MobileFilterButton";

export function MobileFilterWrapper() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <MobileFilterButton onOpen={() => setOpen(true)} />
      <MobileFilterDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}