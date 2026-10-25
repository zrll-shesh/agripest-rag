// Mengubah kedua CSV referensi di folder data/ menjadi JSON di lib/data/.
// Dijalankan otomatis sebelum build (npm run build) sehingga cukup edit CSV-nya saja.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

function bacaCsv(teks) {
  if (teks.charCodeAt(0) === 0xfeff) teks = teks.slice(1);
  const baris = []; let kolom = []; let sel = ""; let dalamKutip = false;
  for (let i = 0; i < teks.length; i++) {
    const c = teks[i];
    if (dalamKutip) {
      if (c === '"') { if (teks[i + 1] === '"') { sel += '"'; i++; } else dalamKutip = false; }
      else sel += c;
    } else if (c === '"') dalamKutip = true;
    else if (c === ",") { kolom.push(sel); sel = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && teks[i + 1] === "\n") i++;
      kolom.push(sel); sel = ""; if (kolom.some((k) => k !== "")) baris.push(kolom); kolom = [];
    } else sel += c;
  }
  if (sel !== "" || kolom.length) { kolom.push(sel); baris.push(kolom); }
  const [kepala, ...isi] = baris;
  return isi.map((b) => Object.fromEntries(kepala.map((k, j) => [k, b[j] ?? ""])));
}

const pecahSumber = (r) => {
  const judul = r.sumber_judul.split(" || "), url = r.sumber_url.split(" || "), lembaga = (r.sumber_lembaga ?? r.sumber_penulis_lembaga ?? "").split(" || "), tahun = r.sumber_tahun.split(" || ");
  return judul.map((j, i) => ({ judul: j, url: url[i] && url[i] !== "-" ? url[i] : null, lembaga: lembaga[i] ?? "", tahun: tahun[i] ?? "" }));
};

const hama = bacaCsv(readFileSync("data/agripest_referensi_hama.csv", "utf8")).map((r) => ({
  id: r.id_chunk, kelas: r.id_kelas === "-" ? null : Number(r.id_kelas), aspek: r.aspek, isi: r.isi,
  catatan: r.catatan_validasi, wilayah: r.relevansi_wilayah, inang: r.tanaman_inang_terkait, teksRag: r.teks_rag, sumber: pecahSumber(r),
}));
const pestisida = bacaCsv(readFileSync("data/agripest_referensi_pestisida.csv", "utf8")).map((r) => ({
  id: r.id_ref, kelas: r.id_kelas === "-" ? null : Number(r.id_kelas), kategori: r.kategori, prioritas: Number(r.prioritas_tampil),
  tampil: r.tampil_di_web, judul: r.label_kartu, bahanAktif: r.bahan_aktif, golongan: r.golongan_kimia, irac: r.kelompok_IRAC,
  isi: r.isi_rekomendasi, syarat: r.syarat_aplikasi, status: r.status_regulasi, teksRag: r.teks_rag, sumber: pecahSumber(r),
}));
mkdirSync("lib/data", { recursive: true });
writeFileSync("lib/data/hama.json", JSON.stringify(hama));
writeFileSync("lib/data/pestisida.json", JSON.stringify(pestisida));
console.log(`Data siap: ${hama.length} baris hama, ${pestisida.length} baris pestisida`);
