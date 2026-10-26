# AgriPest-RAG

Dibuat oleh **Nazril Ravi Pratama**, S1 Sains Data, Universitas Negeri Surabaya (2026).

Dashboard simulasi pemantauan hama padi, jagung, dan bawang merah. Foto dari kamera lampu perangkap (disimulasikan) dikenali model **YOLO11l**, lalu sistem menyusun **langkah Pengendalian Hama Terpadu (PHT)** yang berurutan dan patuh aturan pestisida, dilengkapi **asisten tanya-jawab RAG** (Gemini) yang hanya menjawab dari pustaka sumber resmi.

Next.js 14 (App Router), TypeScript, Tailwind CSS. Tampil baik di desktop dan ponsel, dengan pilihan bahasa **Indonesia / English** (tombol ID | EN di kanan atas; pilihan tersimpan di browser). Di mode English, seluruh tampilan dan jawaban asisten berbahasa Inggris, sedangkan isi pustaka dari CSV tetap dikutip dalam bahasa Indonesia sesuai sumber aslinya.

## Halaman

| Rute | Isi |
|---|---|
| `/` Pantau lahan | Simulasi kiriman kamera tiap 30 menit di 3 lahan, garis waktu malam, status lahan, foto berkotak deteksi, cocokkan ciri, langkah PHT |
| `/hama` Pustaka hama | 24 hama, saring per tanaman, cari nama atau gejala |
| `/hama/[id]` | Ciri, kapan muncul, cara memantau, keandalan sistem, langkah PHT, sumber |
| `/tanya` Tanya asisten | Chatbot RAG, membawa konteks hama yang sedang dilihat |
| `/cara-kerja` | Alur sistem, tiga pengaman, kinerja YOLO11l, sumber pengetahuan |
| `/api/tanya` | API asisten (server). Tanpa kunci API tetap jalan dalam "mode pustaka" |

## Menjalankan di komputer

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # cek build produksi
```

## Deploy ke Vercel

1. Push folder ini ke GitHub, lalu impor repositori di Vercel (framework terdeteksi otomatis sebagai Next.js).
2. Di Vercel: **Settings > Environment Variables**, tambahkan:
   - `GEMINI_API_KEY` = kunci API dari Google AI Studio (wajib agar asisten memakai AI)
   - `GEMINI_MODEL` (opsional) = default `gemini-3.5-flash-lite` (gemini-2.5-flash-lite sudah tidak tersedia untuk pengguna baru)
3. Deploy ulang setelah menambah variabel. Kunci API hanya dipakai di server, tidak pernah terkirim ke browser.

## Struktur data

```
data/
  agripest_referensi_hama.csv        Pustaka hama + analisis keandalan model (sumber RAG)
  agripest_referensi_pestisida.csv   Rekomendasi PHT, bahan aktif, golongan IRAC, status aturan
  jadwal_simulasi.json               Lahan, jam, dan foto untuk simulasi kiriman kamera
public/sampel/                       Foto sampel (data uji IP102 + 3 foto luar dataset)
lib/data/prediksi.json               Keluaran asli YOLO11l untuk setiap foto sampel
lib/data/hama.json, pestisida.json   Dibuat otomatis dari CSV setiap `npm run dev/build`
scripts/siapkan-data.mjs             Konversi CSV ke JSON
scripts/prediksi_sampel.py           Menjalankan YOLO11l (ONNX) pada foto sampel
```

**Mengubah isi pustaka atau rekomendasi:** cukup edit CSV di `data/`, lalu build ulang.

## Menambah foto sampel (misalnya wereng batang coklat)

1. Taruh foto di `public/sampel/` (nama pola IP102 seperti `IP007000123.jpg` otomatis dikenali label aslinya).
2. Tambahkan barisnya di `data/jadwal_simulasi.json` (jam, unit `padi`/`jagung`/`bawang`, nama foto).
3. Jalankan prediksi dengan model ONNX (berkas model tidak disertakan di repositori karena ukurannya ~97 MB):

```bash
pip install onnxruntime pillow numpy
python scripts/prediksi_sampel.py --model path/ke/yolo11l_best.onnx
```

## Cara sistem menyusun rekomendasi

- Langkah selalu berurutan sesuai PHT: perhatian, ambang, tanpa obat, hayati, nabati, lalu obat kimia sebagai pilihan terakhir.
- Obat kimia baru tampil setelah petani menandai ciri hama **cocok**. Bila **tidak cocok**, sistem tidak memberi saran obat.
- Bahan aktif yang dilarang untuk padi (Permentan No. 43/2019) tidak pernah direkomendasikan; obat dengan catatan resistensi diberi peringatan.
- Takaran dan jarak semprot tidak pernah diberikan: selalu mengikuti label resmi produk terdaftar.

## Catatan simulasi

Foto adalah foto uji; kotak, jenis, dan keyakinan adalah keluaran asli YOLO11l (ambang 0,35), dihitung sebelumnya agar web ringan. Status lahan memakai batas contoh: jumlah hama tertangkap dalam 2 jam terakhir (di bawah 3 aman, 3 sampai 5 waspada, 6 atau lebih perlu dicek), sebagai pemicu pengamatan lapangan.
