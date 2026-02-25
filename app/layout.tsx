import type { Metadata } from "next";
import { ReactNode } from "react";
import "./globals.css";
import StickyTopBars from "@/app/components/StickyTopBars/page";
import Footer from "./components/foolter/page";



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
      </body>
    </html>
  );
}
