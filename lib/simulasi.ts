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
      labelAsli: hasil?.labelAsli ?? null, labelAsliTeks: k.labelAsliTeks,
    };
  });

export const MENIT_AWAL = Math.floor(SEMUA_KIRIMAN[0].menit / 60) * 60;
export const MENIT_AKHIR = Math.ceil((SEMUA_KIRIMAN[SEMUA_KIRIMAN.length - 1].menit + 1) / 60) * 60;

export interface RingkasanUnit {
  unitId: string;
  nama: string;
  komoditas: "Padi" | "Jagung" | "Bawang";
  lokasi: string;
  kodeKamera: string;
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
      unitId: u.id, nama: u.nama, komoditas: u.komoditas, lokasi: u.lokasi, kodeKamera: u.kodeKamera,
      jumlahFoto: milikUnit.length, jumlahHamaJendela: jumlah, status: statusDariJumlah(jumlah),
      hamaTerbanyak: terbanyak ?? null, komposisi,
      kirimanTerakhir: milikUnit[milikUnit.length - 1] ?? null, arah,
    };
  });
}

const URUT_STATUS: Record<StatusLahan, number> = { "perlu-dicek": 2, waspada: 1, aman: 0 };

// Kalimat utama di atas dashboard. Disusun dari angka, bukan ditulis tangan.
export function kalimatRingkasan(ringkasan: RingkasanUnit[], jamSekarang: string): { judul: string; lanjutan: string } {
  const urut = [...ringkasan].sort((a, b) => URUT_STATUS[b.status] - URUT_STATUS[a.status] || b.jumlahHamaJendela - a.jumlahHamaJendela);
  const teratas = urut[0];
  if (!teratas || teratas.jumlahHamaJendela === 0) {
    return { judul: `Sampai pukul ${jamSekarang}, belum ada hama tertangkap di ketiga lahan.`, lanjutan: "Kamera tetap memotret setiap 30 menit." };
  }
  const nama = teratas.nama.toLowerCase();
  const nm = (k: number) => ambilKelas(k).nama.toLowerCase();
  const [satu, dua] = teratas.komposisi;
  const isiHama =
    teratas.komposisi.length === 1
      ? `semuanya ${nm(satu.kelas)}`
      : satu.jumlah > teratas.jumlahHamaJendela / 2
        ? `kebanyakan ${nm(satu.kelas)}`
        : `terutama ${nm(satu.kelas)} dan ${nm(dua.kelas)}`;
  const ajakan =
    teratas.status === "perlu-dicek"
      ? "Periksa lahan besok pagi sebelum memutuskan tindakan."
      : teratas.status === "waspada"
        ? "Belum perlu tindakan, tapi pantau tangkapan berikutnya."
        : "Kondisi masih tenang.";
  const judul = `Pukul ${jamSekarang}, ${nama} paling ramai: ${teratas.jumlahHamaJendela} hama tertangkap dalam 2 jam terakhir, ${isiHama}.`;
  const lainnya = urut.slice(1).map((u) => `${u.nama.replace("Lahan ", "").toLowerCase()} ${u.jumlahHamaJendela === 0 ? "belum ada tangkapan" : `${u.jumlahHamaJendela} hama`}`);
  return { judul, lanjutan: `${ajakan} Lahan lain: ${lainnya.join(", ")}.` };
}
