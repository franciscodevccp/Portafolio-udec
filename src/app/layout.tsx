import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import PublicLayout from "@/components/layout/PublicLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: "ePortfolio — FAUG UdeC",
  description: "Portfolio de evidencias y reflexiones de aprendizaje",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <PublicLayout>{children}</PublicLayout>
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "var(--color-surface)",
              color: "var(--color-text)",
              border: "1px solid var(--color-border)",
            },
          }}
        />
      </body>
    </html>
  );
}
