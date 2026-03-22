import type { Metadata } from "next";
import { ReactNode } from "react";
import "@/styles/globals.css";
import StickyTopBars from "@/components/StickyTopBars/page";
import Footer from "@/components/foolter";
import WhatsappFloat from "@/components/Whatsapp";
import { Providers } from "./providers"; // 👈 IMPORTANTE

export const metadata: Metadata = {
  title: "Atelier Religioso",
  description: "Site de produtos religiosos",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers> {/* 👈 AQUI */}
          <StickyTopBars />
          <main>{children}</main>
          <Footer />
          <WhatsappFloat />
        </Providers>
      </body>
    </html>
  );
}