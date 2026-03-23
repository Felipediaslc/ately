"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Menu, Search, X, User, Heart } from "lucide-react";
import { MenuItem } from "@/components/MenuBar/MenuItem";
import { useCart } from "@/app/context/cart/CartContext";
import { useFavorites } from "@/app/context/FavoritesContext";

const mockProducts = [
  "Terço de São Miguel",
  "Imagem de Nossa Senhora Aparecida",
  "Camiseta Sagrado Coração de Jesus",
  "Boné Nossa Senhora Aparecida",
  "Chaveiro de São Bento",
];

export default function Header() {
  const [openMenu, setOpenMenu] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [search, setSearch] = useState("");

  const { cartItems } = useCart();
  const { favoriteItems } = useFavorites();

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalFavorites = favoriteItems.length;

  const filtered = mockProducts.filter((p) =>
    p.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <header className="w-full bg-[#FAF7F2] shadow-md">
      {/* MAIN HEADER */}
      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">

        {/* MOBILE MENU BTN */}
        <button className="md:hidden text-primary" onClick={() => setOpenMenu(true)}>
          <Menu size={26} />
        </button>

        {/* LOGO — centralizada no mobile, normal no desktop */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
          <div className="relative h-10 lg:h-16 w-40 lg:w-64">
            <Image
              src="/image/sd_atelie_logo_v9.svg"
              alt="Dias Atelier Logo"
              width={600}
              height={80}
              className="object-contain"
            />
          </div>
        </Link>

        {/* SEARCH */}
        <div className="items-center relative hidden w-full max-w-xl md:block">
          <div className="flex items-center rounded-lg border border-gray-300 bg-[#ffffff] text-gray-700 px-3">
            <Search size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar produtos..."
              className="w-full bg-transparent px-2 py-2 text-xs outline-none"
            />
          </div>

          {search && (
            <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-lg border bg-[#FAF7F2] text-gray-700 shadow-lg">
              {filtered.length > 0 ? (
                filtered.map((item, i) => (
                  <div key={i} className="cursor-pointer px-4 py-2 text-sm hover:bg-gray-100">
                    {item}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500">
                  Nenhum produto encontrado
                </div>
              )}
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-4 ml-auto md:ml-0">

          {/* LOGIN */}
          <div className="relative text-primary flex md:block">
            <button onClick={() => setOpenLogin(!openLogin)}>
              <User size={24} />
            </button>

            {openLogin && (
              <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl bg-[#FAF7F2] p-3 shadow-xl">
                <div className="flex flex-col text-sm">
                  <span className="cursor-pointer rounded-lg px-3 py-2 hover:bg-gray-100">Entrar</span>
                  <span className="cursor-pointer rounded-lg px-3 py-2 hover:bg-gray-100">Criar conta</span>
                  <span className="cursor-pointer rounded-lg px-3 py-2 hover:bg-gray-100">Pedidos</span>
                </div>
              </div>
            )}
          </div>

          {/* FAVORITOS */}
          <div className="relative text-primary">
            <Link href="/favorites">
              <div className="relative cursor-pointer">
                <Heart size={24} />
                {totalFavorites > 0 && (
                  <span className="absolute -top-2 -right-2 bg-fuchsia-700 text-white text-xs font-bold min-w-[20px] h-[20px] flex items-center justify-center rounded-full">
                    {totalFavorites}
                  </span>
                )}
              </div>
            </Link>
          </div>

          {/* CARRINHO */}
          <div className="relative text-primary">
            <Link href="/cart">
              <div className="relative cursor-pointer">
                <ShoppingCart size={24} />
                {totalCartItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-fuchsia-700 text-white text-xs font-bold min-w-[20px] h-[20px] flex items-center justify-center rounded-full">
                    {totalCartItems}
                  </span>
                )}
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* MENU DESKTOP */}
      <nav className="hidden w-full border-t border-gray-300 bg-[#FAF7F2] md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-8 px-4 py-3 text-sm font-light text-primary">
          <MenuItem title="Terço" />
          <MenuItem title="Chaveiro" />
          <MenuItem title="Imagem" />
          <MenuItem title="Acessórios" />
        </div>
      </nav>

      {/* MOBILE MENU */}
      {openMenu && (
        <div className="fixed inset-0 z-50 bg-transparent">
          <div className="h-full w-72 bg-[#FAF7F2] p-5 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <span className="tracking-widest text-primary">Menu</span>
              <button className="text-primary" onClick={() => setOpenMenu(false)}>
                <X />
              </button>
            </div>
            <nav className="flex flex-col gap-4 text-sm text-primary">
              <MenuItem title="Terço" />
              <MenuItem title="Chaveiro" />
              <MenuItem title="Imagem" />
              <MenuItem title="Acessórios" />
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}