// 24 kelas hama yang dikenali model YOLO11l. Urutan id sama dengan keluaran model.
// Keandalan dan AP@50 diambil dari hasil evaluasi pada data uji (lihat CSV referensi hama, aspek keandalan_deteksi).

export type Komoditas = "Padi" | "Jagung" | "Bawang";
export type Keandalan = "tinggi" | "sedang" | "rendah" | "belum-terukur";

export interface InfoKelas {
  id: number;
  nama: string;
  namaEn: string;
  namaIlmiah: string;
  namaIp102: string;
  komoditas: Komoditas;
  keandalan: Keandalan;
  ap50: number | null;
}

export const DAFTAR_KELAS: InfoKelas[] = [
  { id: 0, nama: "Penggulung daun padi", namaEn: "Rice leaffolder", namaIlmiah: "Cnaphalocrocis medinalis", namaIp102: "rice leaf roller", komoditas: "Padi", keandalan: "tinggi", ap50: 0.99 },
  { id: 1, nama: "Ulat daun padi", namaEn: "Green semilooper", namaIlmiah: "Naranga aenescens", namaIp102: "rice leaf caterpillar", komoditas: "Padi", keandalan: "rendah", ap50: 0.65 },
  { id: 2, nama: "Lalat penggerek pucuk padi", namaEn: "Rice whorl maggot", namaIlmiah: "Hydrellia spp.", namaIp102: "paddy stem maggot", komoditas: "Padi", keandalan: "belum-terukur", ap50: null },
  { id: 3, nama: "Penggerek batang padi bergaris", namaEn: "Striped stem borer", namaIlmiah: "Chilo suppressalis", namaIp102: "asiatic rice borer", komoditas: "Padi", keandalan: "sedang", ap50: 0.74 },
  { id: 4, nama: "Penggerek batang padi kuning", namaEn: "Yellow stem borer", namaIlmiah: "Scirpophaga incertulas", namaIp102: "yellow rice borer", komoditas: "Padi", keandalan: "tinggi", ap50: 0.99 },
  { id: 5, nama: "Ganjur", namaEn: "Rice gall midge", namaIlmiah: "Orseolia oryzae", namaIp102: "rice gall midge", komoditas: "Padi", keandalan: "sedang", ap50: 0.99 },
  { id: 6, nama: "Lalat batang padi", namaEn: "Rice stem maggot", namaIlmiah: "Chlorops oryzae", namaIp102: "Rice Stemfly", komoditas: "Padi", keandalan: "belum-terukur", ap50: null },
  { id: 7, nama: "Wereng batang coklat", namaEn: "Brown planthopper", namaIlmiah: "Nilaparvata lugens", namaIp102: "brown plant hopper", komoditas: "Padi", keandalan: "rendah", ap50: 0.66 },
  { id: 8, nama: "Wereng punggung putih", namaEn: "White-backed planthopper", namaIlmiah: "Sogatella furcifera", namaIp102: "white backed plant hopper", komoditas: "Padi", keandalan: "sedang", ap50: 0.83 },
  { id: 9, nama: "Wereng coklat kecil", namaEn: "Small brown planthopper", namaIlmiah: "Laodelphax striatellus", namaIp102: "small brown plant hopper", komoditas: "Padi", keandalan: "rendah", ap50: 0.5 },
  { id: 10, nama: "Kumbang moncong air padi", namaEn: "Rice water weevil", namaIlmiah: "Lissorhoptrus oryzophilus", namaIp102: "rice water weevil", komoditas: "Padi", keandalan: "tinggi", ap50: 0.99 },
  { id: 11, nama: "Wereng hijau", namaEn: "Green leafhopper", namaIlmiah: "Nephotettix spp.", namaIp102: "rice leafhopper", komoditas: "Padi", keandalan: "tinggi", ap50: 0.99 },
  { id: 12, nama: "Thrips padi", namaEn: "Rice thrips", namaIlmiah: "Stenchaetothrips biformis", namaIp102: "grain spreader thrips", komoditas: "Padi", keandalan: "belum-terukur", ap50: null },
  { id: 13, nama: "Keong mas", namaEn: "Golden apple snail", namaIlmiah: "Pomacea canaliculata", namaIp102: "rice shell pest", komoditas: "Padi", keandalan: "belum-terukur", ap50: null },
  { id: 14, nama: "Penggerek batang jagung", namaEn: "Asian corn borer", namaIlmiah: "Ostrinia furnacalis", namaIp102: "corn borer", komoditas: "Jagung", keandalan: "sedang", ap50: 0.76 },
  { id: 15, nama: "Ulat grayak tentara", namaEn: "Oriental armyworm", namaIlmiah: "Mythimna separata", namaIp102: "army worm", komoditas: "Jagung", keandalan: "rendah", ap50: 0.83 },
  { id: 16, nama: "Kutu daun jagung", namaEn: "Corn leaf aphid", namaIlmiah: "Rhopalosiphum maidis", namaIp102: "aphids", komoditas: "Jagung", keandalan: "sedang", ap50: 0.83 },
  { id: 17, nama: "Ulat tanah hitam", namaEn: "Black cutworm", namaIlmiah: "Agrotis ipsilon", namaIp102: "black cutworm", komoditas: "Jagung", keandalan: "sedang", ap50: 0.83 },
  { id: 18, nama: "Ulat tanah besar", namaEn: "Large cutworm", namaIlmiah: "Agrotis tokionis", namaIp102: "large cutworm", komoditas: "Jagung", keandalan: "rendah", ap50: 0.81 },
  { id: 19, nama: "Ulat tanah kuning", namaEn: "Yellow cutworm", namaIlmiah: "Agrotis segetum", namaIp102: "yellow cutworm", komoditas: "Jagung", keandalan: "rendah", ap50: 0.53 },
  { id: 20, nama: "Uret", namaEn: "White grub", namaIlmiah: "Scarabaeidae", namaIp102: "grub", komoditas: "Bawang", keandalan: "tinggi", ap50: 0.95 },
  { id: 21, nama: "Orong-orong", namaEn: "Mole cricket", namaIlmiah: "Gryllotalpa spp.", namaIp102: "mole cricket", komoditas: "Bawang", keandalan: "tinggi", ap50: 0.99 },
  { id: 22, nama: "Uret kawat", namaEn: "Wireworm", namaIlmiah: "Elateridae", namaIp102: "wireworm", komoditas: "Bawang", keandalan: "tinggi", ap50: 0.99 },
  { id: 23, nama: "Thrips bawang", namaEn: "Onion thrips", namaIlmiah: "Thrips tabaci", namaIp102: "Thrips", komoditas: "Bawang", keandalan: "rendah", ap50: 0 },
];

