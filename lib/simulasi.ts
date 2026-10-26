import { JADWAL, PREDIKSI, type Deteksi } from "@/lib/data";
import { ambilKelas } from "@/lib/kelas";

export type StatusLahan = "aman" | "waspada" | "perlu-dicek";

export interface Kiriman {
  urutan: number;
  jam: string;
  menit: number;
  unitId: string;
  foto: string;
  lebar: number;
  tinggi: number;
  deteksi: Deteksi[];
  labelAsli: number | null;
  labelAsliTeks?: string;
  labelAsliTeksEn?: string;
}

// Batas status dipakai untuk simulasi: jumlah hama tertangkap dalam 2 jam terakhir per unit perangkap.
export const JENDELA_MENIT = 120;
export const BATAS_WASPADA = 3;
export const BATAS_PERLU_DICEK = 6;

export const keMenit = (jam: string) => {
  const [j, m] = jam.split(".").map(Number);
  return j * 60 + m;
};
export const dariMenit = (menit: number) => `${String(Math.floor(menit / 60)).padStart(2, "0")}.${String(menit % 60).padStart(2, "0")}`;

export const SEMUA_KIRIMAN: Kiriman[] = JADWAL.kiriman
  .map((k) => ({ ...k, menit: keMenit(k.jam) }))
  .sort((a, b) => a.menit - b.menit)
  .map((k, urutan) => {
    const hasil = PREDIKSI.foto[k.foto];
    return {
      urutan, jam: k.jam, menit: k.menit, unitId: k.unit, foto: k.foto,
      lebar: hasil?.lebar ?? 4, tinggi: hasil?.tinggi ?? 3, deteksi: hasil?.deteksi ?? [],
      labelAsli: hasil?.labelAsli ?? null, labelAsliTeks: k.labelAsliTeks, labelAsliTeksEn: k.labelAsliTeksEn,
    };
  });

export const MENIT_AWAL = Math.floor(SEMUA_KIRIMAN[0].menit / 60) * 60;
export const MENIT_AKHIR = Math.ceil((SEMUA_KIRIMAN[SEMUA_KIRIMAN.length - 1].menit + 1) / 60) * 60;

export interface RingkasanUnit {
  unitId: string;
  nama: string;
  namaEn: string;
  komoditas: "Padi" | "Jagung" | "Bawang";
  lokasi: string;
  lokasiEn: string;
  kodeKamera: string;
  kodeKameraEn: string;
  jumlahFoto: number;
  jumlahHamaJendela: number;
  status: StatusLahan;
  hamaTerbanyak: { kelas: number; jumlah: number } | null;
  komposisi: { kelas: number; jumlah: number }[];
  kirimanTerakhir: Kiriman | null;
  arah: "naik" | "turun" | "tetap" | null;
}

export function statusDariJumlah(n: number): StatusLahan {
  if (n >= BATAS_PERLU_DICEK) return "perlu-dicek";
  if (n >= BATAS_WASPADA) return "waspada";
  return "aman";
}

export function ringkasUnit(terlihat: Kiriman[], menitSekarang: number): RingkasanUnit[] {
  return JADWAL.unit.map((u) => {
    const milikUnit = terlihat.filter((k) => k.unitId === u.id);
    const jendela = milikUnit.filter((k) => k.menit > menitSekarang - JENDELA_MENIT);
    const hitung = new Map<number, number>();
    jendela.forEach((k) => k.deteksi.forEach((d) => hitung.set(d.kelas, (hitung.get(d.kelas) ?? 0) + 1)));
    const jumlah = [...hitung.values()].reduce((a, b) => a + b, 0);
    const komposisi = [...hitung.entries()].sort((a, b) => b[1] - a[1]).map(([kelas, jumlah]) => ({ kelas, jumlah }));
    const terbanyak = komposisi[0];
    const dua = milikUnit.slice(-2);
    let arah: RingkasanUnit["arah"] = null;
    if (dua.length === 2) {
      const [a, b] = dua.map((k) => k.deteksi.length);
      arah = b > a ? "naik" : b < a ? "turun" : "tetap";
    }
    return {
      unitId: u.id, nama: u.nama, namaEn: u.namaEn, komoditas: u.komoditas, lokasi: u.lokasi, lokasiEn: u.lokasiEn, kodeKamera: u.kodeKamera, kodeKameraEn: u.kodeKameraEn,
      jumlahFoto: milikUnit.length, jumlahHamaJendela: jumlah, status: statusDariJumlah(jumlah),
      hamaTerbanyak: terbanyak ?? null, komposisi,
      kirimanTerakhir: milikUnit[milikUnit.length - 1] ?? null, arah,
    };
  });
}

