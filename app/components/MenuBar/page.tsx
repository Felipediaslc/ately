
"use client";

import { useState } from "react";
import { ShoppingCart, Menu, Search, X, User } from "lucide-react";
import { MenuItem } from "./MenuItem"

const mockProducts = [
  "Terço de São Miguel",
  "Imegem de Nossa Senhora Aparecida",
  "Camiseta Sagrado Coração de Jesus",
  "Boné Nossa Senhora Aparecida",
  "Chavero de São Bento",
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
    <header className="sticky top-0 z-50 w-full bg-amber-50 shadow-md">
      

      {/* MAIN HEADER */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        {/* MOBILE MENU BTN */}
        <button
          className="md:hidden text-gray-600"
          onClick={() => setOpenMenu(true)}
        >
          <Menu size={26} />
        </button>

        {/* LOGO */}
        <div className="text-lg font-medium text-gray-500 tracking-wide">
          LOGO
        </div>

        {/* SEARCH */}
        <div className="relative hidden w-full max-w-xl md:block">
          <div className="flex items-center rounded-lg border border-gray-300 bg-amber-50 text-gray-700  px-3">
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
            <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-lg border bg-amber-50 text-gray-700 shadow-lg">
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
          <div className="relative text-gray-500   flex md:block">
            <button onClick={() => setOpenLogin(!openLogin)}>
              <User size={24} />
            </button>

            {/* LOGIN DROPDOWN */}
            {openLogin && (
              <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border-none font-medium text-gray-500  bg-amber-50 p-3 shadow-xl">
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
          <div className="relative text-gray-500">
            <button onClick={() => setOpenCart(!openCart)}>
              <ShoppingCart size={24} />
            </button>

            {/* CART DROPDOWN */}
            {openCart && (
              <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-xl border-none bg-amber-50 text-gray-500 font-medium p-4 shadow-xl">
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
      <nav className="hidden w-full border-t border-gray-300 bg-amber-50 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-8 px-4 py-3 text-sm font-light text-gray-500">

          <MenuItem title="Terço" />
          <MenuItem title="Chaveiro" />
          <MenuItem title="Imagem" />
          <MenuItem title="Acessórios" />

         
        </div>
      </nav>

      {/* MOBILE MENU */}
      {openMenu && (
        <div className="fixed inset-0 z-50 bg-transparent">
          <div className="h-full w-72 bg-bg-fuchsia-300 p-5 bg-amber-50 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <span className="tracking-widest  font-normal text-gray-600">Menu</span>
              <button className="text-gray-600" onClick={() => setOpenMenu(false)}>
                <X />
              </button>
            </div>

            <nav className="flex flex-col gap-4 border-none text-sm text-gray-600">
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
