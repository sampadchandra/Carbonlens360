import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CarbonLens 360 — From Carbon Footprint to Carbon Credit",
  description: "A unified platform that turns carbon and pollution data into safer choices, measurable savings, verified action and carbon-credit readiness.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-100 antialiased min-h-screen flex flex-col`}>
        <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-300 flex items-center justify-center font-bold text-slate-950 text-lg shadow-lg shadow-emerald-500/20">
              C
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
                CARBONLENS 360
              </span>
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                SU-02
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-300">
            <a href="#dashboard" className="hover:text-emerald-400 transition-colors">Individual Dashboard</a>
            <a href="#campus" className="hover:text-emerald-400 transition-colors">Campus Hub</a>
            <a href="#industrial" className="hover:text-emerald-400 transition-colors">Industrial Sensor Node</a>
            <a href="#credit" className="hover:text-emerald-400 transition-colors">Credit Readiness</a>
            <a href="#api-docs" className="hover:text-emerald-400 transition-colors">API & Specs</a>
          </nav>

          <div className="flex items-center space-x-3">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs text-slate-400 font-mono">FastAPI Backend Active</span>
          </div>
        </header>
        
        <main className="flex-1">{children}</main>

        <footer className="border-t border-slate-800/60 bg-slate-950 py-8 px-6 text-center text-slate-500 text-xs">
          <p>© 2026 CarbonLens 360 • CodeVoyage SU-02 • "From Carbon Footprint to Carbon Credit"</p>
        </footer>
      </body>
    </html>
  );
}
