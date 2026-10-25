import type { Metadata } from "next";
import { Archivo } from "next/font/google";

import { BrandHeader } from "@/components/brand";

import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FastExpress – Cotizador de envíos",
  description:
    "Cotiza el valor de un envío con descuentos, recargos y seguro.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={archivo.className}>
        <BrandHeader />
        {children}
      </body>
    </html>
  );
}
