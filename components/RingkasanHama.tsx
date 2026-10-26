"use client";
import { AlertOctagon, Eye, Sprout, TriangleAlert } from "lucide-react";
import { PENGETAHUAN } from "@/lib/pengetahuan";
import { useBahasa } from "@/lib/i18n";

// Ringkasan cepat dwibahasa di atas halaman detail hama.
export default function RingkasanHama({ kelas }: { kelas: number }) {
  const { tx } = useBahasa();
  const k = PENGETAHUAN[kelas];
  const butir = [
    { Ikon: AlertOctagon, warna: "text-bata", judul: { id: "Kenapa merugikan", en: "Why it matters" }, isi: k.bahaya },
    { Ikon: Eye, warna: "text-air", judul: { id: "Yang dicek di lahan", en: "What to check in the field" }, isi: k.cekBesok },
    { Ikon: Sprout, warna: "text-daun", judul: { id: "Langkah pertama tanpa obat", en: "First step, no pesticide" }, isi: k.langkahPertama },
    { Ikon: TriangleAlert, warna: "text-gabah", judul: { id: "Hindari kesalahan ini", en: "Avoid this mistake" }, isi: k.hindari },
  ];
  return (
    <section aria-label={tx({ id: "Ringkasan cepat", en: "Quick summary" })} className="grid gap-px overflow-hidden rounded-panel bg-garis ring-1 ring-garis sm:grid-cols-2 lg:grid-cols-4">
      {butir.map(({ Ikon, warna, judul, isi }) => (
        <div key={judul.id} className="bg-kertas p-5">
          <p className="flex items-center gap-2 text-[15px] font-semibold"><Ikon className={`h-4 w-4 ${warna}`} aria-hidden />{tx(judul)}</p>
          <p className="mt-2 text-[14.5px] leading-relaxed text-tinta/85">{tx(isi)}</p>
        </div>
      ))}
    </section>
  );
}
