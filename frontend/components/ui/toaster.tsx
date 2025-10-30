"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      theme="dark"
      position="top-center"
      toastOptions={{
        style: {
          background: "rgba(12, 12, 12, 0.9)",
          color: "#f8fafc",
          border: "1px solid rgba(148, 163, 184, 0.2)",
          backdropFilter: "blur(12px)",
        },
      }}
    />
  );
}
