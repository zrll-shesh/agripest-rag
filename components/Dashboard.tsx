"use client";
import { useEffect, useMemo, useState } from "react";
import { Pause, Play, RotateCcw, SkipForward } from "lucide-react";
import GarisWaktu from "@/components/GarisWaktu";
import FotoDeteksi from "@/components/FotoDeteksi";
import PanelKeputusan from "@/components/PanelKeputusan";
import { GrafikAktivitas, JudulBagian, KunciBaca, LaporanMalam, RencanaBesok } from "@/components/Wawasan";
import { SEMUA_KIRIMAN, kalimatRingkasan, keMenit, ringkasUnit } from "@/lib/simulasi";
import { hitungStatistik, laporanMalam } from "@/lib/wawasan";
import { JADWAL } from "@/lib/data";
import { ambilKelas, namaKelas } from "@/lib/kelas";
import { useBahasa } from "@/lib/i18n";

const JEDA_MS = 4500;
// Dasbor dibuka langsung pada kondisi pukul 19.00 (lima uret di lahan bawang merah), dalam keadaan dijeda.
const JAM_AWAL = "19.00";
const MULAI_DARI = SEMUA_KIRIMAN.filter((k) => k.menit <= keMenit(JAM_AWAL)).length;

export default function Dashboard() {
  const { bahasa, tx } = useBahasa();
  const en = bahasa === "en";
  const total = SEMUA_KIRIMAN.length;
  const [jumlahTampil, setJumlahTampil] = useState(MULAI_DARI);
  const [berjalan, setBerjalan] = useState(false);
  const [pilihanManual, setPilihanManual] = useState<number | null>(null);

  useEffect(() => {
    if (!berjalan) return;
    if (jumlahTampil >= total) { setBerjalan(false); return; }
    const t = setTimeout(() => setJumlahTampil((n) => Math.min(n + 1, total)), JEDA_MS);
    return () => clearTimeout(t);
  }, [berjalan, jumlahTampil, total]);

  const terlihat = useMemo(() => SEMUA_KIRIMAN.slice(0, jumlahTampil), [jumlahTampil]);
  const terbaru = terlihat[terlihat.length - 1];
  const ringkasan = useMemo(() => ringkasUnit(terlihat, terbaru.menit), [terlihat, terbaru.menit]);
  const statistik = useMemo(() => hitungStatistik(terlihat), [terlihat]);
  const { judul, lanjutan } = kalimatRingkasan(ringkasan, terbaru.jam, bahasa);
  const wawasan = laporanMalam(statistik, ringkasan, terbaru.jam, bahasa);

  const urutanTerpilih = pilihanManual ?? terbaru.urutan;
  const kiriman = SEMUA_KIRIMAN[urutanTerpilih];
  const unit = JADWAL.unit.find((u) => u.id === kiriman.unitId)!;
  const selesai = jumlahTampil >= total;
  const namaUnit = en ? unit.namaEn : unit.nama;
  const kamera = en ? unit.kodeKameraEn : unit.kodeKamera;
  const perluDicek = ringkasan.filter((u) => u.status === "perlu-dicek").length;

  const pilihFoto = (u: number) => {
    setPilihanManual(u === terbaru.urutan ? null : u);
    document.getElementById("periksa-foto")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const namaHamaFoto = [...new Set(kiriman.deteksi.map((d) => namaKelas(ambilKelas(d.kelas), bahasa).toLowerCase()))].join(en ? " and " : " dan ");
  const ringkasFoto = kiriman.deteksi.length
    ? en ? `The system found ${kiriman.deteksi.length} ${namaHamaFoto} in this photo.` : `Sistem menemukan ${kiriman.deteksi.length} ekor ${namaHamaFoto} di foto ini.`
    : tx({ id: "Tidak ada hama di foto ini.", en: "No pests in this photo." });

  const angka = [
    { nilai: String(statistik.totalHama), label: tx({ id: "hama tertangkap malam ini", en: "pests caught tonight" }) },
    { nilai: statistik.puncak ? statistik.puncak.kiriman.jam : "-", label: tx({ id: "jam paling ramai", en: "busiest time" }) },
    { nilai: `${perluDicek} / 3`, label: tx({ id: "lahan perlu dicek", en: "fields to check" }) },
    { nilai: statistik.totalHama ? `${Math.round(statistik.rataYakin * 100)}%` : "-", label: tx({ id: "rata-rata keyakinan", en: "average confidence" }) },
  ];

  return (
    <div className="space-y-12 lg:space-y-16">
      {/* Hero: laporan langsung dari pos pantau malam */}
      <section className="latar-malam -mx-4 overflow-hidden text-kertas sm:mx-0 sm:rounded-[26px]">
        <div className="grid gap-6 px-5 pb-6 pt-7 sm:px-8 sm:pt-9 lg:grid-cols-[1fr_auto] lg:gap-10 lg:px-10">
          <div className="max-w-[48rem]">
            <p className="flex items-center gap-2 text-[13.5px] text-kertas/70">
              <span className={`h-2 w-2 rounded-full ${berjalan ? "bg-[#F2C14E] denyut" : "bg-kertas/40"}`} aria-hidden />
              {tx({ id: "Simulasi kiriman kamera lampu perangkap, malam 28 Oktober 2026", en: "Simulated light-trap camera feed, night of 28 October 2026" })}
            </p>
            <h1 className="mt-3 text-[27px] font-bold leading-[1.12] sm:text-[38px] lg:text-[46px]" aria-live="polite">{judul}</h1>
            <p className="mt-4 max-w-[40rem] text-[16px] leading-relaxed text-kertas/80 sm:text-[17px]">{lanjutan}</p>
          </div>
          <div className="flex items-center gap-3 self-start rounded-panel bg-white/[0.07] p-2 pl-4 ring-1 ring-white/10 lg:flex-col lg:items-stretch lg:p-4">
            <div className="flex-1 lg:text-center">
              <p className="text-[12.5px] text-kertas/65">{tx({ id: "Jam simulasi", en: "Simulation time" })}</p>
              <p className="font-judul text-[30px] font-bold leading-none tabular-nums lg:text-[46px]">{terbaru.jam}</p>
            </div>
            <div className="flex gap-1.5">
              {selesai ? (
                <button type="button" onClick={() => { setJumlahTampil(1); setPilihanManual(null); setBerjalan(true); }} className="flex items-center gap-1.5 rounded-full bg-[#F2C14E] px-4 py-2.5 text-[14px] font-bold text-tinta">
                  <RotateCcw className="h-4 w-4" aria-hidden /> {tx({ id: "Ulangi", en: "Replay" })}
                </button>
              ) : (
                <>
                  <button type="button" onClick={() => setBerjalan((b) => !b)} className="flex items-center gap-1.5 rounded-full bg-[#F2C14E] px-4 py-2.5 text-[14px] font-bold text-tinta" aria-label={berjalan ? tx({ id: "Jeda simulasi", en: "Pause simulation" }) : tx({ id: "Lanjutkan simulasi", en: "Resume simulation" })}>
                    {berjalan ? <Pause className="h-4 w-4" aria-hidden /> : <Play className="h-4 w-4" aria-hidden />}
                    {berjalan ? tx({ id: "Jeda", en: "Pause" }) : tx({ id: "Lanjut", en: "Resume" })}
                  </button>
                  <button type="button" onClick={() => { setJumlahTampil(total); setBerjalan(false); }} className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-white/25 hover:bg-white/10" aria-label="Tampilkan semua kiriman" title={tx({ id: "Tampilkan semua kiriman", en: "Show all photos" })}>
                    <SkipForward className="h-4 w-4" aria-hidden />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        <dl className="grid grid-cols-2 border-t border-white/10 lg:grid-cols-4">
          {angka.map((a, i) => (
            <div key={i} className={`px-5 py-4 sm:px-8 lg:px-10 ${i % 2 === 1 ? "border-l border-white/10" : ""} ${i >= 2 ? "border-t border-white/10 lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""}`}>
              <dd className="font-judul text-[26px] font-bold tabular-nums sm:text-[32px]">{a.nilai}</dd>
              <dt className="text-[13px] text-kertas/65">{a.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="rencana">
        <div id="rencana"><JudulBagian nomor="01" judul={tx({ id: "Rencana untuk besok pagi", en: "Plan for tomorrow morning" })}
          keterangan={tx({ id: "Ringkasan per lahan: apa yang tertangkap, kenapa hama itu merugikan, apa yang perlu dicek, dan langkah pertama tanpa obat. Ketuk nama hama untuk melihat fotonya.", en: "Per field: what was caught, why that pest matters, what to check, and the first step without pesticides. Tap a pest name to see its photo." })} /></div>
        <RencanaBesok ringkasan={ringkasan} pilihFoto={pilihFoto} />
      </section>

      <section aria-labelledby="garis-waktu">
        <div id="garis-waktu"><JudulBagian nomor="02" judul={tx({ id: "Garis waktu tangkapan", en: "Catch timeline" })}
          keterangan={tx({ id: "Setiap titik adalah satu foto dari kamera. Angka di dalamnya adalah jumlah hama di foto itu. Ketuk titik untuk memeriksa fotonya.", en: "Each dot is one camera photo. The number inside is the pests in that photo. Tap a dot to inspect the photo." })} /></div>
        <GarisWaktu semua={SEMUA_KIRIMAN} jumlahTampil={jumlahTampil} menitSekarang={terbaru.menit} ringkasan={ringkasan} terpilih={urutanTerpilih} terbaru={terbaru.urutan} pilih={pilihFoto} />
      </section>

      <section aria-labelledby="laporan">
        <div id="laporan"><JudulBagian nomor="03" judul={tx({ id: "Laporan malam ini", en: "Tonight's report" })}
          keterangan={tx({ id: "Ditulis otomatis dari hasil deteksi, diperbarui setiap ada foto baru.", en: "Written automatically from the detections, updated with every new photo." })} /></div>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)]">
          <GrafikAktivitas terlihat={terlihat} />
          <LaporanMalam wawasan={wawasan} />
        </div>
      </section>

      <section aria-labelledby="periksa-foto" className="scroll-mt-24">
        <div id="periksa-foto" className="scroll-mt-24"><JudulBagian nomor="04" judul={tx({ id: "Periksa foto dan putuskan tindakan", en: "Inspect the photo and decide" })}
          keterangan={tx({ id: "Cocokkan hasil sistem dengan yang Anda lihat, lalu ikuti langkah yang disusun dari yang paling aman.", en: "Compare the system's result with what you see, then follow the steps ordered from safest first." })} /></div>
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start">
          <div className="space-y-3 lg:sticky lg:top-24">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-[19px] font-semibold">{en ? `${namaUnit}, ${kiriman.jam}` : `${namaUnit}, pukul ${kiriman.jam}`}</h3>
              {pilihanManual !== null ? (
                <button type="button" onClick={() => setPilihanManual(null)} className="text-[13.5px] font-semibold text-air underline underline-offset-2">{tx({ id: "Kembali ke foto terbaru", en: "Back to latest photo" })}</button>
              ) : (
                <span className="text-[13px] text-lumpur">{tx({ id: "Foto terbaru", en: "Latest photo" })}</span>
              )}
            </div>
            <FotoDeteksi key={kiriman.foto} foto={kiriman.foto} lebar={kiriman.lebar} tinggi={kiriman.tinggi} deteksi={kiriman.deteksi} judul={en ? `${kamera} photo at ${kiriman.jam}` : `Foto ${kamera} pukul ${kiriman.jam}`} />
            <p className="text-[15px]">{ringkasFoto}</p>
            <details className="rounded-kecil border border-garis bg-kertas px-4 py-3 text-[13.5px]">
              <summary className="cursor-pointer font-semibold">{tx({ id: "Info pengujian", en: "Testing info" })}</summary>
              <p className="mt-2 leading-relaxed text-lumpur">
                {en
                  ? `This photo ${kiriman.labelAsli !== null ? `comes from the IP102 test set, true label: ${ambilKelas(kiriman.labelAsli).namaEn.toLowerCase()}` : `is ${(kiriman.labelAsliTeksEn ?? "a photo outside the dataset").toLowerCase()}`}. Boxes and confidence are real outputs of the YOLO11l model (confidence threshold 35%), computed in advance so the simulation stays light.`
                  : `Foto ini ${kiriman.labelAsli !== null ? `berasal dari data uji IP102 dengan label asli ${ambilKelas(kiriman.labelAsli).nama.toLowerCase()}` : `adalah ${kiriman.labelAsliTeks?.toLowerCase() ?? "foto luar dataset"}`}. Kotak dan keyakinan adalah keluaran asli model YOLO11l (ambang keyakinan 35%), dihitung sebelumnya agar simulasi berjalan ringan.`}
              </p>
            </details>
          </div>
          <PanelKeputusan key={kiriman.urutan} deteksi={kiriman.deteksi} namaLahan={namaUnit} jam={kiriman.jam} />
        </div>
      </section>

      <section aria-labelledby="kunci-baca">
        <div id="kunci-baca"><JudulBagian nomor="05" judul={tx({ id: "Cara membaca layar ini", en: "How to read this screen" })} /></div>
        <KunciBaca />
      </section>
    </div>
  );
}
