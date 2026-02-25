"use client";

import { useState } from "react";
import Image from "next/image"; // Importe o componente Image
import { ShoppingCart, Menu, Search, X, User } from "lucide-react";
import { MenuItem } from "./MenuItem";

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
  const [openCart, setOpenCart] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = mockProducts.filter((p) =>
    p.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <header className=" py-0   w-full bg-[#ffffff] shadow-md">
      {/* MAIN HEADER */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        {/* MOBILE MENU BTN */}
        <button
          className="md:hidden text-primary" // Cor alterada
          onClick={() => setOpenMenu(true)}
        >
          <Menu size={26} />
        </button>

        {/* LOGO */}
        <div className="relative h-6  lg:h-10 w-24 lg:w-32    "> {/* Ajuste a altura (h) e largura (w) se necessário */}
          <Image
            src="/image/logo.jpeg"
            alt="Dias Atelier Logo"
            fill
            objectFit=""
          />
        </div>

        {/* SEARCH */}
        <div className="relative hidden w-full max-w-xl md:block">
          <div className="flex items-center rounded-lg border border-gray-300 bg-[#ffffff] text-gray-700 px-3">
            <Search size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar produtos..."
              className="w-full bg-transparent px-2 py-2 text-xs outline-none"
            />
          </div>

          {/* AUTOCOMPLETE */}
          {search && (
            <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-lg border bg-[#ffffff] text-gray-700 shadow-lg">
              {filtered.length > 0 ? (
                filtered.map((item, i) => (
                  <div
                    key={i}
                    className="cursor-pointer px-4 py-2 text-sm hover:bg-gray-100"
                  >
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
        <div className="flex items-center gap-4">
          {/* LOGIN */}
          <div className="relative text-primary flex md:block"> {/* Cor alterada */}
            <button onClick={() => setOpenLogin(!openLogin)}>
              <User size={24} />
            </button>

            {/* LOGIN DROPDOWN */}
            {openLogin && (
              <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border-none font-Instrument-Sans text-primary bg-[#ffffff] p-3 shadow-xl">
                <div className="flex flex-col text-sm">
                  <span className="cursor-pointer rounded-lg px-3 py-2 hover:bg-gray-100">
                    Entrar
                  </span>
                  <span className="cursor-pointer rounded-lg px-3 py-2 hover:bg-gray-100">
                    Criar conta
                  </span>
                  <span className="cursor-pointer rounded-lg px-3 py-2 hover:bg-gray-100">
                    Pedidos
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* CART */}
          <div className="relative text-primary"> {/* Cor alterada */}
            <button onClick={() => setOpenCart(!openCart)}>
              <ShoppingCart size={24} />
            </button>

            {/* CART DROPDOWN */}
            {openCart && (
              <div className="font-Instrument-Sans absolute right-0 top-full z-50 mt-2 w-72 rounded-xl border-none text-primary bg-[#ffffff] font-medium p-4 shadow-xl">
                <h4 className="mb-3 font-semibold">Carrinho</h4>
                <div className="text-sm text-gray-400">
                  Seu carrinho está vazio
                </div>
                <button className="mt-4 w-full rounded-lg bg-purple-700 py-2 text-sm font-semibold text-white hover:bg-purple-800">
                  Ver carrinho
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MENU DESKTOP */}
      <nav className="hidden w-full border-t border-gray-300 bg-[#ffffff] md:block font-Instrument-Sans">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-8 px-4 py-3 text-sm font-light text-primary"> {/* Cor alterada */}
          <MenuItem title="Terço" />
          <MenuItem title="Chaveiro" />
          <MenuItem title="Imagem" />
          <MenuItem title="Acessórios" />
        </div>
      </nav>

      {/* MOBILE MENU */}
      {openMenu && (
        <div className="fixed inset-0 z-50 bg-transparent">
          <div className="h-full w-72 bg-[#ffffff] p-5 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <span className="tracking-widest  font-Instrument-Sans  text-primary">Menu</span> {/* Cor alterada */}
              <button className="text-primary" onClick={() => setOpenMenu(false)}> {/* Cor alterada */}
                <X />
              </button>
            </div>
            <nav className="flex flex-col gap-4 border-none text-sm text-primary font-Instrument-Sans"> {/* Cor alterada */}
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