export const ambilKelas = (id: number): InfoKelas => DAFTAR_KELAS[id];

export const namaKelas = (k: InfoKelas, bahasa: "id" | "en") => (bahasa === "en" ? k.namaEn : k.nama);

type Teks = { id: string; en: string };
export const TEKS_KEANDALAN: Record<Keandalan, { label: Teks; penjelasan: Teks }> = {
  tinggi: {
    label: { id: "Sistem andal untuk hama ini", en: "Reliable for this pest" },
    penjelasan: { id: "Pada pengujian, sistem hampir selalu benar mengenali hama ini.", en: "In testing, the system almost always identified this pest correctly." },
  },
  sedang: {
    label: { id: "Sistem cukup andal", en: "Fairly reliable" },
    penjelasan: { id: "Pada pengujian, sistem kadang keliru. Cocokkan ciri sebelum bertindak.", en: "In testing, the system was sometimes wrong. Check the signs before acting." },
  },
  rendah: {
    label: { id: "Sistem sering keliru", en: "Often mistaken" },
    penjelasan: { id: "Pada pengujian, hama ini sering tertukar. Wajib dicocokkan atau ditanyakan ke petugas.", en: "In testing, this pest was often confused with others. Check the signs or ask an extension officer." },
  },
  "belum-terukur": {
    label: { id: "Belum teruji", en: "Not yet tested" },
    penjelasan: { id: "Belum ada contoh hama ini di data uji. Wajib dicocokkan atau ditanyakan ke petugas.", en: "There were no test examples of this pest yet. Check the signs or ask an extension officer." },
  },
};
