// Mesin "wawasan": mengubah angka hasil deteksi menjadi kalimat yang mudah dipahami (ID/EN).
import { JADWAL } from "@/lib/data";
import { ambilKelas } from "@/lib/kelas";
import { MENIT_AKHIR, MENIT_AWAL, dariMenit, type Kiriman, type RingkasanUnit } from "@/lib/simulasi";

type B = "id" | "en";
export const WARNA_LAHAN: Record<string, string> = { padi: "#2D6A47", jagung: "#C7951C", bawang: "#8A3F6E" };

export interface StatistikMalam {
  totalHama: number;
  jumlahFoto: number;
  fotoBerisi: number;
  puncak: { kiriman: Kiriman; jumlah: number } | null;
  perLahan: Record<string, number>;
  perHama: { kelas: number; jumlah: number }[];
  yakinTinggi: number;
  perluDicocokkan: number;
  rataYakin: number;
}

export function hitungStatistik(terlihat: Kiriman[]): StatistikMalam {
  const perLahan: Record<string, number> = Object.fromEntries(JADWAL.unit.map((u) => [u.id, 0]));
  const perHama = new Map<number, number>();
  let total = 0, yakinTinggi = 0, perlu = 0, jumlahYakin = 0;
  let puncak: StatistikMalam["puncak"] = null;
  terlihat.forEach((k) => {
    perLahan[k.unitId] += k.deteksi.length;
    total += k.deteksi.length;
    if (!puncak || k.deteksi.length > puncak.jumlah) puncak = { kiriman: k, jumlah: k.deteksi.length };
    k.deteksi.forEach((d) => {
      perHama.set(d.kelas, (perHama.get(d.kelas) ?? 0) + 1);
      jumlahYakin += d.keyakinan;
      if (d.keyakinan >= 0.75) yakinTinggi += 1;
      if (ambilKelas(d.kelas).keandalan !== "tinggi" || d.keyakinan < 0.5) perlu += 1;
    });
  });
  return {
    totalHama: total, jumlahFoto: terlihat.length, fotoBerisi: terlihat.filter((k) => k.deteksi.length).length, puncak, perLahan,
    perHama: [...perHama.entries()].map(([kelas, jumlah]) => ({ kelas, jumlah })).sort((a, b) => b.jumlah - a.jumlah),
    yakinTinggi, perluDicocokkan: perlu, rataYakin: total ? jumlahYakin / total : 0,
  };
}

// Jumlah hama per 30 menit per lahan, untuk grafik "kapan hama paling aktif".
export function aktivitasPerSlot(terlihat: Kiriman[]) {
  const slot: { mulai: number; label: string; perLahan: Record<string, number> }[] = [];
  for (let m = MENIT_AWAL; m < MENIT_AKHIR; m += 30) slot.push({ mulai: m, label: dariMenit(m), perLahan: Object.fromEntries(JADWAL.unit.map((u) => [u.id, 0])) });
  terlihat.forEach((k) => {
    const s = slot.find((x) => k.menit >= x.mulai && k.menit < x.mulai + 30);
    if (s) s.perLahan[k.unitId] += k.deteksi.length;
  });
  return slot;
}

const namaUnit = (id: string, b: B) => {
  const u = JADWAL.unit.find((x) => x.id === id)!;
  return (b === "en" ? u.namaEn : u.nama).toLowerCase();
};
const nh = (k: number, b: B) => (b === "en" ? ambilKelas(k).namaEn : ambilKelas(k).nama).toLowerCase();
const pct = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0);

export interface Wawasan { judul: string; isi: string }

