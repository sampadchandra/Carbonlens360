import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CarbonLens 360 — From Carbon Footprint to Carbon Credit",
  description: "Unified College Climate & Rewards Operating System — Measure your campus impact, prove sustainable commute action, earn Green Credits, and redeem canteen benefits.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.className} bg-slate-950 text-slate-100 antialiased min-h-screen flex flex-col grid-background`}>
        {children}
      </body>
    </html>
  );
}
