import hamaJson from "@/lib/data/hama.json";
import pestisidaJson from "@/lib/data/pestisida.json";
import prediksiJson from "@/lib/data/prediksi.json";
import jadwalJson from "@/data/jadwal_simulasi.json";

export interface Sumber { judul: string; url: string | null; lembaga: string; tahun: string }

export interface BarisHama {
  id: string; kelas: number | null; aspek: string; isi: string; catatan: string; wilayah: string; inang: string; teksRag: string; sumber: Sumber[];
}

export type KategoriPht =
  | "peringatan_regulasi" | "ambang_keputusan" | "kultur_teknis_mekanis" | "hayati" | "nabati" | "kimia_sintetik" | "tidak_direkomendasikan";

export interface BarisPestisida {
  id: string; kelas: number | null; kategori: KategoriPht; prioritas: number; tampil: "ya" | "tidak" | "peringatan" | "chatbot";
  judul: string; bahanAktif: string; golongan: string; irac: string; isi: string; syarat: string; status: string; teksRag: string; sumber: Sumber[];
}

export interface Deteksi { kelas: number; keyakinan: number; kotak: [number, number, number, number] }
export interface HasilFoto { lebar: number; tinggi: number; labelAsli: number | null; deteksi: Deteksi[] }

export const BARIS_HAMA = hamaJson as unknown as BarisHama[];
export const BARIS_PESTISIDA = pestisidaJson as unknown as BarisPestisida[];
export const PREDIKSI = prediksiJson as unknown as { model: string; ambangKeyakinan: number; foto: Record<string, HasilFoto> };
export const JADWAL = jadwalJson as unknown as {
  tanggal: string;
  unit: { id: string; nama: string; namaEn: string; komoditas: "Padi" | "Jagung" | "Bawang"; lokasi: string; lokasiEn: string; kodeKamera: string; kodeKameraEn: string }[];
  kiriman: { jam: string; unit: string; foto: string; labelAsliTeks?: string; labelAsliTeksEn?: string }[];
};

export const barisHamaUntuk = (kelas: number) => BARIS_HAMA.filter((b) => b.kelas === kelas);
export const barisPestisidaUntuk = (kelas: number) =>
  BARIS_PESTISIDA.filter((b) => b.kelas === kelas).sort((a, b) => a.prioritas - b.prioritas);

// Ciri yang ditunjukkan ke petani untuk dicocokkan: gejala pada tanaman sektornya dulu,
// bila tidak ada pakai gejala umum, identitas, atau perilaku.
export function ciriUntukDicocokkan(kelas: number, komoditas?: string): BarisHama[] {
  const semua = barisHamaUntuk(kelas);
  const khusus = komoditas ? [`gejala_${komoditas.toLowerCase()}`] : [];
  const urutan = [...khusus, "gejala", "gejala_padi", "gejala_bawang", "perilaku", "identitas", "biologi", "identitas_status"];
  for (const aspek of urutan) {
    const cocok = semua.filter((b) => b.aspek === aspek);
    if (cocok.length) return cocok.slice(0, 2);
  }
  return [];
}

export function semuaSumberUnik(baris: { sumber: Sumber[] }[]): Sumber[] {
  const peta = new Map<string, Sumber>();
  baris.forEach((b) => b.sumber.forEach((s) => { if (!peta.has(s.judul)) peta.set(s.judul, s); }));
  return [...peta.values()];
}
