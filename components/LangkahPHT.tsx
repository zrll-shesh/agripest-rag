"use client";
import { Ban, Bug, FlaskConical, Gauge, Leaf, Lock, ShieldAlert, Sprout } from "lucide-react";
import type { BarisPestisida, KategoriPht } from "@/lib/data";
import { cx } from "@/lib/format";
import { CatatanIsiIndonesia, useBahasa, type Dwibahasa } from "@/lib/i18n";

const CATATAN_LABEL = "Dosis, interval, dan masa tunggu panen WAJIB mengikuti label resmi produk terdaftar; konsultasikan dengan POPT/penyuluh.";
const bersihkan = (t: string) => t.replace(CATATAN_LABEL, "").trim();

const KELOMPOK: { kategori: KategoriPht; judul: Dwibahasa; keterangan: Dwibahasa | null; Ikon: typeof Leaf; warna: string }[] = [
  { kategori: "peringatan_regulasi", judul: { id: "Perhatikan dulu", en: "Read this first" }, keterangan: null, Ikon: ShieldAlert, warna: "text-bata" },
  { kategori: "ambang_keputusan", judul: { id: "Kapan perlu bertindak", en: "When to act" }, keterangan: { id: "Hitung dulu di lahan. Belum tentu perlu disemprot.", en: "Count in the field first. Spraying may not be needed." }, Ikon: Gauge, warna: "text-air" },
  { kategori: "kultur_teknis_mekanis", judul: { id: "Langkah tanpa obat", en: "Steps without pesticides" }, keterangan: { id: "Murah, aman, dan bisa dikerjakan sekarang.", en: "Cheap, safe, and can be done now." }, Ikon: Sprout, warna: "text-daun" },
  { kategori: "hayati", judul: { id: "Musuh alami dan agens hayati", en: "Natural enemies and biocontrol" }, keterangan: { id: "Biarkan alam membantu. Jaga musuh alami di lahan.", en: "Let nature help. Protect natural enemies in the field." }, Ikon: Bug, warna: "text-daun" },
  { kategori: "nabati", judul: { id: "Ramuan nabati", en: "Botanical pesticides" }, keterangan: { id: "Dari bahan tanaman, lebih ramah lingkungan.", en: "Made from plants, gentler on the environment." }, Ikon: Leaf, warna: "text-daun" },
  { kategori: "kimia_sintetik", judul: { id: "Obat kimia, pilihan terakhir", en: "Chemical pesticides, last resort" }, keterangan: { id: "Hanya bila ambang sudah terlewati dan cara lain tidak cukup.", en: "Only when the threshold is passed and other methods are not enough." }, Ikon: FlaskConical, warna: "text-gabah" },
];

function Butir({ b }: { b: BarisPestisida }) {
  const { tx } = useBahasa();
  const adaBahan = b.bahanAktif && b.bahanAktif !== "-";
  const adaIrac = b.irac && !["-", "Cek label"].includes(b.irac) && !b.irac.startsWith("Tidak") && !b.irac.startsWith("Bukan");
  return (
    <li className="rounded-kecil border border-garis bg-kertas px-4 py-3">
      <p className="font-semibold leading-snug">{b.judul}</p>
      <p className="mt-1 text-[14px] leading-relaxed text-tinta/85">{bersihkan(b.isi)}</p>
      {(adaBahan || adaIrac || (b.syarat && b.syarat !== "-")) && (
        <div className="mt-2.5 flex flex-wrap gap-1.5 text-[12.5px]">
          {adaBahan && b.kategori !== "kultur_teknis_mekanis" && b.kategori !== "ambang_keputusan" && (
            <span className="rounded-full bg-tanah px-2.5 py-1"><span className="text-lumpur">{tx({ id: "Bahan:", en: "Agent:" })}</span> {b.bahanAktif}</span>
          )}
          {adaIrac && (
            <span className="rounded-full bg-air-muda px-2.5 py-1 text-air" title={tx({ id: "Golongan cara kerja insektisida (IRAC). Ganti-ganti golongan agar hama tidak kebal.", en: "Insecticide mode-of-action group (IRAC). Rotate groups so pests do not become resistant." })}>
              {tx({ id: "Golongan", en: "Group" })} {b.irac}
            </span>
          )}
          {b.syarat && b.syarat !== "-" && (
            <span className="rounded-full bg-gabah-muda px-2.5 py-1 text-[#6b4805]">{tx({ id: "Syarat:", en: "When:" })} {b.syarat}</span>
          )}
        </div>
      )}
    </li>
  );
}

