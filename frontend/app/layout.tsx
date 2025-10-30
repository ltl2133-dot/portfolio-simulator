import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

import { QueryProvider } from "@/components/layout/query-provider";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Real Estate Portfolio Simulator",
  description: "Model property performance, optimize portfolios, and stress test market risk.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} bg-slate-950 text-slate-100 min-h-screen antialiased`}>
        <ThemeProvider>
          <QueryProvider>
            <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
              <header className="mx-auto w-full max-w-6xl px-6 py-10">
                <div className="rounded-3xl border border-white/5 bg-white/5 px-8 py-6 backdrop-blur-lg">
                  <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Real Estate Intelligence</p>
                      <h1 className="text-2xl font-semibold text-white md:text-3xl">
                        Portfolio Simulation Command Center
                      </h1>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-300">
                      <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-emerald-300">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        Markets Online
                      </span>
                      <span className="hidden rounded-full border border-white/5 px-4 py-2 md:inline-flex">
                        Render API • Vercel Frontend
                      </span>
                    </div>
                  </div>
                </div>
              </header>
              <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-16">{children}</main>
            </div>
          </QueryProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
