"use client";
import { useState, useEffect } from "react";

interface QuantitySelectorProps {
  value: number;
  onChange: (val: number) => void;
  max?: number;
  min?: number;
}

export function QuantitySelector({
  value,
  onChange,
  max = 10,
  min = 1,
}: QuantitySelectorProps) {
  const [internal, setInternal] = useState(value);

  useEffect(() => {
    setInternal(value);
  }, [value]);

  const increment = () => {
    if (internal < max) {
      const next = internal + 1;
      setInternal(next);
      onChange(next);
    }
  };

  const decrement = () => {
    if (internal > min) {
      const next = internal - 1;
      setInternal(next);
      onChange(next);
    }
  };

  return (
    <div className="flex items-center border rounded-md overflow-hidden">
      <button
        type="button"
        onClick={decrement}
        className="px-2 py-1 hover:bg-gray-100 transition"
      >
        -
      </button>
      <span className="px-3 text-sm">{internal}</span>
      <button
        type="button"
        onClick={increment}
        className="px-2 py-1 hover:bg-gray-100 transition"
      >
        +
      </button>
    </div>
  );
}