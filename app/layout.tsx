import type { Metadata } from "next";
import "./globals.css"; // ← Esta línea es importante

export const metadata: Metadata = {
  title: "Cute Furry AI 🐾",
  description: "Generador de imágenes furry con SD-Turbo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-gradient-to-br from-purple-900 via-pink-800 to-indigo-900 min-h-screen text-white">
        {children}
      </body>
    </html>
  );
}
