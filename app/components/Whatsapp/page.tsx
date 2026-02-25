"use client";


import { FaWhatsapp } from "react-icons/fa";

export default function WhatsappFloat() {
  return (
    <div className="fixed bottom-6 right-6 z-[999] group">
      
      {/* Texto que aparece no hover */}
      <span
        className="
          absolute right-16 top-1/2 -translate-y-1/2
          bg-gray-900 text-white text-sm font-medium
          px-4 py-2 rounded-full
          shadow-lg
          opacity-0 translate-x-2
          transition-all duration-300
          group-hover:opacity-100
          group-hover:translate-x-0
          whitespace-nowrap
        "
      >
        Fale conosco
      </span>

      {/* Botão */}
      <a
        href="https://wa.me/5583999999999?text=Olá,%20quero%20saber%20mais%20sobre%20os%20produtos"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Fale conosco no WhatsApp"
      className="
  flex items-center justify-center
  w-14 h-14 md:w-16 md:h-16
  rounded-full
  bg-[#25D366] hover:bg-[#1ebe5d]
  text-white
  shadow-[0_8px_30px_rgba(0,0,0,0.25)]
  transition-all duration-300
  hover:scale-110
  hover:shadow-2xl
  active:scale-95
  animate-[pulse_4s_ease-in-out_infinite]
">
        <FaWhatsapp className="w-7 h-7" />
      </a>
    </div>
  );
}