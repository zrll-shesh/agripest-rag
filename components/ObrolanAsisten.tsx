"use client";
import { Fragment, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, SendHorizontal, Sprout, X } from "lucide-react";
import { ambilKelas } from "@/lib/kelas";
import type { Sumber } from "@/lib/data";
import DaftarSumber from "@/components/DaftarSumber";
import { cx, persen } from "@/lib/format";

interface Pesan { peran: "pengguna" | "asisten"; teks: string; sumber?: Sumber[]; mode?: "ai" | "pustaka"; galat?: boolean }

// Menampilkan teks jawaban: daftar "- ", huruf tebal **x**, dan nomor rujukan [n].
function TeksJawaban({ teks }: { teks: string }) {
  const sebaris = (s: string) =>
    s.split(/(\*\*[^*]+\*\*|\[\d+\])/g).map((b, i) =>
      b.startsWith("**") ? <strong key={i}>{b.slice(2, -2)}</strong>
        : /^\[\d+\]$/.test(b) ? <sup key={i} className="ml-0.5 rounded bg-air-muda px-1 text-[10.5px] font-bold text-air">{b.slice(1, -1)}</sup>
          : <Fragment key={i}>{b}</Fragment>
    );
  const baris = teks.split("\n").filter((b) => b.trim());
  return (
    <div className="space-y-1.5">
      {baris.map((b, i) =>
        /^\s*[-*•]\s+/.test(b) ? (
          <p key={i} className="flex gap-2"><span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-daun" />{<span>{sebaris(b.replace(/^\s*[-*•]\s+/, ""))}</span>}</p>
        ) : <p key={i}>{sebaris(b)}</p>
      )}
    </div>
  );
}

