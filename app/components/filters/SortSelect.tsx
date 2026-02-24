"use client"
import { useState } from "react"

export function QuantitySelector() {
  const [qty, setQty] = useState(1)

  return (
    <div className="
      flex 
      items-center 
      border 
      rounded-lg 
      text-sm
    ">
      <button
        onClick={() => setQty(prev => Math.max(1, prev - 1))}
        className="px-3 py-2 hover:bg-gray-100"
      >
        -
      </button>

      <span className="px-4">{qty}</span>

      <button
        onClick={() => setQty(prev => prev + 1)}
        className="px-3 py-2 hover:bg-gray-100"
      >
        +
      </button>
    </div>
  )
}