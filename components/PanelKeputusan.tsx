"use client";
import { useState } from "react";
import Link from "next/link";
import { BookOpen, Check, HelpCircle, MessageCircleQuestion, X } from "lucide-react";
import { ambilKelas } from "@/lib/kelas";
import { barisPestisidaUntuk, ciriUntukDicocokkan, semuaSumberUnik, type Deteksi } from "@/lib/data";
import { CatatanKeandalan, LencanaYakin } from "@/components/Lencana";
import LangkahPHT from "@/components/LangkahPHT";
import DaftarSumber from "@/components/DaftarSumber";
import { cx, tingkatYakin } from "@/lib/format";

type Cocok = "ya" | "tidak" | "ragu" | null;

export default function PanelKeputusan({ deteksi, namaLahan, jam }: { deteksi: Deteksi[]; namaLahan: string; jam: string }) {
  const kelasUnik = [...new Set(deteksi.map((d) => d.kelas))];
  const [kelasAktif, setKelasAktif] = useState(kelasUnik[0]);
  const [cocok, setCocok] = useState<Cocok>(null);

  if (!deteksi.length) {
    return (
      <div className="rounded-panel border border-garis bg-kertas p-6">
        <h2 className="text-[22px] font-semibold">Tidak ada hama di foto ini</h2>
        <p className="mt-2 text-lumpur">Kamera tetap memotret setiap 30 menit. Pilih titik lain pada garis waktu untuk melihat tangkapan.</p>
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
          <div className="mb-3 flex flex-wrap gap-1.5" role="tablist" aria-label="Pilih hama">
            {kelasUnik.map((k) => (
              <button key={k} role="tab" aria-selected={k === kelasAktif} onClick={() => { setKelasAktif(k); setCocok(null); }}
                className={cx("rounded-full px-3 py-1 text-[13px] font-semibold", k === kelasAktif ? "bg-tinta text-kertas" : "bg-tanah")}>
                {ambilKelas(k).nama}
              </button>
            ))}
          </div>
        )}
        <p className="text-[13.5px] text-lumpur">Hama yang dikenali sistem</p>
        <h2 className="mt-0.5 text-[28px] font-bold leading-[1.1] sm:text-[32px]">{kelas.nama}</h2>
        <p className="mt-1 text-[14px] text-lumpur"><i>{kelas.namaIlmiah}</i> · hama {kelas.komoditas.toLowerCase()}{kelas.komoditas === "Bawang" ? " merah" : ""}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <LencanaYakin keyakinan={yakinTertinggi} />
          <span className="rounded-full bg-tanah px-2.5 py-1 text-[12.5px] font-semibold">{milikKelas.length} ekor di foto ini</span>
        </div>
        {perluHatiHati && <div className="mt-4"><CatatanKeandalan keandalan={kelas.keandalan} /></div>}
      </div>

      <div className="border-b border-garis p-5 sm:p-6">
        <h3 className="text-[19px] font-semibold">Cocokkan dengan yang Anda lihat di lahan</h3>
        <p className="mt-1 text-[13.5px] text-lumpur">Sistem bisa keliru. Pastikan dulu sebelum memakai obat.</p>
        <ul className="mt-3 space-y-2">
          {ciri.map((c) => (
            <li key={c.id} className="flex gap-2.5 text-[14.5px] leading-relaxed">
              <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-daun" aria-hidden />
              <span>{c.isi}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[14px] font-semibold">Apakah ciri ini sesuai?</p>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          {tombol("ya", "Ya, cocok", Check)}
          {tombol("ragu", "Belum yakin", HelpCircle)}
          {tombol("tidak", "Tidak cocok", X)}
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {cocok === "tidak" ? (
          <div className="masuk space-y-3">
            <h3 className="text-[19px] font-semibold">Jangan ikuti saran obat untuk foto ini</h3>
            <p className="text-[14.5px] leading-relaxed">
              Bisa jadi yang tertangkap bukan hama yang dikenali sistem. Sistem hanya mengenal 24 jenis hama padi, jagung, dan bawang merah, jadi serangga lain bisa salah dikira salah satunya.
            </p>
            <p className="text-[14.5px] leading-relaxed">Simpan foto atau contoh serangganya, lalu tunjukkan ke petugas POPT atau penyuluh pertanian.</p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Link href="/hama" className="inline-flex items-center gap-2 rounded-full bg-tinta px-4 py-2.5 text-[14px] font-semibold text-kertas"><BookOpen className="h-4 w-4" aria-hidden />Cari di pustaka hama</Link>
              <Link href={tautanTanya} className="inline-flex items-center gap-2 rounded-full border border-garis px-4 py-2.5 text-[14px] font-semibold"><MessageCircleQuestion className="h-4 w-4" aria-hidden />Tanya asisten</Link>
            </div>
          </div>
        ) : (
          <div className="masuk">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h3 className="text-[19px] font-semibold">Langkah yang disarankan</h3>
                <p className="text-[13.5px] text-lumpur">Berurutan sesuai Pengendalian Hama Terpadu: mulai dari yang paling aman.</p>
              </div>
              <Link href={tautanTanya} className="inline-flex items-center gap-2 rounded-full bg-air px-4 py-2 text-[14px] font-semibold text-kertas">
                <MessageCircleQuestion className="h-4 w-4" aria-hidden />Tanya soal hama ini
              </Link>
            </div>
            <LangkahPHT
              baris={langkah}
              kimiaTerbuka={cocok === "ya"}
              pesanKimiaTerkunci={cocok === "ragu" ? "Karena belum yakin, pilihan obat kimia disembunyikan. Pakai dulu langkah tanpa obat, lalu pastikan jenis hamanya ke petugas." : undefined}
            />
            <details className="mt-6 rounded-kecil bg-tanah px-4 py-3">
              <summary className="cursor-pointer text-[13.5px] font-semibold">Lihat sumber rekomendasi</summary>
              <div className="mt-3"><DaftarSumber sumber={semuaSumberUnik(langkah)} judul="Rekomendasi di atas disusun dari:" /></div>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}
