// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { Prompt } from "next/font/google";
import { CartProvider } from "./components/cart/CartContext";

const prompt = Prompt({
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "TEERAMON OPTIC | ร้านแว่นตาสไตล์มินิมอล",
  description:
    "ร้านแว่นตา TEERAMON OPTIC ศูนย์เลนส์โปรเกรสซีฟและเลนส์ทุกชนิด โดยนักทัศนมาตร",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className={`${prompt.className} bg-white text-slate-900 antialiased`}>
        <CartProvider>
          <Navbar />
          <main className="min-h-[70vh]">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
