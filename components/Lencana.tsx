"use client";
import { AlertTriangle, CheckCircle2, Eye, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";
import type { StatusLahan } from "@/lib/simulasi";
import { TEKS_KEANDALAN, type Keandalan } from "@/lib/kelas";
import { cx, persen, tingkatYakin } from "@/lib/format";
import { useBahasa } from "@/lib/i18n";

const GAYA_STATUS: Record<StatusLahan, { label: { id: string; en: string }; kelas: string; Ikon: typeof CheckCircle2 }> = {
  aman: { label: { id: "Aman", en: "Safe" }, kelas: "bg-daun-muda text-daun-tua", Ikon: CheckCircle2 },
  waspada: { label: { id: "Waspada", en: "Watch" }, kelas: "bg-gabah-muda text-[#7a5206]", Ikon: Eye },
  "perlu-dicek": { label: { id: "Perlu dicek", en: "Check now" }, kelas: "bg-bata-muda text-bata", Ikon: AlertTriangle },
};

export function LencanaStatus({ status, besar = false }: { status: StatusLahan; besar?: boolean }) {
  const { tx } = useBahasa();
  const { label, kelas, Ikon } = GAYA_STATUS[status];
  return (
    <span className={cx("inline-flex items-center gap-1.5 rounded-full font-semibold", kelas, besar ? "px-3 py-1.5 text-sm" : "px-2.5 py-1 text-[12.5px]")}>
      <Ikon className={besar ? "h-4 w-4" : "h-3.5 w-3.5"} aria-hidden />
      {tx(label)}
    </span>
  );
}

export function LencanaYakin({ keyakinan }: { keyakinan: number }) {
  const { tx } = useBahasa();
  const t = tingkatYakin(keyakinan);
  const labelYakin = { yakin: { id: "Yakin", en: "Confident" }, cukup: { id: "Cukup yakin", en: "Fairly confident" }, kurang: { id: "Kurang yakin", en: "Not confident" } }[t];
  const kelas = t === "yakin" ? "text-daun-tua bg-daun-muda" : t === "cukup" ? "text-[#7a5206] bg-gabah-muda" : "text-bata bg-bata-muda";
  return (
    <span className={cx("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12.5px] font-semibold", kelas)}>
      {tx(labelYakin)} · {persen(keyakinan)}
    </span>
  );
}

export function CatatanKeandalan({ keandalan }: { keandalan: Keandalan }) {
  const { tx } = useBahasa();
  const { label, penjelasan } = TEKS_KEANDALAN[keandalan];
  const baik = keandalan === "tinggi";
  const Ikon = baik ? ShieldCheck : keandalan === "sedang" ? ShieldQuestion : ShieldAlert;
  return (
    <div className={cx("flex gap-3 rounded-kecil px-3.5 py-3 text-[13.5px] leading-relaxed", baik ? "bg-daun-muda text-daun-tua" : keandalan === "sedang" ? "bg-gabah-muda text-[#6b4805]" : "bg-bata-muda text-bata")}>
      <Ikon className="mt-0.5 h-[18px] w-[18px] shrink-0" aria-hidden />
      <p><span className="font-semibold">{tx(label)}.</span> {tx(penjelasan)}</p>
    </div>
  );
}