export function laporanMalam(s: StatistikMalam, ringkasan: RingkasanUnit[], jam: string, b: B): Wawasan[] {
  const en = b === "en";
  const hasil: Wawasan[] = [];
  const rata = s.jumlahFoto ? (s.totalHama / s.jumlahFoto).toFixed(1) : "0";
  const rataTeks = en ? rata : rata.replace(".", ",");

  hasil.push(en
    ? { judul: "The night so far", isi: `Since 18.00, the three cameras have sent ${s.jumlahFoto} photos and the system has counted ${s.totalHama} pests, about ${rataTeks} per photo. ${s.fotoBerisi} of ${s.jumlahFoto} photos contained at least one pest, so traps are catching insects steadily rather than in a single burst.` }
    : { judul: "Gambaran malam ini", isi: `Sejak pukul 18.00, tiga kamera sudah mengirim ${s.jumlahFoto} foto dan sistem menghitung ${s.totalHama} hama, rata-rata ${rataTeks} hama per foto. ${s.fotoBerisi} dari ${s.jumlahFoto} foto berisi hama, artinya perangkap menangkap serangga secara terus-menerus, bukan hanya sesekali.` });

  if (s.puncak && s.puncak.jumlah > 0) {
    const k = s.puncak.kiriman;
    const hamaPuncak = nh(k.deteksi[0].kelas, b);
    hasil.push(en
      ? { judul: "Peak activity", isi: `The biggest catch came at ${k.jam} in the ${namaUnit(k.unitId, b)}: ${s.puncak.jumlah} pests in a single photo, mostly ${hamaPuncak}. Many night-active insects are drawn to the trap light, so a spike shows when they are most active. If the same hour spikes again on the next nights, the population is building up.` }
      : { judul: "Puncak aktivitas", isi: `Tangkapan terbanyak terjadi pukul ${k.jam} di ${namaUnit(k.unitId, b)}: ${s.puncak.jumlah} hama dalam satu foto, kebanyakan ${hamaPuncak}. Banyak serangga yang aktif malam hari tertarik cahaya lampu perangkap, jadi lonjakan ini menunjukkan jam ketika hama paling aktif. Kalau lonjakan di jam yang sama terulang pada malam berikutnya, tandanya populasi sedang bertambah.` });
  }

  const urut = [...ringkasan].sort((x, y) => (s.perLahan[y.unitId] ?? 0) - (s.perLahan[x.unitId] ?? 0));
  const teratas = urut[0];
  if (teratas && s.totalHama > 0) {
    const porsi = pct(s.perLahan[teratas.unitId], s.totalHama);
    const hamaUtama = teratas.komposisi[0] ? nh(teratas.komposisi[0].kelas, b) : "";
    const tenang = urut.filter((u) => u.status === "aman").map((u) => namaUnit(u.unitId, b));
    hasil.push(en
      ? { judul: "Where to look first", isi: `The ${namaUnit(teratas.unitId, b)} accounts for ${s.perLahan[teratas.unitId]} of ${s.totalHama} pests tonight (${porsi}%)${hamaUtama ? `, led by ${hamaUtama}` : ""}. Start tomorrow's field check there. ${tenang.length ? `The ${tenang.join(" and the ")} ${tenang.length > 1 ? "are" : "is"} still calm, so a routine weekly check is enough.` : "No field is fully calm right now, so check all three."}` }
      : { judul: "Lahan yang perlu dilihat duluan", isi: `${teratas.nama} menyumbang ${s.perLahan[teratas.unitId]} dari ${s.totalHama} hama malam ini (${porsi}%)${hamaUtama ? `, paling banyak ${hamaUtama}` : ""}. Mulailah pemeriksaan besok pagi dari lahan ini. ${tenang.length ? `${tenang.map((t) => t.charAt(0).toUpperCase() + t.slice(1)).join(" dan ")} masih tenang, cukup diperiksa rutin seminggu sekali.` : "Belum ada lahan yang benar-benar tenang, jadi periksa ketiganya."}` });
  }

  if (s.totalHama > 0) {
    hasil.push(en
      ? { judul: "How much to trust tonight's results", isi: `${s.yakinTinggi} of ${s.totalHama} detections (${pct(s.yakinTinggi, s.totalHama)}%) have high confidence of 75% or more. ${s.perluDicocokkan ? `${s.perluDicocokkan} detections are of pest types the system sometimes confuses, or have low confidence, so compare their signs in the field before acting.` : "All detections are of pest types the system recognises reliably."} The system helps you decide where and what to check; it does not replace your own eyes in the field.` }
      : { judul: "Seberapa bisa dipercaya", isi: `${s.yakinTinggi} dari ${s.totalHama} deteksi (${pct(s.yakinTinggi, s.totalHama)}%) memiliki keyakinan tinggi, yaitu 75% atau lebih. ${s.perluDicocokkan ? `${s.perluDicocokkan} deteksi adalah jenis hama yang kadang tertukar atau keyakinannya rendah, jadi cocokkan dulu cirinya di lahan sebelum bertindak.` : "Semua deteksi adalah jenis hama yang dikenali sistem dengan andal."} Sistem membantu menentukan di mana dan apa yang perlu dicek, bukan menggantikan pengamatan Anda sendiri di lahan.` });
  }
  void jam;
  return hasil;
}
