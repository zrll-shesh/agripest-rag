import type { Metadata, Viewport } from "next";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/plus-jakarta-sans";
import "./globals.css";
import Navigasi from "@/components/Navigasi";
import Kaki from "@/components/Kaki";
import { PenyediaBahasa } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "AgriPest-RAG · Pos Pantau Hama",
  description:
    "Pantau hama padi, jagung, dan bawang merah dari kamera lampu perangkap. Dapatkan langkah pengendalian hama terpadu yang aman dan tanya asisten berbasis sumber resmi.",
  authors: [{ name: "Nazril Ravi Pratama" }],
  creator: "Nazril Ravi Pratama",
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#f3f5ef" };

export default function TataLetak({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="min-h-screen antialiased">
        <PenyediaBahasa>
          <a href="#isi" className="absolute -left-[999px] top-2 z-50 rounded-kecil bg-kertas px-3 py-2 text-sm font-semibold focus:left-2">
            Lompat ke isi
          </a>
          <div className="latar-padi kiri" aria-hidden />
          <div className="latar-padi kanan" aria-hidden />
          <Navigasi />
          <main id="isi" className="relative z-[1] mx-auto w-full max-w-halaman px-4 pb-10 pt-5 sm:px-6 lg:pb-14 lg:pt-8">
            {children}
          </main>
          <Kaki />
        </PenyediaBahasa>
      </body>
    </html>
  );
}
