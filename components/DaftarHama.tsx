"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { DAFTAR_KELAS, TEKS_KEANDALAN, namaKelas, type Komoditas } from "@/lib/kelas";
import { NAMA_KOMODITAS, useBahasa } from "@/lib/i18n";
import { PENGETAHUAN } from "@/lib/pengetahuan";
import { cx } from "@/lib/format";

const FILTER: ("Semua" | Komoditas)[] = ["Semua", "Padi", "Jagung", "Bawang"];

export default function DaftarHama() {
  const { bahasa, tx } = useBahasa();
  const [filter, setFilter] = useState<(typeof FILTER)[number]>("Semua");
  const [cari, setCari] = useState("");
  const hasil = useMemo(() => {
    const q = cari.trim().toLowerCase();
    return DAFTAR_KELAS.filter((k) => (filter === "Semua" || k.komoditas === filter) && (!q || `${k.nama} ${k.namaEn} ${k.namaIlmiah} ${PENGETAHUAN[k.id].bahaya.id} ${PENGETAHUAN[k.id].bahaya.en}`.toLowerCase().includes(q)));
  }, [filter, cari]);
  const labelFilter = (f: (typeof FILTER)[number]) => (f === "Semua" ? tx({ id: "Semua", en: "All" }) : tx(NAMA_KOMODITAS[f]));

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label={tx({ id: "Saring menurut tanaman", en: "Filter by crop" })}>
          {FILTER.map((f) => (
            <button key={f} type="button" onClick={() => setFilter(f)} aria-pressed={filter === f}
              className={cx("rounded-full px-4 py-2 text-[14px] font-semibold", filter === f ? "bg-tinta text-kertas" : "border border-garis bg-kertas")}>
              {labelFilter(f)}
            </button>
          ))}
        </div>
        <label className="relative block sm:w-72">
          <span className="sr-only">{tx({ id: "Cari hama atau gejala", en: "Search pest or symptom" })}</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-lumpur" aria-hidden />
          <input value={cari} onChange={(e) => setCari(e.target.value)} placeholder={tx({ id: "Cari nama atau gejala, misal: daun putih", en: "Search name or symptom" })}
            className="w-full rounded-full border border-garis bg-kertas py-2.5 pl-10 pr-4 text-[14.5px] outline-none focus:border-tinta" />
        </label>
      </div>

      {hasil.length === 0 ? (
        <p className="rounded-panel border border-dashed border-garis p-6 text-lumpur">{tx({ id: "Tidak ada hama yang cocok. Coba kata lain, misalnya \"batang\" atau \"wereng\".", en: "No matching pests. Try another word, for example \"borer\" or \"planthopper\"." })}</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {hasil.map((k) => (
            <li key={k.id}>
              <Link href={`/hama/${k.id}`} className="group flex h-full flex-col rounded-panel border border-garis bg-kertas p-4 transition-colors hover:border-tinta">
                <span className="text-[12.5px] font-semibold text-lumpur">{tx(NAMA_KOMODITAS[k.komoditas])}</span>
                <span className="mt-0.5 font-judul text-[19px] font-semibold leading-tight">{namaKelas(k, bahasa)}</span>
                <i className="text-[13px] text-lumpur">{k.namaIlmiah}</i>
                <span className="mt-2 line-clamp-4 text-[14px] leading-relaxed text-tinta/80">{tx(PENGETAHUAN[k.id].bahaya)}</span>
                <span className={cx("mt-auto pt-3 text-[12.5px] font-semibold", k.keandalan === "tinggi" ? "text-daun" : k.keandalan === "sedang" ? "text-gabah" : "text-bata")}>
                  {tx(TEKS_KEANDALAN[k.keandalan].label)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
