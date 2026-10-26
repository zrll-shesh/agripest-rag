"use client";
// Pilihan bahasa tampilan (Indonesia / English). Teks dwibahasa ditulis berdampingan: tx({ id: "...", en: "..." }).
import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type Bahasa = "id" | "en";
export interface Dwibahasa { id: string; en: string }

const KUNCI = "agripest-bahasa";
const Konteks = createContext<{ bahasa: Bahasa; setBahasa: (b: Bahasa) => void }>({ bahasa: "id", setBahasa: () => {} });

export function PenyediaBahasa({ children }: { children: React.ReactNode }) {
  const [bahasa, setBahasaState] = useState<Bahasa>("id");
  useEffect(() => {
    try { const s = localStorage.getItem(KUNCI); if (s === "en" || s === "id") setBahasaState(s); } catch {}
  }, []);
  useEffect(() => { document.documentElement.lang = bahasa; }, [bahasa]);
  const setBahasa = useCallback((b: Bahasa) => {
    setBahasaState(b);
    try { localStorage.setItem(KUNCI, b); } catch {}
  }, []);
  return <Konteks.Provider value={{ bahasa, setBahasa }}>{children}</Konteks.Provider>;
}

export function useBahasa() {
  const { bahasa, setBahasa } = useContext(Konteks);
  const tx = useCallback((t: Dwibahasa) => t[bahasa], [bahasa]);
  return { bahasa, setBahasa, tx };
}

// Untuk dipakai di dalam server component: <T id="..." en="..." />
export function T({ id, en }: Dwibahasa) {
  const { bahasa } = useBahasa();
  return <>{bahasa === "en" ? en : id}</>;
}

export { NAMA_KOMODITAS } from "@/lib/teks";

export function PemilihBahasa() {
  const { bahasa, setBahasa } = useBahasa();
  return (
    <div role="group" aria-label="Bahasa / Language" className="flex rounded-full border border-garis bg-kertas p-0.5 text-[13px] font-bold">
      {(["id", "en"] as const).map((b) => (
        <button
          key={b}
          type="button"
          onClick={() => setBahasa(b)}
          aria-pressed={bahasa === b}
          className={`rounded-full px-3 py-1.5 transition-colors ${bahasa === b ? "bg-tinta text-kertas" : "text-lumpur hover:text-tinta"}`}
        >
          {b === "id" ? "ID" : "EN"}
        </button>
      ))}
    </div>
  );
}

// Keterangan di mode English bahwa isi pustaka bersumber dari lembaga Indonesia.
export function CatatanIsiIndonesia() {
  const { bahasa } = useBahasa();
  if (bahasa !== "en") return null;
  return (
    <p className="rounded-kecil bg-air-muda px-3.5 py-2.5 text-[13px] leading-relaxed text-air">
      Field guidance below is quoted in Indonesian from Indonesian agricultural agencies and research sources. Ask the assistant for an explanation in English.
    </p>
  );
}
