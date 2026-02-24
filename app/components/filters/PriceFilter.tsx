"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"

const priceRanges = [
  { label: "R$ 0,00 a R$ 40,00", value: "0-40" },
  { label: "R$ 41,00 a R$ 80,00", value: "41-80" },
  { label: "R$ 81,00 a R$ 120,00", value: "81-120" },
  { label: "R$ 121,00 a R$ 160,00", value: "121-160" },
  { label: "Acima de R$ 161,00", value: "161-*" },
]

export function PriceFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const selectedPrice = searchParams.get("price")

  function handleFilter(value: string) {
    const params = new URLSearchParams(searchParams.toString())

    if (selectedPrice === value) {
      params.delete("price")
    } else {
      params.set("price", value)
    }

    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Preço</h2>

      <div className="space-y-3">
        {priceRanges.map(range => {
          const isActive = selectedPrice === range.value

          return (
            <label
              key={range.value}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={isActive}
                onChange={() => handleFilter(range.value)}
                className="w-4 h-4 accent-fuchsia-950"
              />

              <span className="text-sm text-gray-700 group-hover:text-fuchsia-900 transition">
                {range.label}
              </span>
            </label>
          )
        })}
      </div>
    </div>
  )
}