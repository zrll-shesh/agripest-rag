"use client";
import { BadgeCheck, Eye, Gauge, ListOrdered, Sprout, TrafficCone } from "lucide-react";
import { ambilKelas, namaKelas } from "@/lib/kelas";
import { PENGETAHUAN } from "@/lib/pengetahuan";
import { WARNA_LAHAN, aktivitasPerSlot, type Wawasan } from "@/lib/wawasan";
import type { Kiriman, RingkasanUnit } from "@/lib/simulasi";
import { JADWAL } from "@/lib/data";
import { LencanaStatus } from "@/components/Lencana";
import { useBahasa } from "@/lib/i18n";

export function JudulBagian({ nomor, judul, keterangan }: { nomor: string; judul: string; keterangan?: string }) {
  return (
    <div className="mb-6 flex gap-4">
      <span className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-daun font-judul text-[15px] font-bold text-kertas shadow-[0_0_0_5px_rgba(45,106,71,0.12)]">{Number(nomor)}</span>
      <div>
        <h2 className="text-[24px] font-semibold leading-tight sm:text-[28px]">{judul}</h2>
        {keterangan && <p className="mt-1.5 max-w-[52rem] text-[15px] leading-relaxed text-lumpur">{keterangan}</p>}
      </div>
    </div>
  );
}

