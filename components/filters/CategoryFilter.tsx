"use client";
import { useRouter, useSearchParams } from "next/navigation"; 

const categories = [
  { label: "Terço", value: "terco" },
  { label: "Imagem", value: "imagem" },
  { label: "Bíblia", value: "biblia" },
  { label: "Cruz", value: "cruz" },
  { label: "Vela", value: "vela" },
  { label: "Decoração", value: "decoracao" },
];



export function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category") || "";

  function handleFilter(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (selectedCategory === value) params.delete("category");
    else params.set("category", value);
    router.replace(params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname, { scroll: false });
  }

  function handleClearFilter() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    router.replace(params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname, { scroll: false });
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Categoria</h2>
      <div className="space-y-3">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.value;
          return (
            <label key={cat.value} className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" checked={isActive} onChange={() => handleFilter(cat.value)} className="w-4 h-4 accent-fuchsia-950" />
              <span className={`text-sm transition ${isActive ? "text-fuchsia-900 font-medium" : "text-gray-700 group-hover:text-fuchsia-900"}`}>
                {cat.label}
              </span>
            </label>
          );
        })}
      </div>
      {selectedCategory && (
        <button onClick={handleClearFilter} className="w-full mt-6 py-2 rounded-xl text-sm font-medium border border-fuchsia-900 text-fuchsia-900 hover:bg-fuchsia-900 hover:text-white transition">
          Limpar filtro
        </button>
      )}
    </div>
  );
}