"use client";

import { useEffect } from "react";
import { PriceFilter } from "../filters/PriceFilter";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function MobileFilterDrawer({ open, onClose }: Props) {
  // trava scroll do body quando aberto
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`
          fixed inset-0 bg-black/40 z-40
          transition-opacity duration-300
          ${open ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
      />

      {/* Drawer */}
      <div
        className={`
          fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-xl
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg">Filtros</h3>
            <button onClick={onClose} className="text-xl">
              ✕
            </button>
          </div>

          <PriceFilter />

          <button
            onClick={onClose}
            className="mt-auto bg-black text-white py-3 rounded-lg"
          >
            Aplicar filtros
          </button>
        </div>
      </div>
    </>
  );
}