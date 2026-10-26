"use client";
import { MENIT_AKHIR, MENIT_AWAL, dariMenit, type Kiriman, type RingkasanUnit } from "@/lib/simulasi";
import { ambilKelas, namaKelas } from "@/lib/kelas";
import { useBahasa } from "@/lib/i18n";
import { LencanaStatus } from "@/components/Lencana";
import { cx } from "@/lib/format";

const posisi = (menit: number) => ((menit - MENIT_AWAL) / (MENIT_AKHIR - MENIT_AWAL)) * 100;
const JAM_PENANDA = Array.from({ length: (MENIT_AKHIR - MENIT_AWAL) / 30 + 1 }, (_, i) => MENIT_AWAL + i * 30);

interface Props {
  semua: Kiriman[];
  jumlahTampil: number;
  menitSekarang: number;
  ringkasan: RingkasanUnit[];
  terpilih: number;
  terbaru: number;
  pilih: (urutan: number) => void;
}

// Garis waktu malam: satu baris per lahan, satu titik per foto yang dikirim kamera.
export default function GarisWaktu({ semua, jumlahTampil, menitSekarang, ringkasan, terpilih, terbaru, pilih }: Props) {
  const { bahasa, tx } = useBahasa();
  const en = bahasa === "en";
  return (
    <div className="overflow-hidden rounded-panel border border-garis bg-kertas">
      {ringkasan.map((u, baris) => {
        const milik = semua.filter((k) => k.unitId === u.unitId);
        return (
          <div key={u.unitId} className={cx("grid gap-x-6 gap-y-3 px-4 py-4 sm:px-5 lg:grid-cols-[280px_1fr] lg:items-center", baris > 0 && "border-t border-garis")}>
            <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2 lg:block">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-[18px] font-semibold leading-tight">{en ? u.namaEn : u.nama}</h3>
                  <LencanaStatus status={u.status} />
                </div>
                <p className="mt-0.5 text-[13px] text-lumpur">{en ? u.kodeKameraEn : u.kodeKamera} · {en ? u.lokasiEn : u.lokasi}</p>
              </div>
              <div className="lg:mt-2.5">
                <p className="text-[13.5px]">
                  <span className="font-judul text-[22px] font-bold leading-none">{u.jumlahHamaJendela}</span>{" "}
                  <span className="text-lumpur">{tx({ id: "hama, 2 jam terakhir", en: u.jumlahHamaJendela === 1 ? "pest, last 2 hours" : "pests, last 2 hours" })}</span>
                </p>
                {u.hamaTerbanyak && (
                  <p className="mt-0.5 text-[13px] text-lumpur">{tx({ id: "Terbanyak", en: "Most" })} {namaKelas(ambilKelas(u.hamaTerbanyak.kelas), bahasa).toLowerCase()}</p>
                )}
              </div>
            </div>

            <div className="gulir-tipis -mx-1 overflow-x-auto px-1 pb-1">
              <div className="relative mx-4 h-[58px] min-w-[520px]">
                <div className="absolute inset-x-0 top-[22px] h-[2px] rounded bg-garis" />
                <div className="absolute left-0 top-[22px] h-[2px] rounded bg-tinta/70" style={{ width: `${posisi(menitSekarang)}%` }} />
                {baris === ringkasan.length - 1 &&
                  JAM_PENANDA.map((m) => (
                    <span key={m} className="absolute top-[42px] -translate-x-1/2 text-[11px] text-lumpur" style={{ left: `${posisi(m)}%` }}>
                      {dariMenit(m)}
                    </span>
                  ))}
                {milik.map((k) => {
                  const terlihat = k.urutan < jumlahTampil;
                  const jumlah = k.deteksi.length;
                  const aktif = terpilih === k.urutan;
                  const warna = jumlah >= 4 ? "bg-bata text-kertas" : jumlah >= 2 ? "bg-gabah text-kertas" : "bg-daun text-kertas";
                  const nama = jumlah ? namaKelas(ambilKelas(k.deteksi[0].kelas), bahasa) : tx({ id: "tidak ada hama", en: "no pests" });
                  return (
                    <button
                      key={k.urutan}
                      type="button"
                      disabled={!terlihat}
                      onClick={() => pilih(k.urutan)}
                      aria-label={terlihat ? (en ? `${u.namaEn}, ${k.jam}: ${jumlah} ${nama}` : `${u.nama}, pukul ${k.jam}: ${jumlah} ${nama}`) : en ? `Photo scheduled at ${k.jam}, not sent yet` : `Jadwal foto pukul ${k.jam}, belum dikirim`}
                      aria-pressed={aktif}
                      className={cx(
                        "absolute top-[23px] grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full font-judul text-[13px] font-bold transition-transform",
                        terlihat ? cx(warna, "h-8 w-8 hover:scale-110") : "h-4 w-4 border-2 border-dashed border-garis bg-kertas",
                        aktif && "ring-[3px] ring-tinta ring-offset-2",
                        terlihat && k.urutan === terbaru && "denyut"
                      )}
                      style={{ left: `${posisi(k.menit)}%` }}
                    >
                      {terlihat ? jumlah : null}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 border-t border-garis bg-tanah/60 px-4 py-2.5 text-[12.5px] text-lumpur sm:px-5">
        <span>{tx({ id: "Angka di titik = jumlah hama di foto", en: "Number in dot = pests in the photo" })}</span>
        <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-daun" /> {tx({ id: "1 hama", en: "1 pest" })}</span>
        <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-gabah" /> {tx({ id: "2 sampai 3", en: "2 to 3" })}</span>
        <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-bata" /> {tx({ id: "4 atau lebih", en: "4 or more" })}</span>
        <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full border-2 border-dashed border-garis" /> {tx({ id: "jadwal berikutnya", en: "next scheduled" })}</span>
      </div>
    </div>
  );
}
