import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Furry AI Studio",
  description: "Genera imagenes, captions y video 100% offline con IA local.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
