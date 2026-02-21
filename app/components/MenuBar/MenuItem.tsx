"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"

interface MenuItemProps {
  title: string
}

export function MenuItem({ title }: MenuItemProps) {
  const [open, setOpen] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    if (window.innerWidth >= 1024) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      setOpen(true)
    }
  }

  const handleMouseLeave = () => {
    if (window.innerWidth >= 1024) {
      timeoutRef.current = setTimeout(() => {
        setOpen(false)
      }, 200)
    }
  }

  const handleClick = () => {
    if (window.innerWidth < 1024) {
      setOpen(prev => !prev)
    }
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={handleClick}
        className="flex items-center gap-1 border-none font-medium hover:text-fuchsia-600 transition"
      >
        {title}
        <ChevronDown size={16} />
      </button>

      {open && (
        <div className="
  static w-full mt-2
  lg:absolute lg:w-56 lg:top-full lg:left-0 lg:mt-4
  rounded-2xl bg-[#ffffff] shadow-xl border-none p-4 z-50
">
          <ul className=" space-y-2 text-sm">
            <li className="hover:text-fuchsia-600"><Link href="#">Novidades</Link></li>
            <li className="hover:text-fuchsia-600"><Link href="#">Mais vendidos</Link></li>
            <li className="hover:text-fuchsia-600"><Link href="#">Promoções</Link></li>
          </ul>
        </div>
      )}
    </div>
  )
}