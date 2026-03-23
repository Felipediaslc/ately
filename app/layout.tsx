import type { Metadata } from "next";
import { ReactNode } from "react";
import "@/styles/globals.css";
import StickyTopBars from "@/components/StickyTopBars/page";
import Footer from "@/components/foolter/page";
import WhatsappFloat from "@/components/Whatsapp";
import { Providers } from "./providers"; // 👈 IMPORTANTE
import { FavoritesProvider } from "@/app/context/FavoritesContext";

export const metadata: Metadata = {
  title: "Atelier Religioso",
  description: "Site de produtos religiosos",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers> {/* 👈 AQUI */}
          <FavoritesProvider>
          <StickyTopBars />
          <main className="block">{children}</main>
          <Footer />
          <WhatsappFloat />
          </FavoritesProvider>
        </Providers>
      </body>
    </html>
  );
}