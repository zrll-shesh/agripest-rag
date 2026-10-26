"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, MessageCircleQuestion, Radar, Workflow } from "lucide-react";
import Logo from "@/components/Logo";
import { cx } from "@/lib/format";
import { PemilihBahasa, useBahasa } from "@/lib/i18n";

const MENU = [
  { href: "/", label: { id: "Pantau lahan", en: "Monitor fields" }, pendek: { id: "Pantau", en: "Monitor" }, Ikon: Radar },
  { href: "/hama", label: { id: "Pustaka hama", en: "Pest library" }, pendek: { id: "Pustaka", en: "Library" }, Ikon: BookOpen },
  { href: "/tanya", label: { id: "Tanya asisten", en: "Ask assistant" }, pendek: { id: "Tanya", en: "Ask" }, Ikon: MessageCircleQuestion },
  { href: "/cara-kerja", label: { id: "Cara kerja", en: "How it works" }, pendek: { id: "Cara kerja", en: "How it works" }, Ikon: Workflow },
];

export default function Navigasi() {
  const lokasi = usePathname();
  const { tx } = useBahasa();
  const aktif = (href: string) => (href === "/" ? lokasi === "/" : lokasi.startsWith(href));
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-garis bg-tanah/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-halaman items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" aria-label="AgriPest-RAG, ke halaman pantau">
            <Logo />
          </Link>
          <div className="flex items-center gap-3">
          <nav aria-label="Menu utama" className="hidden items-center gap-1 lg:flex">
            {MENU.map(({ href, label, Ikon }) => (
              <Link
                key={href}
                href={href}
                aria-current={aktif(href) ? "page" : undefined}
                className={cx(
                  "flex items-center gap-2 rounded-full px-4 py-2 text-[14.5px] font-semibold transition-colors",
                  aktif(href) ? "bg-tinta text-kertas" : "text-lumpur hover:bg-daun-muda hover:text-tinta"
                )}
              >
                <Ikon className="h-4 w-4" aria-hidden />
                {tx(label)}
              </Link>
            ))}
          </nav>
          <PemilihBahasa />
          </div>
        </div>
      </header>

      <nav
        aria-label="Menu utama"
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-garis bg-kertas/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
      >
        {MENU.map(({ href, pendek, Ikon }) => (
          <Link
            key={href}
            href={href}
            aria-current={aktif(href) ? "page" : undefined}
            className={cx("flex flex-col items-center gap-1 py-2.5 text-[11.5px] font-semibold", aktif(href) ? "text-daun" : "text-lumpur")}
          >
            <span className={cx("grid h-7 w-12 place-items-center rounded-full", aktif(href) && "bg-daun-muda")}>
              <Ikon className="h-[18px] w-[18px]" aria-hidden />
            </span>
            {tx(pendek)}
          </Link>
        ))}
      </nav>
    </>
  );
}
