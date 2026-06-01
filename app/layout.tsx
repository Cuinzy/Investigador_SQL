import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Expediente SQL: Mentiras en la Base de Datos",
  description: "Juego educativo de detectives para practicar consultas SQL en MySQL",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-[#08080f] text-slate-200 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
