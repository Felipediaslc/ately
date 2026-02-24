"use client";

interface Props {
  onOpen: () => void;
}

export function MobileFilterButton({ onOpen }: Props) {
  return (
    <div className="lg:hidden mb-6">
      <button
        onClick={onOpen}
        className="w-full bg-black text-white py-3 rounded-lg"
      >
        Filtrar produtos
      </button>
    </div>
  );
}