export default function ObrolanAsisten() {
  const param = useSearchParams();
  const kelasParam = param.get("kelas");
  const [konteksAktif, setKonteksAktif] = useState(kelasParam !== null && !Number.isNaN(Number(kelasParam)));
  const kelas = konteksAktif && kelasParam !== null ? ambilKelas(Number(kelasParam)) : null;
  const konteks = kelas
    ? { kelas: kelas.id, lahan: param.get("lahan") ?? undefined, jam: param.get("jam") ?? undefined, keyakinan: param.get("yakin") ? Number(param.get("yakin")) : undefined,
        jumlah: param.get("jumlah") ? Number(param.get("jumlah")) : undefined, cocok: (param.get("cocok") as "ya" | "tidak" | "ragu" | null) ?? null }
    : { kelas: null };

  const [pesan, setPesan] = useState<Pesan[]>([]);
  const [masukan, setMasukan] = useState("");
  const [memuat, setMemuat] = useState(false);
  const akhir = useRef<HTMLDivElement>(null);
  useEffect(() => { akhir.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [pesan, memuat]);

  const saran = kelas
    ? [`Kapan saya perlu bertindak untuk ${kelas.nama.toLowerCase()}?`, `Cara mengatasi ${kelas.nama.toLowerCase()} tanpa obat kimia?`, "Obat apa yang aman dan tidak dilarang?", "Seberapa yakin sistem mengenali hama ini?"]
    : ["Kenapa imidakloprid tidak disarankan untuk wereng batang coklat?", "Bahan aktif apa saja yang dilarang untuk padi?", "Bagaimana cara memantau wereng di sawah?", "Hama apa yang menyerang bawang merah muda?"];

  async function kirim(teks: string) {
    const q = teks.trim();
    if (!q || memuat) return;
    const riwayat = pesan.filter((p) => !p.galat).map(({ peran, teks }) => ({ peran, teks }));
    setPesan((p) => [...p, { peran: "pengguna", teks: q }]);
    setMasukan("");
    setMemuat(true);
    try {
      const r = await fetch("/api/tanya", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pertanyaan: q, riwayat, konteks }) });
      const data = await r.json();
      if (!r.ok) throw new Error(data.galat ?? "Asisten tidak bisa dihubungi.");
      setPesan((p) => [...p, { peran: "asisten", teks: data.jawaban, sumber: data.sumber, mode: data.mode }]);
    } catch (e) {
      setPesan((p) => [...p, { peran: "asisten", teks: (e as Error).message || "Asisten tidak bisa dihubungi. Periksa koneksi lalu kirim ulang.", galat: true }]);
    } finally {
      setMemuat(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-[52rem] flex-col">
      {kelas && (
        <div className="mb-4 flex items-start justify-between gap-3 rounded-panel border border-garis bg-kertas px-4 py-3">
          <div className="text-[14px] leading-relaxed">
            <p className="text-[12.5px] font-semibold text-lumpur">Asisten tahu Anda sedang melihat</p>
            <p>
              <span className="font-semibold">{kelas.nama}</span>
              {konteks.lahan && <> di {konteks.lahan.toLowerCase()}</>}
              {konteks.jam && <>, foto pukul {konteks.jam}</>}
              {typeof konteks.keyakinan === "number" && <>, keyakinan {persen(konteks.keyakinan)}</>}
              {konteks.cocok === "tidak" && <>, ciri ditandai tidak cocok</>}
            </p>
          </div>
          <button type="button" onClick={() => setKonteksAktif(false)} className="grid h-8 w-8 shrink-0 place-items-center rounded-full hover:bg-tanah" aria-label="Lepas konteks hama">
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
      )}

      <div className="space-y-4" aria-live="polite">
        {pesan.length === 0 && (
          <div className="rounded-panel border border-dashed border-garis px-5 py-6">
            <p className="text-[15.5px] leading-relaxed">
              Tanyakan apa saja tentang hama padi, jagung, dan bawang merah. Jawaban disusun dari pustaka sumber resmi (Kementan, BB Padi, Balitsa, IRRI, dan jurnal), dan selalu menyebut sumbernya.
            </p>
            <p className="mt-4 text-[13.5px] font-semibold text-lumpur">Coba tanyakan:</p>
            <div className="mt-2 flex flex-col gap-2">
              {saran.map((s) => (
                <button key={s} type="button" onClick={() => kirim(s)} className="rounded-kecil border border-garis bg-kertas px-4 py-2.5 text-left text-[14.5px] hover:border-tinta">{s}</button>
              ))}
            </div>
          </div>
        )}
        {pesan.map((p, i) =>
          p.peran === "pengguna" ? (
            <div key={i} className="masuk ml-auto max-w-[85%] rounded-[18px] rounded-br-[6px] bg-tinta px-4 py-3 text-[15px] leading-relaxed text-kertas">{p.teks}</div>
          ) : (
            <div key={i} className="masuk flex gap-3">
              <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-daun text-kertas"><Sprout className="h-4 w-4" aria-hidden /></span>
              <div className={cx("min-w-0 flex-1 rounded-[18px] rounded-tl-[6px] border px-4 py-3 text-[15px] leading-relaxed", p.galat ? "border-bata-muda bg-bata-muda/50" : "border-garis bg-kertas")}>
                {p.mode === "pustaka" && <p className="mb-2 rounded-kecil bg-gabah-muda px-3 py-2 text-[12.5px] text-[#6b4805]">Mode pustaka: kunci API Gemini belum diisi, jadi yang tampil adalah potongan pustaka paling relevan.</p>}
                <TeksJawaban teks={p.teks} />
                {p.sumber && p.sumber.length > 0 && (
                  <details className="mt-3 border-t border-garis pt-2.5">
                    <summary className="cursor-pointer text-[13px] font-semibold text-lumpur">Rujukan ({p.sumber.length})</summary>
                    <div className="mt-2"><DaftarSumber sumber={p.sumber} judul="" /></div>
                  </details>
                )}
              </div>
            </div>
          )
        )}
        {memuat && (
          <div className="flex items-center gap-2 pl-11 text-[14px] text-lumpur"><Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Mencari di pustaka dan menyusun jawaban</div>
        )}
        <div ref={akhir} />
      </div>

      <form onSubmit={(e) => { e.preventDefault(); kirim(masukan); }} className="sticky bottom-[72px] -mx-4 mt-6 bg-tanah px-4 pb-3 pt-3 sm:-mx-6 sm:px-6 lg:bottom-0 lg:pb-6">
        <div className="flex items-end gap-2 rounded-[22px] border border-garis bg-kertas p-2 shadow-[0_8px_30px_rgba(23,37,29,0.08)]">
          <label htmlFor="pertanyaan" className="sr-only">Tulis pertanyaan</label>
          <textarea
            id="pertanyaan" rows={1} value={masukan} maxLength={600}
            onChange={(e) => setMasukan(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); kirim(masukan); } }}
            placeholder="Tulis pertanyaan Anda"
            className="max-h-36 min-h-[44px] flex-1 resize-none bg-transparent px-3 py-2.5 text-[15px] outline-none"
          />
          <button type="submit" disabled={!masukan.trim() || memuat} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-daun text-kertas disabled:opacity-40" aria-label="Kirim pertanyaan">
            <SendHorizontal className="h-[18px] w-[18px]" aria-hidden />
          </button>
        </div>
        <p className="mt-1.5 px-3 text-[12px] text-lumpur">Asisten tidak memberi takaran obat. Ikuti label resmi dan tanyakan ke POPT atau penyuluh bila ragu.</p>
      </form>
    </div>
  );
}
