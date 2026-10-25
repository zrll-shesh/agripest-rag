"use client";
import { useEffect, useMemo, useState } from "react";
import { Pause, Play, RotateCcw, SkipForward } from "lucide-react";
import GarisWaktu from "@/components/GarisWaktu";
import FotoDeteksi from "@/components/FotoDeteksi";
import PanelKeputusan from "@/components/PanelKeputusan";
import { SEMUA_KIRIMAN, kalimatRingkasan, ringkasUnit } from "@/lib/simulasi";
import { JADWAL } from "@/lib/data";
import { ambilKelas } from "@/lib/kelas";

const JEDA_MS = 4500;
const MULAI_DARI = 4;

export default function Dashboard() {
  const total = SEMUA_KIRIMAN.length;
  const [jumlahTampil, setJumlahTampil] = useState(MULAI_DARI);
  const [berjalan, setBerjalan] = useState(true);
  const [pilihanManual, setPilihanManual] = useState<number | null>(null);

  useEffect(() => {
    if (!berjalan) return;
    if (jumlahTampil >= total) { setBerjalan(false); return; }
    const t = setTimeout(() => setJumlahTampil((n) => Math.min(n + 1, total)), JEDA_MS);
    return () => clearTimeout(t);
  }, [berjalan, jumlahTampil, total]);

  const terlihat = SEMUA_KIRIMAN.slice(0, jumlahTampil);
  const terbaru = terlihat[terlihat.length - 1];
  const menitSekarang = terbaru.menit;
  const ringkasan = useMemo(() => ringkasUnit(terlihat, menitSekarang), [terlihat, menitSekarang]);
  const { judul, lanjutan } = kalimatRingkasan(ringkasan, terbaru.jam);

  const urutanTerpilih = pilihanManual ?? terbaru.urutan;
  const kiriman = SEMUA_KIRIMAN[urutanTerpilih];
  const unit = JADWAL.unit.find((u) => u.id === kiriman.unitId)!;
  const selesai = jumlahTampil >= total;

  const ringkasFoto = kiriman.deteksi.length
    ? `Sistem menemukan ${kiriman.deteksi.length} ekor ${[...new Set(kiriman.deteksi.map((d) => ambilKelas(d.kelas).nama.toLowerCase()))].join(" dan ")} di foto ini.`
    : "Tidak ada hama di foto ini.";

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="max-w-[46rem]">
          <p className="text-[14px] text-lumpur">Simulasi kiriman kamera lampu perangkap, malam 28 Oktober 2026</p>
          <h1 className="mt-2 text-[28px] font-bold leading-[1.12] sm:text-[38px] lg:text-[44px]" aria-live="polite">{judul}</h1>
          <p className="mt-3 text-[16px] leading-relaxed text-tinta/80 sm:text-[17px]">{lanjutan}</p>
        </div>
        <div className="flex items-center gap-3 rounded-panel border border-garis bg-kertas p-2 pl-4 lg:flex-col lg:items-stretch lg:p-3">
          <div className="flex-1 lg:text-center">
            <p className="text-[12.5px] text-lumpur">Jam simulasi</p>
            <p className="font-judul text-[30px] font-bold leading-none tabular-nums lg:text-[40px]">{terbaru.jam}</p>
          </div>
          <div className="flex gap-1.5">
            {selesai ? (
              <button type="button" onClick={() => { setJumlahTampil(1); setPilihanManual(null); setBerjalan(true); }} className="flex items-center gap-1.5 rounded-full bg-tinta px-4 py-2.5 text-[14px] font-semibold text-kertas">
                <RotateCcw className="h-4 w-4" aria-hidden /> Ulangi
              </button>
            ) : (
              <>
                <button type="button" onClick={() => setBerjalan((b) => !b)} className="flex items-center gap-1.5 rounded-full bg-tinta px-4 py-2.5 text-[14px] font-semibold text-kertas" aria-label={berjalan ? "Jeda simulasi" : "Lanjutkan simulasi"}>
                  {berjalan ? <Pause className="h-4 w-4" aria-hidden /> : <Play className="h-4 w-4" aria-hidden />}
                  {berjalan ? "Jeda" : "Lanjut"}
                </button>
                <button type="button" onClick={() => { setJumlahTampil(total); setBerjalan(false); }} className="grid h-10 w-10 place-items-center rounded-full border border-garis" aria-label="Tampilkan semua kiriman" title="Tampilkan semua kiriman">
                  <SkipForward className="h-4 w-4" aria-hidden />
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      <section aria-label="Garis waktu kiriman foto">
        <GarisWaktu
          semua={SEMUA_KIRIMAN}
          jumlahTampil={jumlahTampil}
          menitSekarang={menitSekarang}
          ringkasan={ringkasan}
          terpilih={urutanTerpilih}
          terbaru={terbaru.urutan}
          pilih={(u) => { setPilihanManual(u === terbaru.urutan ? null : u); }}
        />
      </section>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start" aria-label="Foto terpilih dan langkah tindakan">
        <div className="space-y-3 lg:sticky lg:top-24">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-[20px] font-semibold">{unit.nama}, pukul {kiriman.jam}</h2>
            {pilihanManual !== null ? (
              <button type="button" onClick={() => setPilihanManual(null)} className="text-[13.5px] font-semibold text-air underline underline-offset-2">Kembali ke foto terbaru</button>
            ) : (
              <span className="text-[13px] text-lumpur">Foto terbaru</span>
            )}
          </div>
          <FotoDeteksi key={kiriman.foto} foto={kiriman.foto} lebar={kiriman.lebar} tinggi={kiriman.tinggi} deteksi={kiriman.deteksi} judul={`Foto ${unit.kodeKamera} pukul ${kiriman.jam}`} />
          <p className="text-[15px]">{ringkasFoto}</p>
          <details className="rounded-kecil border border-garis bg-kertas px-4 py-3 text-[13.5px]">
            <summary className="cursor-pointer font-semibold">Info pengujian</summary>
            <p className="mt-2 leading-relaxed text-lumpur">
              Foto ini {kiriman.labelAsli !== null ? `berasal dari data uji IP102 dengan label asli ${ambilKelas(kiriman.labelAsli).nama.toLowerCase()}` : `adalah ${kiriman.labelAsliTeks?.toLowerCase() ?? "foto luar dataset"}`}.
              {" "}Kotak dan keyakinan adalah keluaran asli model YOLO11l (ambang keyakinan 35%), dihitung sebelumnya agar simulasi berjalan ringan.
            </p>
          </details>
        </div>
        <PanelKeputusan key={kiriman.urutan} deteksi={kiriman.deteksi} namaLahan={unit.nama} jam={kiriman.jam} />
      </section>
    </div>
  );
}
