import Link from "next/link";
import { BARIS_HAMA, BARIS_PESTISIDA, semuaSumberUnik } from "@/lib/data";
import { BATAS_PERLU_DICEK, BATAS_WASPADA } from "@/lib/simulasi";

export const metadata = { title: "Cara kerja · AgriPest-RAG" };

const LANGKAH = [
  { judul: "Kamera di lampu perangkap memotret", isi: "Setiap 30 menit, kamera di atas wadah lampu perangkap mengirim foto tangkapan. Di prototipe ini, kiriman foto disimulasikan dengan foto uji." },
  { judul: "Sistem mengenali hamanya", isi: "Model YOLO11l mengenali 24 jenis hama padi, jagung, dan bawang merah, menghitung jumlahnya, dan memberi tingkat keyakinan." },
  { judul: "Sistem menyusun langkah pengendalian", isi: "Langkah diambil dari basis data rekomendasi dan selalu berurutan: cek ambang, cara tanpa obat, musuh alami, ramuan nabati, baru obat kimia sebagai pilihan terakhir." },
  { judul: "Asisten menjawab pertanyaan lanjutan", isi: "Asisten tanya-jawab membaca pustaka sumber resmi dan hasil deteksi yang sedang dilihat, lalu menjawab dengan bahasa sederhana beserta rujukannya." },
];

const KOMODITAS = [
  { nama: "Padi", nilai: 0.83 },
  { nama: "Jagung", nilai: 0.77 },
  { nama: "Bawang merah", nilai: 0.73 },
];

