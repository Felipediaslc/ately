"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Menu, X, User, Heart } from "lucide-react";

import { useCart } from "@/app/context/cart/CartContext";
import { useFavorites } from "@/app/context/FavoritesContext";
import { useAuth } from "@/app/hooks/useAuth";
import { SearchBar } from "@/components/search/SearchBar";

const categories = [
  { name: "Terço", slug: "terco" },
  { name: "Imagem", slug: "imagem" },
  { name: "Mandala", slug: "mandala" },
  { name: "Pingente", slug: "pingente" },
  { name: "Chaveiro", slug: "chaveiro" },
];

export default function Header() {
  const [openMenu, setOpenMenu] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [mounted, setMounted] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);

  const { cartItems } = useCart();
  const pathname = usePathname();
  const router = useRouter();

  const { user, refresh } = useAuth();
  const { favoriteItems } = useFavorites();

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setMounted(true);
    });

    return () => cancelAnimationFrame(id);
  }, []);

  // 🔥 FECHAR AO CLICAR FORA
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setOpenLogin(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const totalCartItems = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalFavorites = favoriteItems.length;

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      await refresh();

      setOpenLogin(false);

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // =========================
  // USER MENU
  // =========================
  const handleOpenUserMenu = async () => {
    setOpenLogin((prev) => !prev);
    await refresh();
  };

  const goTo = (path: string) => {
    setOpenLogin(false);
    router.push(path);
  };

  return (
    <header className="w-full bg-[#FAF7F2] shadow-md">

      {/* HEADER */}
      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-2 md:gap-4 px-4 py-3">

        {/* MOBILE MENU */}
        <button
          className="md:hidden text-primary shrink-0"
          onClick={() => setOpenMenu(true)}
        >
          <Menu size={26} />
        </button>

        {/* LOGO */}
        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0"
        >
          <div className="relative h-10 lg:h-16 w-32 sm:w-40 lg:w-64">
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
        <div className="hidden md:block w-full max-w-xl">
          <SearchBar />
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-2 md:gap-4 ml-auto md:ml-0 shrink-0">

          {/* FAVORITES */}
          <Link href="/favorites" className="relative text-primary">
            <Heart size={24} />
            {mounted && totalFavorites > 0 && (
              <span className="absolute -top-2 -right-2 bg-fuchsia-700 text-white text-xs font-bold min-w-[20px] h-[20px] flex items-center justify-center rounded-full">
                {totalFavorites}
              </span>
            )}
          </Link>

          {/* CART */}
          <Link href="/cart" className="relative text-primary">
            <ShoppingCart size={24} />
            {mounted && totalCartItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-fuchsia-700 text-white text-xs font-bold min-w-[20px] h-[20px] flex items-center justify-center rounded-full">
                {totalCartItems}
              </span>
            )}
          </Link>

          {/* USER */}
          <div ref={userMenuRef} className="relative text-primary">

            <button onClick={handleOpenUserMenu}>
              <User size={24} />
            </button>

            {openLogin && (
              <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl bg-[#FAF7F2] shadow-xl overflow-hidden">

                {!user ? (
                  <>
                    <button
                      onClick={() => goTo("/login")}
                      className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-100 w-full text-left"
                    >
                      <User size={16} />
                      Entrar
                    </button>

                    <button
                      onClick={() => goTo("/register")}
                      className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-100 w-full text-left"
                    >
                      <User size={16} />
                      Criar conta
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => goTo("/account")}
                      className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-100 w-full text-left font-medium"
                    >
                      Minha conta
                    </button>

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-3 text-sm hover:bg-gray-100 text-red-500"
                    >
                      Sair
                    </button>
                  </>
                )}

              </div>
            )}
          </div>
        </div>
      </div>

      {/* SEARCH MOBILE */}
      <div className="md:hidden w-full px-4 pb-3">
        <SearchBar />
      </div>

      {/* MENU DESKTOP */}
      <nav className="hidden w-full border-t border-gray-300 bg-[#FAF7F2] md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-8 px-4 py-3 text-sm font-light text-primary">
          <Link href="/">Home</Link>
          <Link href="/about">Sobre</Link>

          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products/category/${cat.slug}`}
              className={
                pathname === `/products/category/${cat.slug}`
                  ? "font-semibold underline"
                  : ""
              }
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </nav>

      {/* MOBILE MENU */}
      {openMenu && (
        <div
          className="fixed inset-0 z-50 bg-black/40"
          onClick={() => setOpenMenu(false)}
        >
          <div
            className="h-full w-72 bg-[#FAF7F2] p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <span className="tracking-widest text-primary">Menu</span>
              <button onClick={() => setOpenMenu(false)}>
                <X />
              </button>
            </div>

            <nav className="flex flex-col gap-4 text-sm text-primary">
              <Link href="/" onClick={() => setOpenMenu(false)}>Home</Link>
              <Link href="/about" onClick={() => setOpenMenu(false)}>Sobre</Link>

              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/products/category/${cat.slug}`}
                  onClick={() => setOpenMenu(false)}
                >
                  {cat.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}