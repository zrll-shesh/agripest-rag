"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { DAFTAR_KELAS, TEKS_KEANDALAN, type Komoditas } from "@/lib/kelas";
import { cx } from "@/lib/format";

const FILTER: ("Semua" | Komoditas)[] = ["Semua", "Padi", "Jagung", "Bawang"];

export default function DaftarHama({ ringkas }: { ringkas: Record<number, string> }) {
  const [filter, setFilter] = useState<(typeof FILTER)[number]>("Semua");
  const [cari, setCari] = useState("");
  const hasil = useMemo(() => {
    const q = cari.trim().toLowerCase();
    return DAFTAR_KELAS.filter((k) => (filter === "Semua" || k.komoditas === filter) && (!q || `${k.nama} ${k.namaIlmiah} ${ringkas[k.id]}`.toLowerCase().includes(q)));
  }, [filter, cari, ringkas]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Saring menurut tanaman">
          {FILTER.map((f) => (
            <button key={f} type="button" onClick={() => setFilter(f)} aria-pressed={filter === f}
              className={cx("rounded-full px-4 py-2 text-[14px] font-semibold", filter === f ? "bg-tinta text-kertas" : "border border-garis bg-kertas")}>
              {f === "Bawang" ? "Bawang merah" : f}
            </button>
          ))}
        </div>
        <label className="relative block sm:w-72">
          <span className="sr-only">Cari hama atau gejala</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-lumpur" aria-hidden />
          <input value={cari} onChange={(e) => setCari(e.target.value)} placeholder="Cari nama atau gejala, misal: daun putih"
            className="w-full rounded-full border border-garis bg-kertas py-2.5 pl-10 pr-4 text-[14.5px] outline-none focus:border-tinta" />
        </label>
      </div>

      {hasil.length === 0 ? (
        <p className="rounded-panel border border-dashed border-garis p-6 text-lumpur">Tidak ada hama yang cocok. Coba kata lain, misalnya &quot;batang&quot; atau &quot;wereng&quot;.</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {hasil.map((k) => (
            <li key={k.id}>
              <Link href={`/hama/${k.id}`} className="group flex h-full flex-col rounded-panel border border-garis bg-kertas p-4 transition-colors hover:border-tinta">
                <span className="text-[12.5px] font-semibold text-lumpur">{k.komoditas === "Bawang" ? "Bawang merah" : k.komoditas}</span>
                <span className="mt-0.5 font-judul text-[19px] font-semibold leading-tight">{k.nama}</span>
                <i className="text-[13px] text-lumpur">{k.namaIlmiah}</i>
                <span className="mt-2 line-clamp-3 text-[14px] leading-relaxed text-tinta/80">{ringkas[k.id]}</span>
                <span className={cx("mt-auto pt-3 text-[12.5px] font-semibold", k.keandalan === "tinggi" ? "text-daun" : k.keandalan === "sedang" ? "text-gabah" : "text-bata")}>
                  {TEKS_KEANDALAN[k.keandalan].label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