export default function HalamanCaraKerja() {
  const jumlahSumber = semuaSumberUnik([...BARIS_HAMA, ...BARIS_PESTISIDA]).filter((s) => s.url).length;
  return (
    <div className="space-y-12">
      <header className="max-w-[46rem]">
        <h1 className="text-[32px] font-bold leading-[1.08] sm:text-[44px]">Dari foto perangkap sampai langkah di lahan</h1>
        <p className="mt-3 text-[17px] leading-relaxed text-tinta/80">
          AgriPest-RAG bukan sekadar pengenal hama. Sistem ini membantu memutuskan tindakan yang tepat, aman, dan sesuai aturan, supaya hasil panen dari lahan yang makin terbatas tetap terjaga.
        </p>
      </header>

      <section aria-labelledby="alur">
        <h2 id="alur" className="mb-5 text-[24px] font-semibold">Alurnya</h2>
        <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {LANGKAH.map((l, i) => (
            <li key={l.judul} className="rounded-panel border border-garis bg-kertas p-5">
              <span className="font-judul text-[40px] font-bold leading-none text-daun">{i + 1}</span>
              <h3 className="mt-3 text-[18px] font-semibold leading-snug">{l.judul}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-tinta/80">{l.isi}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="pengaman" className="grid gap-6 rounded-panel bg-malam p-6 text-kertas sm:p-8 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <h2 id="pengaman" className="text-[26px] font-semibold leading-tight">Tiga pengaman yang tertanam di sistem</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-kertas/75">Rekomendasi disusun oleh aturan yang tetap, bukan dikarang oleh AI. Hasilnya selalu sama dan bisa dipertanggungjawabkan.</p>
        </div>
        <ul className="space-y-4">
          <li>
            <h3 className="text-[18px] font-semibold">Patuh aturan pestisida</h3>
            <p className="mt-1 text-[14.5px] leading-relaxed text-kertas/80">Bahan aktif yang dilarang untuk padi menurut Permentan No. 43 Tahun 2019, seperti asefat atau klorpirifos, tidak pernah disarankan, walaupun disebut sumber lama atau sumber luar negeri.</p>
          </li>
          <li>
            <h3 className="text-[18px] font-semibold">Mencegah hama kebal obat</h3>
            <p className="mt-1 text-[14.5px] leading-relaxed text-kertas/80">Obat yang sudah terbukti tidak mempan, misalnya imidakloprid untuk wereng batang coklat di Jawa, diberi peringatan. Setiap obat ditandai golongan cara kerjanya agar petani bisa bergantian golongan.</p>
          </li>
          <li>
            <h3 className="text-[18px] font-semibold">Cocok untuk tanamannya</h3>
            <p className="mt-1 text-[14.5px] leading-relaxed text-kertas/80">Bahan yang hanya boleh untuk tanaman tertentu, seperti kartap hidroklorida untuk bawang merah, tidak muncul untuk padi. Obat kimia baru ditampilkan setelah petani mencocokkan ciri hamanya.</p>
          </li>
        </ul>
      </section>

      <section aria-labelledby="kinerja" className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 id="kinerja" className="text-[24px] font-semibold">Seberapa tepat sistem mengenali hama</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-tinta/80">Diuji dengan 110 foto uji berisi 144 hama yang tidak pernah dilihat model saat belajar.</p>
          <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5">
            <div><dt className="text-[13.5px] text-lumpur">Ketepatan kotak dan jenis (mAP@50)</dt><dd className="font-judul text-[34px] font-bold">79,4%</dd></div>
            <div><dt className="text-[13.5px] text-lumpur">Tebakan yang benar (presisi)</dt><dd className="font-judul text-[34px] font-bold">78,3%</dd></div>
            <div><dt className="text-[13.5px] text-lumpur">Hama yang berhasil ditemukan (recall)</dt><dd className="font-judul text-[34px] font-bold">75,0%</dd></div>
            <div><dt className="text-[13.5px] text-lumpur">Salah tanaman</dt><dd className="font-judul text-[34px] font-bold">3 dari 144</dd></div>
          </dl>
          <p className="mt-5 text-[14.5px] leading-relaxed text-tinta/80">
            Angka keyakinan yang ditampilkan bisa dipercaya: tingkat keyakinan sistem selaras dengan ketepatan sebenarnya, dengan selisih kalibrasi rata-rata hanya 0,036. Pengenalan juga tetap baik di cahaya redup, penting untuk perangkap yang bekerja malam hari.
          </p>
        </div>
        <div className="rounded-panel border border-garis bg-kertas p-5 sm:p-6">
          <h3 className="text-[18px] font-semibold">Ketepatan per tanaman (AP@50)</h3>
          <div className="mt-5 space-y-4">
            {KOMODITAS.map((k) => (
              <div key={k.nama}>
                <div className="mb-1.5 flex justify-between text-[14.5px]"><span className="font-semibold">{k.nama}</span><span className="tabular-nums">{Math.round(k.nilai * 100)}%</span></div>
                <div className="h-3 rounded-full bg-tanah"><div className="h-3 rounded-full bg-daun" style={{ width: `${k.nilai * 100}%` }} /></div>
              </div>
            ))}
          </div>
          <p className="mt-5 text-[13.5px] leading-relaxed text-lumpur">
            Model: YOLO11l, 24 kelas, dilatih pada 5.815 foto dari dataset IP102. Ambang keyakinan 35%. Hama dengan keandalan rendah otomatis diberi peringatan agar dicocokkan dulu.
          </p>
        </div>
      </section>

      <section aria-labelledby="pustaka" className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div>
          <h2 id="pustaka" className="text-[24px] font-semibold">Dari mana jawaban asisten berasal</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-tinta/80">
            Asisten memakai teknik Retrieval-Augmented Generation: sebelum menjawab, ia mencari dulu di pustaka, lalu hanya menjawab dari yang ditemukan dan menyebut nomor rujukannya. Bila jawabannya tidak ada di pustaka, asisten mengatakannya terus terang.
          </p>
        </div>
        <ul className="grid grid-cols-2 gap-3">
          <li className="rounded-panel border border-garis bg-kertas p-4"><p className="font-judul text-[30px] font-bold">{BARIS_HAMA.length}</p><p className="text-[14px] text-lumpur">catatan hama: gejala, ambang, keandalan sistem</p></li>
          <li className="rounded-panel border border-garis bg-kertas p-4"><p className="font-judul text-[30px] font-bold">{BARIS_PESTISIDA.length}</p><p className="text-[14px] text-lumpur">catatan pengendalian dan status aturan</p></li>
          <li className="col-span-2 rounded-panel border border-garis bg-kertas p-4"><p className="font-judul text-[30px] font-bold">{jumlahSumber} sumber terbuka</p><p className="text-[14px] text-lumpur">Kementerian Pertanian, BB Padi, Balitsa, Balitsereal, IRRI, Permentan 43/2019, dan jurnal ilmiah. Semua bisa dibuka gratis.</p></li>
        </ul>
      </section>

      <section aria-labelledby="simulasi" className="rounded-panel border border-garis bg-kertas p-5 sm:p-6">
        <h2 id="simulasi" className="text-[22px] font-semibold">Tentang prototipe ini</h2>
        <div className="mt-3 grid gap-4 text-[14.5px] leading-relaxed text-tinta/80 md:grid-cols-2">
          <p>
            Halaman <Link href="/" className="font-semibold text-air underline underline-offset-2">Pantau lahan</Link> mensimulasikan kiriman kamera lampu perangkap dari tiga lahan. Fotonya adalah foto uji, sedangkan kotak, jenis hama, dan keyakinannya adalah keluaran asli model YOLO11l.
          </p>
          <p>
            Status lahan dihitung dari jumlah hama tertangkap dalam 2 jam terakhir: di bawah {BATAS_WASPADA} ekor aman, {BATAS_WASPADA} sampai {BATAS_PERLU_DICEK - 1} ekor waspada, {BATAS_PERLU_DICEK} ekor atau lebih perlu dicek. Status ini pemicu untuk turun ke lahan, bukan pengganti ambang ekonomi hasil pengamatan langsung.
          </p>
        </div>
      </section>
    </div>
  );
}
