"use client";

import { useRouter, useSearchParams } from "next/navigation";

const priceRanges = [
  { label: "R$ 0,00 a R$ 40,00", value: "0-40" },
  { label: "R$ 41,00 a R$ 80,00", value: "41-80" },
  { label: "R$ 81,00 a R$ 120,00", value: "81-120" },
  { label: "R$ 121,00 a R$ 160,00", value: "121-160" },
  { label: "Acima de R$ 161,00", value: "161-*" },
];

export function PriceFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedPrice = searchParams.get("price") || "";

  function updateQuery(value?: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || selectedPrice === value) {
      params.delete("price"); // limpar ou toggle off
    } else {
      params.set("price", value); // novo filtro
    }

    // Mantém pathname atual, preservando qualquer outra query
    const queryString = params.toString();
    router.replace(queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname, {
      scroll: false,
    });
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Preço</h2>

      <div className="space-y-3">
        {priceRanges.map((range) => {
          const isActive = selectedPrice === range.value;

          return (
            <label key={range.value} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={isActive}
                onChange={() => updateQuery(range.value)}
                className="w-4 h-4 accent-fuchsia-950"
              />
              <span
                className={`text-sm transition ${
                  isActive ? "text-fuchsia-900 font-medium" : "text-gray-700 group-hover:text-fuchsia-900"
                }`}
              >
                {range.label}
              </span>
            </label>
          );
        })}
      </div>

      {selectedPrice && (
        <button
          onClick={() => updateQuery()}
          className="w-full mt-6 py-2 rounded-xl text-sm font-medium border border-fuchsia-900 text-fuchsia-900 hover:bg-fuchsia-900 hover:text-white transition"
        >
          Limpar filtro
        </button>
      )}
    </div>
  );
}