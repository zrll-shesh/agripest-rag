"use client";
import { useBahasa } from "@/lib/i18n";
export default function Logo({ kecil = false }: { kecil?: boolean }) {
  const { tx } = useBahasa();
  return (
    <span className="flex items-center gap-2.5">
      <svg viewBox="0 0 64 64" className={kecil ? "h-8 w-8" : "h-9 w-9"} aria-hidden>
        <rect width="64" height="64" rx="16" fill="#2D6A47" />
        <path d="M32 12c-6 8-9 15-9 22a9 9 0 0 0 18 0c0-7-3-14-9-22Z" fill="#F6EBD2" />
        <path d="M32 22v26" stroke="#2D6A47" strokeWidth="3" strokeLinecap="round" />
        <circle cx="46" cy="18" r="5" fill="#B97C0C" />
      </svg>
      <span className="leading-none">
        <span className="block font-judul text-[17px] font-bold tracking-tight">AgriPest-RAG</span>
        <span className="block text-[11.5px] text-lumpur">{tx({ id: "Pos pantau hama", en: "Pest watch post" })}</span>
      </span>
    </span>
  );
}
