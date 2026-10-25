// 24 kelas hama yang dikenali model YOLO11l. Urutan id sama dengan keluaran model.
// Keandalan dan AP@50 diambil dari hasil evaluasi pada data uji (lihat CSV referensi hama, aspek keandalan_deteksi).

export type Komoditas = "Padi" | "Jagung" | "Bawang";
export type Keandalan = "tinggi" | "sedang" | "rendah" | "belum-terukur";

export interface InfoKelas {
  id: number;
  nama: string;
  namaIlmiah: string;
  namaIp102: string;
  komoditas: Komoditas;
  keandalan: Keandalan;
  ap50: number | null;
}

export const DAFTAR_KELAS: InfoKelas[] = [
  { id: 0, nama: "Penggulung daun padi", namaIlmiah: "Cnaphalocrocis medinalis", namaIp102: "rice leaf roller", komoditas: "Padi", keandalan: "tinggi", ap50: 0.99 },
  { id: 1, nama: "Ulat daun padi", namaIlmiah: "Naranga aenescens", namaIp102: "rice leaf caterpillar", komoditas: "Padi", keandalan: "rendah", ap50: 0.65 },
  { id: 2, nama: "Lalat penggerek pucuk padi", namaIlmiah: "Hydrellia spp.", namaIp102: "paddy stem maggot", komoditas: "Padi", keandalan: "belum-terukur", ap50: null },
  { id: 3, nama: "Penggerek batang padi bergaris", namaIlmiah: "Chilo suppressalis", namaIp102: "asiatic rice borer", komoditas: "Padi", keandalan: "sedang", ap50: 0.74 },
  { id: 4, nama: "Penggerek batang padi kuning", namaIlmiah: "Scirpophaga incertulas", namaIp102: "yellow rice borer", komoditas: "Padi", keandalan: "tinggi", ap50: 0.99 },
  { id: 5, nama: "Ganjur", namaIlmiah: "Orseolia oryzae", namaIp102: "rice gall midge", komoditas: "Padi", keandalan: "sedang", ap50: 0.99 },
  { id: 6, nama: "Lalat batang padi", namaIlmiah: "Chlorops oryzae", namaIp102: "Rice Stemfly", komoditas: "Padi", keandalan: "belum-terukur", ap50: null },
  { id: 7, nama: "Wereng batang coklat", namaIlmiah: "Nilaparvata lugens", namaIp102: "brown plant hopper", komoditas: "Padi", keandalan: "rendah", ap50: 0.66 },
  { id: 8, nama: "Wereng punggung putih", namaIlmiah: "Sogatella furcifera", namaIp102: "white backed plant hopper", komoditas: "Padi", keandalan: "sedang", ap50: 0.83 },
  { id: 9, nama: "Wereng coklat kecil", namaIlmiah: "Laodelphax striatellus", namaIp102: "small brown plant hopper", komoditas: "Padi", keandalan: "rendah", ap50: 0.5 },
  { id: 10, nama: "Kumbang moncong air padi", namaIlmiah: "Lissorhoptrus oryzophilus", namaIp102: "rice water weevil", komoditas: "Padi", keandalan: "tinggi", ap50: 0.99 },
  { id: 11, nama: "Wereng hijau", namaIlmiah: "Nephotettix spp.", namaIp102: "rice leafhopper", komoditas: "Padi", keandalan: "tinggi", ap50: 0.99 },
  { id: 12, nama: "Thrips padi", namaIlmiah: "Stenchaetothrips biformis", namaIp102: "grain spreader thrips", komoditas: "Padi", keandalan: "belum-terukur", ap50: null },
  { id: 13, nama: "Keong mas", namaIlmiah: "Pomacea canaliculata", namaIp102: "rice shell pest", komoditas: "Padi", keandalan: "belum-terukur", ap50: null },
  { id: 14, nama: "Penggerek batang jagung", namaIlmiah: "Ostrinia furnacalis", namaIp102: "corn borer", komoditas: "Jagung", keandalan: "sedang", ap50: 0.76 },
  { id: 15, nama: "Ulat grayak tentara", namaIlmiah: "Mythimna separata", namaIp102: "army worm", komoditas: "Jagung", keandalan: "rendah", ap50: 0.83 },
  { id: 16, nama: "Kutu daun jagung", namaIlmiah: "Rhopalosiphum maidis", namaIp102: "aphids", komoditas: "Jagung", keandalan: "sedang", ap50: 0.83 },
  { id: 17, nama: "Ulat tanah hitam", namaIlmiah: "Agrotis ipsilon", namaIp102: "black cutworm", komoditas: "Jagung", keandalan: "sedang", ap50: 0.83 },
  { id: 18, nama: "Ulat tanah besar", namaIlmiah: "Agrotis tokionis", namaIp102: "large cutworm", komoditas: "Jagung", keandalan: "rendah", ap50: 0.81 },
  { id: 19, nama: "Ulat tanah kuning", namaIlmiah: "Agrotis segetum", namaIp102: "yellow cutworm", komoditas: "Jagung", keandalan: "rendah", ap50: 0.53 },
  { id: 20, nama: "Uret", namaIlmiah: "Scarabaeidae", namaIp102: "grub", komoditas: "Bawang", keandalan: "tinggi", ap50: 0.95 },
  { id: 21, nama: "Orong-orong", namaIlmiah: "Gryllotalpa spp.", namaIp102: "mole cricket", komoditas: "Bawang", keandalan: "tinggi", ap50: 0.99 },
  { id: 22, nama: "Uret kawat", namaIlmiah: "Elateridae", namaIp102: "wireworm", komoditas: "Bawang", keandalan: "tinggi", ap50: 0.99 },
  { id: 23, nama: "Thrips bawang", namaIlmiah: "Thrips tabaci", namaIp102: "Thrips", komoditas: "Bawang", keandalan: "rendah", ap50: 0 },
];

export const ambilKelas = (id: number): InfoKelas => DAFTAR_KELAS[id];

export const TEKS_KEANDALAN: Record<Keandalan, { label: string; penjelasan: string }> = {
  tinggi: { label: "Sistem andal untuk hama ini", penjelasan: "Pada pengujian, sistem hampir selalu benar mengenali hama ini." },
  sedang: { label: "Sistem cukup andal", penjelasan: "Pada pengujian, sistem kadang keliru. Cocokkan ciri sebelum bertindak." },
  rendah: { label: "Sistem sering keliru", penjelasan: "Pada pengujian, hama ini sering tertukar. Wajib dicocokkan atau ditanyakan ke petugas." },
  "belum-terukur": { label: "Belum teruji", penjelasan: "Belum ada contoh hama ini di data uji. Wajib dicocokkan atau ditanyakan ke petugas." },
};