const URUT_STATUS: Record<StatusLahan, number> = { "perlu-dicek": 2, waspada: 1, aman: 0 };

// Kalimat utama di atas dashboard. Disusun dari angka, bukan ditulis tangan.
export function kalimatRingkasan(ringkasan: RingkasanUnit[], jamSekarang: string, bahasa: "id" | "en" = "id"): { judul: string; lanjutan: string } {
  const en = bahasa === "en";
  const urut = [...ringkasan].sort((a, b) => URUT_STATUS[b.status] - URUT_STATUS[a.status] || b.jumlahHamaJendela - a.jumlahHamaJendela);
  const teratas = urut[0];
  if (!teratas || teratas.jumlahHamaJendela === 0) {
    return en
      ? { judul: `As of ${jamSekarang}, no pests have been caught in any of the three fields.`, lanjutan: "The cameras keep taking a photo every 30 minutes." }
      : { judul: `Sampai pukul ${jamSekarang}, belum ada hama tertangkap di ketiga lahan.`, lanjutan: "Kamera tetap memotret setiap 30 menit." };
  }
  const nm = (k: number) => (en ? ambilKelas(k).namaEn.toLowerCase() : ambilKelas(k).nama.toLowerCase());
  const [satu, dua] = teratas.komposisi;
  const mayoritas = satu.jumlah > teratas.jumlahHamaJendela / 2;
  const isiHama = teratas.komposisi.length === 1
    ? (en ? `all ${nm(satu.kelas)}` : `semuanya ${nm(satu.kelas)}`)
    : mayoritas
      ? (en ? `mostly ${nm(satu.kelas)}` : `kebanyakan ${nm(satu.kelas)}`)
      : (en ? `mainly ${nm(satu.kelas)} and ${nm(dua.kelas)}` : `terutama ${nm(satu.kelas)} dan ${nm(dua.kelas)}`);
  const ajakan = {
    "perlu-dicek": en ? "Inspect the field tomorrow morning before deciding on any action." : "Periksa lahan besok pagi sebelum memutuskan tindakan.",
    waspada: en ? "No action needed yet, but watch the next catches." : "Belum perlu tindakan, tapi pantau tangkapan berikutnya.",
    aman: en ? "Things are still calm." : "Kondisi masih tenang.",
  }[teratas.status];
  const namaLahan = (u: RingkasanUnit) => (en ? u.namaEn : u.nama).toLowerCase();
  const pendek = (u: RingkasanUnit) => (en ? u.namaEn.replace(" field", "") : u.nama.replace("Lahan ", "")).toLowerCase();
  const lainnya = urut.slice(1).map((u) =>
    `${pendek(u)} ${u.jumlahHamaJendela === 0 ? (en ? "no catches yet" : "belum ada tangkapan") : en ? `${u.jumlahHamaJendela} ${u.jumlahHamaJendela === 1 ? "pest" : "pests"}` : `${u.jumlahHamaJendela} hama`}`
  );
  if (en) {
    return {
      judul: `At ${jamSekarang}, the ${namaLahan(teratas)} is the busiest: ${teratas.jumlahHamaJendela} ${teratas.jumlahHamaJendela === 1 ? "pest" : "pests"} caught in the last 2 hours, ${isiHama}.`,
      lanjutan: `${ajakan} Other fields: ${lainnya.join(", ")}.`,
    };
  }
  return {
    judul: `Pukul ${jamSekarang}, ${namaLahan(teratas)} paling ramai: ${teratas.jumlahHamaJendela} hama tertangkap dalam 2 jam terakhir, ${isiHama}.`,
    lanjutan: `${ajakan} Lahan lain: ${lainnya.join(", ")}.`,
  };
}
