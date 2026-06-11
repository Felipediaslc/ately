"use client";

import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  const categories = [
    { name: "Terço", slug: "terco" },
    { name: "Imagem", slug: "imagem" },
    { name: "Mandala", slug: "mandala" },
    { name: "Pingente", slug: "pingente" },
    { name: "Chaveiro", slug: "chaveiro" },
  ];

  return (
    <footer className="bg-[#FAF7F2] text-primary mt-12 relative">

      {/* Linha topo */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />

      <div className="max-w-7xl mx-auto px-4 py-10 text-center md:text-left">

        {/* LOGO — ✅ tamanho responsivo */}
        <div className="mb-8 flex justify-center md:justify-start">
          <Image
            src="/image/sd_atelie_logo_v9.svg"
            alt="Logo SD Ateliê"
            width={300}
            height={60}
            className="w-40 sm:w-56 md:w-64"
          />
        </div>

        {/* COLUNAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

          {/* LINKS */}
          <div>
            <h4 className="tracking-wide font-semibold mb-3">Links</h4>
            <ul className="space-y-2 text-gray-700 tracking-wide">

              <li>
                <Link href="/" className="hover:text-primary">
                  Home
                </Link>
              </li>

              <li>
                <Link href="/about" className="hover:text-primary">
                  Sobre
                </Link>
              </li>

              {categories.map((cat) => {
                const isActive = pathname === `/products/category/${cat.slug}`;
                return (
                  <li key={cat.slug}>
                    <Link
                      href={`/products/category/${cat.slug}`}
                      className={`hover:text-primary ${
                        isActive ? "font-semibold underline text-primary" : ""
                      }`}
                    >
                      {cat.name}
                    </Link>
                  </li>
                );
              })}

            </ul>
          </div>

          {/* CONTATO */}
          <div>
            <h4 className="tracking-wide font-semibold mb-3">Contato</h4>
            <p className="text-gray-700 tracking-wide">sdatelie.religioso@gmail.com</p>
            <p className="text-gray-700 tracking-wide">+55 (83) 98751-0636</p>
            <p className="text-gray-700 tracking-wide">João Pessoa - PB</p>
          </div>

          {/* REDES — ✅ área de toque adequada com p-2 */}
          <div>
            <h4 className="tracking-wide font-semibold mb-3">Redes Sociais</h4>
            <div className="flex justify-center md:justify-start gap-2 text-gray-700">
              <a href="#" className="hover:text-primary p-2" aria-label="Facebook">
                <FaFacebookF size={18} />
              </a>
              <a href="#" className="hover:text-primary p-2" aria-label="Instagram">
                <FaInstagram size={18} />
              </a>
              <a href="#" className="hover:text-primary p-2" aria-label="Twitter">
                <FaTwitter size={18} />
              </a>
            </div>
          </div>

        </div>

        {/* PAGAMENTOS — ✅ h-6 w-auto para tamanho consistente */}
        <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mb-8">
          <span className="text-gray-700 font-semibold text-sm tracking-wide">
            Pagamentos:
          </span>
          <Image src="/image/visa.svg" alt="Visa" width={40} height={25} className="h-6 w-auto" />
          <Image src="/image/mastercard.svg" alt="MasterCard" width={40} height={25} className="h-6 w-auto" />
          <Image src="/image/icons8-pix.svg" alt="Pix" width={40} height={25} className="h-6 w-auto" />
          <Image src="/image/elo-svgrepo-com.svg" alt="Elo" width={40} height={25} className="h-6 w-auto" />
          <Image src="/image/hipercard-svgrepo-com.svg" alt="Hipercard" width={40} height={25} className="h-6 w-auto" />
        </div>

        {/* COPYRIGHT — ✅ centralizado no mobile */}
        <div className="text-gray-500 text-sm border-t border-gray-300 pt-4 tracking-wide text-center md:text-left">
          © 2026 SD Ateliê. Desenvolvido por{" "}
          <a
            href="https://www.linkedin.com/in/felipediasdev/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline transition"
          >
            Felipe Dias
          </a>
        </div>

      </div>
    </footer>
  );
}
