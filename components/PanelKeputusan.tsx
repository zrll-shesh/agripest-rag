"use client";
import { useState } from "react";
import Link from "next/link";
import { BookOpen, Check, HelpCircle, MessageCircleQuestion, X } from "lucide-react";
import { ambilKelas, namaKelas } from "@/lib/kelas";
import { CatatanIsiIndonesia, NAMA_KOMODITAS, useBahasa } from "@/lib/i18n";
import { barisPestisidaUntuk, ciriUntukDicocokkan, semuaSumberUnik, type Deteksi } from "@/lib/data";
import { CatatanKeandalan, LencanaYakin } from "@/components/Lencana";
import LangkahPHT from "@/components/LangkahPHT";
import { PENGETAHUAN } from "@/lib/pengetahuan";
import { AlertOctagon, Eye, Sprout, TriangleAlert } from "lucide-react";
import DaftarSumber from "@/components/DaftarSumber";
import { cx, tingkatYakin } from "@/lib/format";

type Cocok = "ya" | "tidak" | "ragu" | null;

export default function PanelKeputusan({ deteksi, namaLahan, jam }: { deteksi: Deteksi[]; namaLahan: string; jam: string }) {
  const { bahasa, tx } = useBahasa();
  const kelasUnik = [...new Set(deteksi.map((d) => d.kelas))];
  const [kelasAktif, setKelasAktif] = useState(kelasUnik[0]);
  const [cocok, setCocok] = useState<Cocok>(null);

  if (!deteksi.length) {
    return (
      <div className="rounded-panel border border-garis bg-kertas p-6">
        <h2 className="text-[22px] font-semibold">{tx({ id: "Tidak ada hama di foto ini", en: "No pests in this photo" })}</h2>
        <p className="mt-2 text-lumpur">{tx({ id: "Kamera tetap memotret setiap 30 menit. Pilih titik lain pada garis waktu untuk melihat tangkapan.", en: "The camera keeps taking a photo every 30 minutes. Pick another dot on the timeline to see a catch." })}</p>
      </div>
    );
  }

  const kelas = ambilKelas(kelasAktif);
  const milikKelas = deteksi.filter((d) => d.kelas === kelasAktif);
  const yakinTertinggi = Math.max(...milikKelas.map((d) => d.keyakinan));
  const ciri = ciriUntukDicocokkan(kelasAktif, kelas.komoditas);
  const langkah = barisPestisidaUntuk(kelasAktif);
  const perluHatiHati = kelas.keandalan !== "tinggi" || tingkatYakin(yakinTertinggi) === "kurang";
  const tautanTanya = `/tanya?${new URLSearchParams({
    kelas: String(kelasAktif), lahan: namaLahan, jam, yakin: yakinTertinggi.toFixed(2), jumlah: String(milikKelas.length), ...(cocok ? { cocok } : {}),
  })}`;

  const tombol = (nilai: Exclude<Cocok, null>, label: string, Ikon: typeof Check) => (
    <button
      type="button"
      onClick={() => setCocok(nilai)}
      aria-pressed={cocok === nilai}
      className={cx(
        "flex flex-1 items-center justify-center gap-1.5 rounded-full border px-3 py-2.5 text-[14px] font-semibold transition-colors",
        cocok === nilai
          ? nilai === "ya" ? "border-daun bg-daun text-kertas" : nilai === "tidak" ? "border-bata bg-bata text-kertas" : "border-gabah bg-gabah text-kertas"
          : "border-garis bg-kertas hover:border-tinta"
      )}
    >
      <Ikon className="h-4 w-4" aria-hidden /> {label}
    </button>
  );

  return (
    <div className="rounded-panel border border-garis bg-kertas">
      <div className="border-b border-garis p-5 sm:p-6">
        {kelasUnik.length > 1 && (
          <div className="mb-3 flex flex-wrap gap-1.5" role="tablist" aria-label={tx({ id: "Pilih hama", en: "Choose pest" })}>
            {kelasUnik.map((k) => (
              <button key={k} role="tab" aria-selected={k === kelasAktif} onClick={() => { setKelasAktif(k); setCocok(null); }}
                className={cx("rounded-full px-3 py-1 text-[13px] font-semibold", k === kelasAktif ? "bg-tinta text-kertas" : "bg-tanah")}>
                {namaKelas(ambilKelas(k), bahasa)}
              </button>
            ))}
          </div>
        )}
        <p className="text-[13.5px] text-lumpur">{tx({ id: "Hama yang dikenali sistem", en: "Pest identified by the system" })}</p>
        <h2 className="mt-0.5 text-[28px] font-bold leading-[1.1] sm:text-[32px]">{namaKelas(kelas, bahasa)}</h2>
        <p className="mt-1 text-[14px] text-lumpur"><i>{kelas.namaIlmiah}</i> · {bahasa === "en" ? `${NAMA_KOMODITAS[kelas.komoditas].en.toLowerCase()} pest` : `hama ${NAMA_KOMODITAS[kelas.komoditas].id.toLowerCase()}`}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <LencanaYakin keyakinan={yakinTertinggi} />
          <span className="rounded-full bg-tanah px-2.5 py-1 text-[12.5px] font-semibold">{milikKelas.length} {tx({ id: "ekor di foto ini", en: "in this photo" })}</span>
        </div>
        {perluHatiHati && <div className="mt-4"><CatatanKeandalan keandalan={kelas.keandalan} /></div>}
      </div>

      <div className="border-b border-garis bg-tanah/50 p-5 sm:p-6">
        <h3 className="text-[19px] font-semibold">{tx({ id: "Apa artinya untuk lahan Anda", en: "What this means for your field" })}</h3>
        <dl className="mt-3 space-y-3.5 text-[14.5px] leading-relaxed">
          {[
            { Ikon: AlertOctagon, warna: "text-bata", judul: { id: "Kenapa merugikan", en: "Why it matters" }, isi: PENGETAHUAN[kelasAktif].bahaya },
            { Ikon: Eye, warna: "text-air", judul: { id: "Cek besok pagi", en: "Check tomorrow morning" }, isi: PENGETAHUAN[kelasAktif].cekBesok },
            { Ikon: Sprout, warna: "text-daun", judul: { id: "Langkah pertama tanpa obat", en: "First step, no pesticide" }, isi: PENGETAHUAN[kelasAktif].langkahPertama },
            { Ikon: TriangleAlert, warna: "text-gabah", judul: { id: "Hindari kesalahan ini", en: "Avoid this mistake" }, isi: PENGETAHUAN[kelasAktif].hindari },
          ].map(({ Ikon, warna, judul, isi }) => (
            <div key={judul.id} className="flex gap-3">
              <Ikon className={`mt-1 h-4 w-4 shrink-0 ${warna}`} aria-hidden />
              <div><dt className="font-semibold">{tx(judul)}</dt><dd className="text-tinta/85">{tx(isi)}</dd></div>
            </div>
          ))}
        </dl>
      </div>

      <div className="border-b border-garis p-5 sm:p-6">
        <h3 className="text-[19px] font-semibold">{tx({ id: "Cocokkan dengan yang Anda lihat di lahan", en: "Compare with what you see in the field" })}</h3>
        <p className="mt-1 text-[13.5px] text-lumpur">{tx({ id: "Sistem bisa keliru. Pastikan dulu sebelum memakai obat.", en: "The system can be wrong. Make sure before using any pesticide." })}</p>
        <div className="mt-3"><CatatanIsiIndonesia /></div>
        <ul className="mt-3 space-y-2">
          {ciri.map((c) => (
            <li key={c.id} className="flex gap-2.5 text-[14.5px] leading-relaxed">
              <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-daun" aria-hidden />
              <span>{c.isi}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[14px] font-semibold">{tx({ id: "Apakah ciri ini sesuai?", en: "Do these signs match?" })}</p>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          {tombol("ya", tx({ id: "Ya, cocok", en: "Yes, matches" }), Check)}
          {tombol("ragu", tx({ id: "Belum yakin", en: "Not sure" }), HelpCircle)}
          {tombol("tidak", tx({ id: "Tidak cocok", en: "Does not match" }), X)}
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {cocok === "tidak" ? (
          <div className="masuk space-y-3">
            <h3 className="text-[19px] font-semibold">{tx({ id: "Jangan ikuti saran obat untuk foto ini", en: "Do not follow pesticide advice for this photo" })}</h3>
            <p className="text-[14.5px] leading-relaxed">
              {tx({ id: "Bisa jadi yang tertangkap bukan hama yang dikenali sistem. Sistem hanya mengenal 24 jenis hama padi, jagung, dan bawang merah, jadi serangga lain bisa salah dikira salah satunya.", en: "The catch may not be a pest the system knows. The system only recognises 24 pests of rice, corn, and shallot, so other insects can be mistaken for one of them." })}
            </p>
            <p className="text-[14.5px] leading-relaxed">{tx({ id: "Simpan foto atau contoh serangganya, lalu tunjukkan ke petugas POPT atau penyuluh pertanian.", en: "Keep the photo or a sample of the insect and show it to a pest observer or extension officer." })}</p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Link href="/hama" className="inline-flex items-center gap-2 rounded-full bg-tinta px-4 py-2.5 text-[14px] font-semibold text-kertas"><BookOpen className="h-4 w-4" aria-hidden />{tx({ id: "Cari di pustaka hama", en: "Search the pest library" })}</Link>
              <Link href={tautanTanya} className="inline-flex items-center gap-2 rounded-full border border-garis px-4 py-2.5 text-[14px] font-semibold"><MessageCircleQuestion className="h-4 w-4" aria-hidden />{tx({ id: "Tanya asisten", en: "Ask the assistant" })}</Link>
            </div>
          </div>
        ) : (
          <div className="masuk">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h3 className="text-[19px] font-semibold">{tx({ id: "Langkah yang disarankan", en: "Recommended steps" })}</h3>
                <p className="text-[13.5px] text-lumpur">{tx({ id: "Berurutan sesuai Pengendalian Hama Terpadu: mulai dari yang paling aman.", en: "Ordered by Integrated Pest Management: safest first." })}</p>
              </div>
              <Link href={tautanTanya} className="inline-flex items-center gap-2 rounded-full bg-air px-4 py-2 text-[14px] font-semibold text-kertas">
                <MessageCircleQuestion className="h-4 w-4" aria-hidden />{tx({ id: "Tanya soal hama ini", en: "Ask about this pest" })}
              </Link>
            </div>
            <LangkahPHT
              baris={langkah}
              kimiaTerbuka={cocok === "ya"}
              pesanKimiaTerkunci={cocok === "ragu" ? tx({ id: "Karena belum yakin, pilihan obat kimia disembunyikan. Pakai dulu langkah tanpa obat, lalu pastikan jenis hamanya ke petugas.", en: "Because you are not sure, chemical options are hidden. Use the steps without pesticides first, then confirm the pest with an officer." }) : undefined}
            />
            <details className="mt-6 rounded-kecil bg-tanah px-4 py-3">
              <summary className="cursor-pointer text-[13.5px] font-semibold">{tx({ id: "Lihat sumber rekomendasi", en: "See recommendation sources" })}</summary>
              <div className="mt-3"><DaftarSumber sumber={semuaSumberUnik(langkah)} judul={tx({ id: "Rekomendasi di atas disusun dari:", en: "The steps above are based on:" })} /></div>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}
