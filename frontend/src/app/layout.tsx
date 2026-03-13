import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SwellWise - Condições de Praias com IA",
  description:
    "Descubra as melhores praias do Brasil com condições em tempo real, previsões detalhadas e análises inteligentes com IA.",
  keywords: [
    "praias",
    "surf",
    "ondas",
    "previsão",
    "inteligência artificial",
    "brasil",
    "litoral",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
