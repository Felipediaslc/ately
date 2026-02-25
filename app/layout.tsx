import type { Metadata } from "next";
import "./globals.css";
import PromoBar from "./components/promoBar/page";
import TickerBar from "./components/TickerBar/page";
import Header from "../app/components/MenuBar/page";
import Footer from "./components/foolter/page";



export const metadata: Metadata = {
  title: "Atelier Religioso",
  description: "Site de produtos religiosos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` antialiased`}
      >
       <PromoBar />
        <TickerBar />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
