"use client";
import { Fragment, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, SendHorizontal, Sprout, X } from "lucide-react";
import { ambilKelas, namaKelas } from "@/lib/kelas";
import { useBahasa } from "@/lib/i18n";
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
  const { bahasa, tx } = useBahasa();
  const en = bahasa === "en";
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

  const nk = kelas ? namaKelas(kelas, bahasa).toLowerCase() : "";
  const saran = kelas
    ? en
      ? [`When do I need to act on ${nk}?`, `How do I control ${nk} without chemicals?`, "Which pesticides are safe and not banned?", "How sure is the system about this pest?"]
      : [`Kapan saya perlu bertindak untuk ${nk}?`, `Cara mengatasi ${nk} tanpa obat kimia?`, "Obat apa yang aman dan tidak dilarang?", "Seberapa yakin sistem mengenali hama ini?"]
    : en
      ? ["Why is imidacloprid not recommended for brown planthopper?", "Which active ingredients are banned for rice?", "How do I monitor planthoppers in a paddy field?", "Which pests attack young shallot plants?"]
      : ["Kenapa imidakloprid tidak disarankan untuk wereng batang coklat?", "Bahan aktif apa saja yang dilarang untuk padi?", "Bagaimana cara memantau wereng di sawah?", "Hama apa yang menyerang bawang merah muda?"];

  async function kirim(teks: string) {
    const q = teks.trim();
    if (!q || memuat) return;
    const riwayat = pesan.filter((p) => !p.galat).map(({ peran, teks }) => ({ peran, teks }));
    setPesan((p) => [...p, { peran: "pengguna", teks: q }]);
    setMasukan("");
    setMemuat(true);
    try {
      const r = await fetch("/api/tanya", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pertanyaan: q, riwayat, konteks, bahasa }) });
      const data = await r.json();
      if (!r.ok) throw new Error(data.galat ?? tx({ id: "Asisten tidak bisa dihubungi.", en: "The assistant cannot be reached." }));
      setPesan((p) => [...p, { peran: "asisten", teks: data.jawaban, sumber: data.sumber, mode: data.mode }]);
    } catch (e) {
      setPesan((p) => [...p, { peran: "asisten", teks: (e as Error).message || tx({ id: "Asisten tidak bisa dihubungi. Periksa koneksi lalu kirim ulang.", en: "The assistant cannot be reached. Check your connection and send again." }), galat: true }]);
    } finally {
      setMemuat(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-[52rem] flex-col">
      {kelas && (
        <div className="mb-4 flex items-start justify-between gap-3 rounded-panel border border-garis bg-kertas px-4 py-3">
          <div className="text-[14px] leading-relaxed">
            <p className="text-[12.5px] font-semibold text-lumpur">{tx({ id: "Asisten tahu Anda sedang melihat", en: "The assistant knows you are looking at" })}</p>
            <p>
              <span className="font-semibold">{namaKelas(kelas, bahasa)}</span>
              {konteks.lahan && <>{en ? " in the " : " di "}{konteks.lahan.toLowerCase()}</>}
              {konteks.jam && <>{en ? ", photo at " : ", foto pukul "}{konteks.jam}</>}
              {typeof konteks.keyakinan === "number" && <>{en ? ", confidence " : ", keyakinan "}{persen(konteks.keyakinan)}</>}
              {konteks.cocok === "tidak" && <>{en ? ", signs marked as not matching" : ", ciri ditandai tidak cocok"}</>}
            </p>
          </div>
          <button type="button" onClick={() => setKonteksAktif(false)} className="grid h-8 w-8 shrink-0 place-items-center rounded-full hover:bg-tanah" aria-label={tx({ id: "Lepas konteks hama", en: "Remove pest context" })}>
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
      )}

      <div className="space-y-4" aria-live="polite">
        {pesan.length === 0 && (
          <div className="rounded-panel border border-dashed border-garis px-5 py-6">
            <p className="text-[15.5px] leading-relaxed">
              {tx({ id: "Tanyakan apa saja tentang hama padi, jagung, dan bawang merah. Jawaban disusun dari pustaka sumber resmi (Kementan, BB Padi, Balitsa, IRRI, dan jurnal), dan selalu menyebut sumbernya.", en: "Ask anything about rice, corn, and shallot pests. Answers come from a library of official sources (Indonesian Ministry of Agriculture, BB Padi, Balitsa, IRRI, and journals) and always cite them." })}
            </p>
            <p className="mt-4 text-[13.5px] font-semibold text-lumpur">{tx({ id: "Coba tanyakan:", en: "Try asking:" })}</p>
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
                {p.mode === "pustaka" && <p className="mb-2 rounded-kecil bg-gabah-muda px-3 py-2 text-[12.5px] text-[#6b4805]">{tx({ id: "Mode pustaka: kunci API Gemini belum diisi, jadi yang tampil adalah potongan pustaka paling relevan.", en: "Library mode: the Gemini API key is not set, so the most relevant library excerpts are shown." })}</p>}
                <TeksJawaban teks={p.teks} />
                {p.sumber && p.sumber.length > 0 && (
                  <details className="mt-3 border-t border-garis pt-2.5">
                    <summary className="cursor-pointer text-[13px] font-semibold text-lumpur">{tx({ id: "Rujukan", en: "References" })} ({p.sumber.length})</summary>
                    <div className="mt-2"><DaftarSumber sumber={p.sumber} judul="" /></div>
                  </details>
                )}
              </div>
            </div>
          )
        )}
        {memuat && (
          <div className="flex items-center gap-2 pl-11 text-[14px] text-lumpur"><Loader2 className="h-4 w-4 animate-spin" aria-hidden /> {tx({ id: "Mencari di pustaka dan menyusun jawaban", en: "Searching the library and writing an answer" })}</div>
        )}
        <div ref={akhir} />
      </div>

      <form onSubmit={(e) => { e.preventDefault(); kirim(masukan); }} className="sticky bottom-[72px] -mx-4 mt-6 bg-tanah px-4 pb-3 pt-3 sm:-mx-6 sm:px-6 lg:bottom-0 lg:pb-6">
        <div className="flex items-end gap-2 rounded-[22px] border border-garis bg-kertas p-2 shadow-[0_8px_30px_rgba(23,37,29,0.08)]">
          <label htmlFor="pertanyaan" className="sr-only">{tx({ id: "Tulis pertanyaan", en: "Write a question" })}</label>
          <textarea
            id="pertanyaan" rows={1} value={masukan} maxLength={600}
            onChange={(e) => setMasukan(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); kirim(masukan); } }}
            placeholder={tx({ id: "Tulis pertanyaan Anda", en: "Type your question" })}
            className="max-h-36 min-h-[44px] flex-1 resize-none bg-transparent px-3 py-2.5 text-[15px] outline-none"
          />
          <button type="submit" disabled={!masukan.trim() || memuat} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-daun text-kertas disabled:opacity-40" aria-label={tx({ id: "Kirim pertanyaan", en: "Send question" })}>
            <SendHorizontal className="h-[18px] w-[18px]" aria-hidden />
          </button>
        </div>
        <p className="mt-1.5 px-3 text-[12px] text-lumpur">{tx({ id: "Asisten tidak memberi takaran obat. Ikuti label resmi dan tanyakan ke POPT atau penyuluh bila ragu.", en: "The assistant never gives pesticide doses. Follow the official label and ask an officer if unsure." })}</p>
      </form>
    </div>
  );
}
