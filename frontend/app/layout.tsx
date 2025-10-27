import "../globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Portfolio Simulator",
  description: "Model real estate investment performance",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