export default function LangkahPHT({ baris, kimiaTerbuka, pesanKimiaTerkunci }: { baris: BarisPestisida[]; kimiaTerbuka: boolean; pesanKimiaTerkunci?: string }) {
  const { tx } = useBahasa();
  const tampil = baris.filter((b) => b.tampil === "ya");
  const hindari = baris.filter((b) => b.kategori === "tidak_direkomendasikan" || b.tampil === "peringatan" || (b.tampil === "tidak" && b.kelas !== null));
  const kelompokAda = KELOMPOK.filter((k) => tampil.some((b) => b.kategori === k.kategori));
  let nomor = 0;

  return (
    <div className="space-y-6">
      <CatatanIsiIndonesia />
      {kelompokAda.map(({ kategori, judul, keterangan, Ikon, warna }) => {
        const isi = tampil.filter((b) => b.kategori === kategori);
        const terkunci = kategori === "kimia_sintetik" && !kimiaTerbuka;
        const berurut = kategori !== "peringatan_regulasi";
        if (berurut) nomor += 1;
        return (
          <section key={kategori} aria-label={tx(judul)}>
            <div className="mb-2.5 flex items-start gap-3">
              <span className={cx("grid h-8 w-8 shrink-0 place-items-center rounded-full border border-garis bg-kertas font-judul text-[15px] font-bold", warna)}>
                {berurut ? nomor : <Ikon className="h-4 w-4" aria-hidden />}
              </span>
              <div>
                <h4 className="font-judul text-[17px] font-semibold leading-tight">{tx(judul)}</h4>
                {keterangan && <p className="text-[13px] text-lumpur">{tx(keterangan)}</p>}
              </div>
            </div>
            {terkunci ? (
              <div className="ml-11 flex gap-2.5 rounded-kecil border border-dashed border-garis px-4 py-3 text-[13.5px] text-lumpur">
                <Lock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <p>{pesanKimiaTerkunci ?? tx({ id: "Cocokkan ciri hama dulu untuk melihat pilihan obat kimia.", en: "Check the pest signs first to see chemical options." })}</p>
              </div>
            ) : (
              <ul className="ml-11 space-y-2">
                {isi.map((b) => <Butir key={b.id} b={b} />)}
                {kategori === "kimia_sintetik" && (
                  <li className="text-[12.5px] leading-relaxed text-lumpur">
                    {tx({ id: "Takaran, jarak semprot, dan masa tunggu panen selalu mengikuti label resmi produk yang terdaftar. Tanyakan ke petugas POPT atau penyuluh bila ragu.", en: "Dose, spray interval, and pre-harvest interval always follow the official label of a registered product. Ask a pest observer or extension officer if unsure." })}
                  </li>
                )}
              </ul>
            )}
          </section>
        );
      })}

      {hindari.length > 0 && (
        <section aria-label={tx({ id: "Hindari", en: "Avoid" })} className="rounded-panel bg-bata-muda/60 px-4 py-4">
          <div className="mb-2 flex items-center gap-2 text-bata">
            <Ban className="h-[18px] w-[18px]" aria-hidden />
            <h4 className="font-judul text-[17px] font-semibold">{tx({ id: "Jangan lakukan ini", en: "Do not do this" })}</h4>
          </div>
          <ul className="space-y-2.5">
            {hindari.map((b) => (
              <li key={b.id} className="text-[14px] leading-relaxed">
                <span className="font-semibold">{b.judul}.</span> {bersihkan(b.isi)}
                {/^dilarang/i.test(b.status) && <span className="ml-1 rounded-full bg-bata px-2 py-0.5 text-[11.5px] font-bold text-kertas">{tx({ id: "Dilarang", en: "Banned" })}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
