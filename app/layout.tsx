import type { Metadata } from "next";
import { ReactNode } from "react";
import "@/styles/globals.css";
import StickyTopBars from "@/components/StickyTopBars";
import Footer from "@/components/foolter";
import WhatsappFloat from "@/components/Whatsapp";

export const metadata: Metadata = {
  title: "Atelier Religioso",
  description: "Site de produtos religiosos",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <StickyTopBars />
        <main>{children}</main>
        <Footer />
        <WhatsappFloat />
      </body>
    </html>
  );
}
