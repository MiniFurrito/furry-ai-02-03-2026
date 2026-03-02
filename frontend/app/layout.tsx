import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cute Furry AI 🐾",
  description: "Generador de imágenes furry con IA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-black text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}