// Tiga kartu rencana untuk besok pagi, satu per lahan.
export function RencanaBesok({ ringkasan, pilihFoto }: { ringkasan: RingkasanUnit[]; pilihFoto: (urutan: number) => void }) {
  const { bahasa, tx } = useBahasa();
  const en = bahasa === "en";
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {ringkasan.map((u) => {
        const top = u.hamaTerbanyak;
        const kartu = top ? PENGETAHUAN[top.kelas] : null;
        const kelas = top ? ambilKelas(top.kelas) : null;
        return (
          <article key={u.unitId} className="flex flex-col overflow-hidden rounded-[22px] border border-garis bg-kertas shadow-[0_1px_0_rgba(23,37,29,0.04)]">
            <div className="relative px-5 pb-4 pt-5" style={{ background: `linear-gradient(135deg, ${WARNA_LAHAN[u.unitId]}1F, ${WARNA_LAHAN[u.unitId]}08)` }}>
              <span className="absolute left-0 top-5 h-8 w-1 rounded-r-full" style={{ background: WARNA_LAHAN[u.unitId] }} aria-hidden />
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-[19px] font-semibold">{en ? u.namaEn : u.nama}</h3>
                <LencanaStatus status={u.status} />
              </div>
              <p className="mt-0.5 text-[12.5px] text-lumpur">{en ? u.lokasiEn : u.lokasi}</p>
            </div>
            <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
              {!top || !kartu || !kelas ? (
                <p className="mt-3 text-[15px] leading-relaxed text-tinta/85">
                  {tx({ id: "Belum ada hama tertangkap dalam 2 jam terakhir. Tidak ada tindakan khusus; lanjutkan pemeriksaan rutin seminggu sekali.", en: "No pests caught in the last 2 hours. No special action; keep the routine weekly check." })}
                </p>
              ) : (
                <>
                  <p className="mt-3 text-[15px] leading-relaxed">
                    <span className="font-judul text-[28px] font-bold leading-none">{u.jumlahHamaJendela}</span>{" "}
                    {en
                      ? `${u.jumlahHamaJendela === 1 ? "pest" : "pests"} in 2 hours, mostly `
                      : "hama dalam 2 jam, terbanyak "}
                    <button type="button" onClick={() => u.kirimanTerakhir && pilihFoto(u.kirimanTerakhir.urutan)} className="font-semibold underline decoration-garis decoration-2 underline-offset-4 hover:decoration-tinta">
                      {namaKelas(kelas, bahasa).toLowerCase()}
                    </button>
                  </p>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-tinta/85">{tx(kartu.bahaya)}</p>
                  <dl className="mt-4 space-y-2.5 text-[14px] leading-relaxed">
                    <div className="flex gap-3 rounded-2xl bg-air-muda/60 px-3.5 py-3">
                      <Eye className="mt-0.5 h-4 w-4 shrink-0 text-air" aria-hidden />
                      <div><dt className="font-semibold">{tx({ id: "Cek besok pagi", en: "Check tomorrow morning" })}</dt><dd className="text-tinta/85">{tx(kartu.cekBesok)}</dd></div>
                    </div>
                    <div className="flex gap-3 rounded-2xl bg-daun-muda/70 px-3.5 py-3">
                      <Sprout className="mt-0.5 h-4 w-4 shrink-0 text-daun" aria-hidden />
                      <div><dt className="font-semibold">{tx({ id: "Langkah pertama tanpa obat", en: "First step, no pesticide" })}</dt><dd className="text-tinta/85">{tx(kartu.langkahPertama)}</dd></div>
                    </div>
                  </dl>
                </>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}

// Grafik batang bertumpuk: jumlah hama per 30 menit per lahan.
export function GrafikAktivitas({ terlihat }: { terlihat: Kiriman[] }) {
  const { bahasa, tx } = useBahasa();
  const slot = aktivitasPerSlot(terlihat);
  const totals = slot.map((s) => Object.values(s.perLahan).reduce((a, b) => a + b, 0));
  const maks = Math.max(1, ...totals);
  const iPuncak = totals.indexOf(Math.max(...totals));
  const sPuncak = slot[iPuncak];
  const lahanPuncak = JADWAL.unit.slice().sort((a, b) => sPuncak.perLahan[b.id] - sPuncak.perLahan[a.id])[0];
  const terisi = totals.filter((x) => x > 0).length;
  return (
    <figure className="flex flex-col rounded-[22px] border border-garis bg-kertas p-6">
      <figcaption className="text-[17px] font-semibold">{tx({ id: "Kapan hama paling aktif", en: "When pests are most active" })}</figcaption>
      <p className="mt-0.5 text-[13.5px] text-lumpur">{tx({ id: "Jumlah hama tertangkap setiap 30 menit", en: "Pests caught every 30 minutes" })}</p>
      <div className="mt-5 flex h-[180px] items-end gap-2 sm:gap-3" role="img" aria-label={tx({ id: "Grafik jumlah hama per 30 menit", en: "Chart of pests per 30 minutes" })}>
        {slot.map((s) => {
          const total = Object.values(s.perLahan).reduce((a, b) => a + b, 0);
          return (
            <div key={s.label} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
              <span className="text-[12.5px] font-bold tabular-nums">{total || ""}</span>
              <div className="flex w-full max-w-[44px] flex-col-reverse overflow-hidden rounded-t-[8px]" style={{ height: `${(total / maks) * 100}%`, minHeight: total ? 6 : 2, background: total ? undefined : "#DCE2D8" }}>
                {JADWAL.unit.map((u) => s.perLahan[u.id] > 0 && (
                  <div key={u.id} style={{ height: `${(s.perLahan[u.id] / total) * 100}%`, background: WARNA_LAHAN[u.id] }} />
                ))}
              </div>
              <span className="text-[11.5px] tabular-nums text-lumpur">{s.label}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-lumpur">
        {JADWAL.unit.map((u) => (
          <span key={u.id} className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm" style={{ background: WARNA_LAHAN[u.id] }} />{bahasa === "en" ? u.namaEn : u.nama}</span>
        ))}
      </div>
      {totals[iPuncak] > 0 && (
        <p className="mt-auto border-t border-garis pt-4 text-[14.5px] leading-relaxed text-tinta/85">
          {bahasa === "en"
            ? `Activity peaked in the ${sPuncak.label} slot with ${totals[iPuncak]} pests, mostly from the ${lahanPuncak.namaEn.toLowerCase()}. Pests were caught in ${terisi} of ${slot.length} half-hour slots. Compare this pattern with the next nights: if the peak keeps rising, the population is growing.`
            : `Aktivitas memuncak pada pukul ${sPuncak.label} dengan ${totals[iPuncak]} hama, paling banyak dari ${lahanPuncak.nama.toLowerCase()}. Hama tertangkap pada ${terisi} dari ${slot.length} rentang setengah jam. Bandingkan pola ini dengan malam-malam berikutnya: bila puncaknya terus naik, populasi hama sedang bertambah.`}
        </p>
      )}
    </figure>
  );
}

export function LaporanMalam({ wawasan }: { wawasan: Wawasan[] }) {
  return (
    <ol className="grid gap-4 sm:grid-cols-2">
      {wawasan.map((w, i) => (
        <li key={w.judul} className="rounded-[22px] border border-garis bg-kertas p-5">
          <div className="flex items-center gap-2.5">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-gabah-muda font-judul text-[13px] font-bold text-[#7a5206]">{i + 1}</span>
            <h3 className="text-[17.5px] font-semibold leading-snug">{w.judul}</h3>
          </div>
          <p className="mt-2 text-[14.5px] leading-relaxed text-tinta/85">{w.isi}</p>
        </li>
      ))}
    </ol>
  );
}

// Penjelasan istilah di layar dengan bahasa sehari-hari.
export function KunciBaca() {
  const { tx } = useBahasa();
  const butir = [
    { Ikon: TrafficCone, warna: "text-bata bg-bata-muda", judul: { id: "Status lahan", en: "Field status" }, isi: { id: "Aman berarti kurang dari 3 hama tertangkap dalam 2 jam terakhir. Waspada berarti 3 sampai 5 hama: belum perlu tindakan, tapi perhatikan. Perlu dicek berarti 6 hama atau lebih: turun ke lahan besok pagi. Status ini tanda untuk memeriksa, bukan perintah menyemprot.", en: "Safe means fewer than 3 pests caught in the last 2 hours. Watch means 3 to 5: no action yet, but pay attention. Check now means 6 or more: go to the field tomorrow morning. Status is a cue to inspect, not an order to spray." } },
    { Ikon: Gauge, warna: "text-air bg-air-muda", judul: { id: "Keyakinan", en: "Confidence" }, isi: { id: "Persentase di setiap kotak menunjukkan seberapa yakin sistem tentang jenis hamanya. 75% ke atas berarti yakin, 50 sampai 74% cukup yakin, di bawah 50% kurang yakin. Makin rendah, makin penting mencocokkan sendiri.", en: "The percentage on each box shows how sure the system is about the pest type. 75% and above is confident, 50 to 74% fairly confident, under 50% not confident. The lower it is, the more important it is to check yourself." } },
    { Ikon: BadgeCheck, warna: "text-daun bg-daun-muda", judul: { id: "Keandalan", en: "Reliability" }, isi: { id: "Berbeda dengan keyakinan, keandalan adalah catatan dari pengujian: seberapa sering sistem benar untuk jenis hama tertentu. Ada hama yang hampir selalu benar, ada yang sering tertukar. Sistem memberi tahu Anda bila hama yang terdeteksi termasuk yang sering tertukar.", en: "Unlike confidence, reliability comes from testing: how often the system was right for a given pest type. Some pests are almost always right, others are often confused. The system tells you when a detected pest is one that is often confused." } },
    { Ikon: ListOrdered, warna: "text-[#7a5206] bg-gabah-muda", judul: { id: "Urutan langkah", en: "Order of steps" }, isi: { id: "Langkah selalu disusun dari yang paling aman: cek ambang, cara tanpa obat, musuh alami, ramuan nabati, lalu obat kimia sebagai pilihan terakhir. Obat kimia baru muncul setelah Anda menyatakan ciri hamanya cocok.", en: "Steps always go from safest first: check the threshold, non-chemical methods, natural enemies, botanicals, then chemicals as a last resort. Chemicals only appear after you confirm the pest signs match." } },
  ];
  return (
    <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {butir.map((b) => (
        <div key={b.judul.id} className="rounded-[22px] bg-kertas p-5 ring-1 ring-garis">
          <dt className="flex items-center gap-2.5 text-[16px] font-semibold"><span className={`grid h-8 w-8 place-items-center rounded-full ${b.warna}`}><b.Ikon className="h-4 w-4" aria-hidden /></span>{tx(b.judul)}</dt>
          <dd className="mt-2 text-[14px] leading-relaxed text-tinta/85">{tx(b.isi)}</dd>
        </div>
      ))}
    </dl>
  );
}
