"use client";
import Link from "next/link";
import KepalaHalaman from "@/components/KepalaHalaman";
import { useBahasa, type Dwibahasa } from "@/lib/i18n";
import { BARIS_HAMA, BARIS_PESTISIDA, semuaSumberUnik } from "@/lib/data";
import { BATAS_PERLU_DICEK, BATAS_WASPADA } from "@/lib/simulasi";

const LANGKAH: { judul: Dwibahasa; isi: Dwibahasa }[] = [
  { judul: { id: "Kamera di lampu perangkap memotret", en: "The light-trap camera takes a photo" }, isi: { id: "Setiap 30 menit, kamera di atas wadah lampu perangkap mengirim foto tangkapan. Di prototipe ini, kiriman foto disimulasikan dengan foto uji.", en: "Every 30 minutes, a camera above the light-trap tray sends a photo of the catch. In this prototype, the photo feed is simulated with test photos." } },
  { judul: { id: "Sistem mengenali hamanya", en: "The system identifies the pest" }, isi: { id: "Model YOLO11l mengenali 24 jenis hama padi, jagung, dan bawang merah, menghitung jumlahnya, dan memberi tingkat keyakinan.", en: "The YOLO11l model recognises 24 rice, corn, and shallot pests, counts them, and gives a confidence level." } },
  { judul: { id: "Sistem menyusun langkah pengendalian", en: "The system lists control steps" }, isi: { id: "Langkah diambil dari basis data rekomendasi dan selalu berurutan: cek ambang, cara tanpa obat, musuh alami, ramuan nabati, baru obat kimia sebagai pilihan terakhir.", en: "Steps come from a recommendation database and are always ordered: check the threshold, non-chemical methods, natural enemies, botanicals, and chemicals only as a last resort." } },
  { judul: { id: "Asisten menjawab pertanyaan lanjutan", en: "The assistant answers follow-up questions" }, isi: { id: "Asisten tanya-jawab membaca pustaka sumber resmi dan hasil deteksi yang sedang dilihat, lalu menjawab dengan bahasa sederhana beserta rujukannya.", en: "The assistant reads the library of official sources and the detection being viewed, then answers in plain language with references." } },
];

const KOMODITAS = [
  { nama: { id: "Padi", en: "Rice" }, nilai: 0.83 },
  { nama: { id: "Jagung", en: "Corn" }, nilai: 0.77 },
  { nama: { id: "Bawang merah", en: "Shallot" }, nilai: 0.73 },
];

export default function HalamanCaraKerja() {
  const { tx } = useBahasa();
  const jumlahSumber = semuaSumberUnik([...BARIS_HAMA, ...BARIS_PESTISIDA]).filter((s) => s.url).length;
  return (
    <div className="space-y-12">
      <KepalaHalaman judul={tx({ id: "Dari foto perangkap sampai langkah di lahan", en: "From a trap photo to action in the field" })} keterangan={tx({ id: "AgriPest-RAG bukan sekadar pengenal hama. Sistem ini membantu memutuskan tindakan yang tepat, aman, dan sesuai aturan, supaya hasil panen dari lahan yang makin terbatas tetap terjaga.", en: "AgriPest-RAG is more than a pest recogniser. It helps decide on actions that are right, safe, and compliant, so harvests from ever-shrinking farmland stay protected." })} />

      <section aria-labelledby="alur">
        <h2 id="alur" className="mb-5 text-[24px] font-semibold">{tx({ id: "Alurnya", en: "The flow" })}</h2>
        <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {LANGKAH.map((l, i) => (
            <li key={l.judul.id} className="rounded-panel border border-garis bg-kertas p-5">
              <span className="font-judul text-[40px] font-bold leading-none text-daun">{i + 1}</span>
              <h3 className="mt-3 text-[18px] font-semibold leading-snug">{tx(l.judul)}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-tinta/80">{tx(l.isi)}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="pengaman" className="grid gap-6 rounded-panel bg-malam p-6 text-kertas sm:p-8 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <h2 id="pengaman" className="text-[26px] font-semibold leading-tight">{tx({ id: "Tiga pengaman yang tertanam di sistem", en: "Three safeguards built into the system" })}</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-kertas/75">{tx({ id: "Rekomendasi disusun oleh aturan yang tetap, bukan dikarang oleh AI. Hasilnya selalu sama dan bisa dipertanggungjawabkan.", en: "Recommendations are produced by fixed rules, not invented by AI. They are always the same and accountable." })}</p>
        </div>
        <ul className="space-y-4">
          <li>
            <h3 className="text-[18px] font-semibold">{tx({ id: "Patuh aturan pestisida", en: "Follows pesticide rules" })}</h3>
            <p className="mt-1 text-[14.5px] leading-relaxed text-kertas/80">{tx({ id: "Bahan aktif yang dilarang untuk padi menurut Permentan No. 43 Tahun 2019, seperti asefat atau klorpirifos, tidak pernah disarankan, walaupun disebut sumber lama atau sumber luar negeri.", en: "Active ingredients banned for rice under Indonesian Ministerial Regulation No. 43/2019, such as acephate or chlorpyrifos, are never recommended, even if older or foreign sources mention them." })}</p>
          </li>
          <li>
            <h3 className="text-[18px] font-semibold">{tx({ id: "Mencegah hama kebal obat", en: "Prevents resistance" })}</h3>
            <p className="mt-1 text-[14.5px] leading-relaxed text-kertas/80">{tx({ id: "Obat yang sudah terbukti tidak mempan, misalnya imidakloprid untuk wereng batang coklat di Jawa, diberi peringatan. Setiap obat ditandai golongan cara kerjanya agar petani bisa bergantian golongan.", en: "Products shown to be losing effect, such as imidacloprid on brown planthopper in Java, carry a warning. Every product shows its mode-of-action group so farmers can rotate groups." })}</p>
          </li>
          <li>
            <h3 className="text-[18px] font-semibold">{tx({ id: "Cocok untuk tanamannya", en: "Right for the crop" })}</h3>
            <p className="mt-1 text-[14.5px] leading-relaxed text-kertas/80">{tx({ id: "Bahan yang hanya boleh untuk tanaman tertentu, seperti kartap hidroklorida untuk bawang merah, tidak muncul untuk padi. Obat kimia baru ditampilkan setelah petani mencocokkan ciri hamanya.", en: "Ingredients allowed only on certain crops, such as cartap hydrochloride on shallot, never appear for rice. Chemicals are only shown after the farmer confirms the pest signs." })}</p>
          </li>
        </ul>
      </section>

      <section aria-labelledby="kinerja" className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 id="kinerja" className="text-[24px] font-semibold">{tx({ id: "Seberapa tepat sistem mengenali hama", en: "How accurately the system identifies pests" })}</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-tinta/80">{tx({ id: "Diuji dengan 110 foto uji berisi 144 hama yang tidak pernah dilihat model saat belajar.", en: "Tested on 110 photos containing 144 pests the model never saw during training." })}</p>
          <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5">
            <div><dt className="text-[13.5px] text-lumpur">{tx({ id: "Ketepatan kotak dan jenis (mAP@50)", en: "Box and type accuracy (mAP@50)" })}</dt><dd className="font-judul text-[34px] font-bold">79,4%</dd></div>
            <div><dt className="text-[13.5px] text-lumpur">{tx({ id: "Tebakan yang benar (presisi)", en: "Correct guesses (precision)" })}</dt><dd className="font-judul text-[34px] font-bold">78,3%</dd></div>
            <div><dt className="text-[13.5px] text-lumpur">{tx({ id: "Hama yang berhasil ditemukan (recall)", en: "Pests found (recall)" })}</dt><dd className="font-judul text-[34px] font-bold">75,0%</dd></div>
            <div><dt className="text-[13.5px] text-lumpur">{tx({ id: "Salah tanaman", en: "Wrong crop" })}</dt><dd className="font-judul text-[34px] font-bold">{tx({ id: "3 dari 144", en: "3 of 144" })}</dd></div>
          </dl>
          <p className="mt-5 text-[14.5px] leading-relaxed text-tinta/80">
            {tx({ id: "Angka keyakinan yang ditampilkan bisa dipercaya: tingkat keyakinan sistem selaras dengan ketepatan sebenarnya, dengan selisih kalibrasi rata-rata hanya 0,036. Pengenalan juga tetap baik di cahaya redup, penting untuk perangkap yang bekerja malam hari.", en: "The confidence shown can be trusted: the system's confidence matches its real accuracy, with an average calibration gap of only 0.036. Recognition also holds up in dim light, which matters for traps that work at night." })}
          </p>
        </div>
        <div className="rounded-panel border border-garis bg-kertas p-5 sm:p-6">
          <h3 className="text-[18px] font-semibold">{tx({ id: "Ketepatan per tanaman (AP@50)", en: "Accuracy per crop (AP@50)" })}</h3>
          <div className="mt-5 space-y-4">
            {KOMODITAS.map((k) => (
              <div key={k.nama.id}>
                <div className="mb-1.5 flex justify-between text-[14.5px]"><span className="font-semibold">{tx(k.nama)}</span><span className="tabular-nums">{Math.round(k.nilai * 100)}%</span></div>
                <div className="h-3 rounded-full bg-tanah"><div className="h-3 rounded-full bg-daun" style={{ width: `${k.nilai * 100}%` }} /></div>
              </div>
            ))}
          </div>
          <p className="mt-5 text-[13.5px] leading-relaxed text-lumpur">
            {tx({ id: "Model: YOLO11l, 24 kelas, dilatih pada 5.815 foto dari dataset IP102. Ambang keyakinan 35%. Hama dengan keandalan rendah otomatis diberi peringatan agar dicocokkan dulu.", en: "Model: YOLO11l, 24 classes, trained on 5,815 photos from the IP102 dataset. Confidence threshold 35%. Pests with low reliability automatically get a warning to check first." })}
          </p>
        </div>
      </section>

      <section aria-labelledby="pustaka" className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div>
          <h2 id="pustaka" className="text-[24px] font-semibold">{tx({ id: "Dari mana jawaban asisten berasal", en: "Where the assistant's answers come from" })}</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-tinta/80">
            {tx({ id: "Asisten memakai teknik Retrieval-Augmented Generation: sebelum menjawab, ia mencari dulu di pustaka, lalu hanya menjawab dari yang ditemukan dan menyebut nomor rujukannya. Bila jawabannya tidak ada di pustaka, asisten mengatakannya terus terang.", en: "The assistant uses Retrieval-Augmented Generation: before answering it searches the library, answers only from what it finds, and cites reference numbers. If the answer is not in the library, it says so plainly." })}
          </p>
        </div>
        <ul className="grid grid-cols-2 gap-3">
          <li className="rounded-panel border border-garis bg-kertas p-4"><p className="font-judul text-[30px] font-bold">{BARIS_HAMA.length}</p><p className="text-[14px] text-lumpur">{tx({ id: "catatan hama: gejala, ambang, keandalan sistem", en: "pest records: symptoms, thresholds, system reliability" })}</p></li>
          <li className="rounded-panel border border-garis bg-kertas p-4"><p className="font-judul text-[30px] font-bold">{BARIS_PESTISIDA.length}</p><p className="text-[14px] text-lumpur">{tx({ id: "catatan pengendalian dan status aturan", en: "control and regulatory records" })}</p></li>
          <li className="col-span-2 rounded-panel border border-garis bg-kertas p-4"><p className="font-judul text-[30px] font-bold">{jumlahSumber} {tx({ id: "sumber terbuka", en: "open sources" })}</p><p className="text-[14px] text-lumpur">{tx({ id: "Kementerian Pertanian, BB Padi, Balitsa, Balitsereal, IRRI, Permentan 43/2019, dan jurnal ilmiah. Semua bisa dibuka gratis.", en: "Indonesian Ministry of Agriculture, BB Padi, Balitsa, Balitsereal, IRRI, Ministerial Regulation 43/2019, and scientific journals. All free to open." })}</p></li>
        </ul>
      </section>

      <section aria-labelledby="simulasi" className="rounded-panel border border-garis bg-kertas p-5 sm:p-6">
        <h2 id="simulasi" className="text-[22px] font-semibold">{tx({ id: "Tentang prototipe ini", en: "About this prototype" })}</h2>
        <div className="mt-3 grid gap-4 text-[14.5px] leading-relaxed text-tinta/80 md:grid-cols-2">
          <p>
            {tx({ id: "Halaman", en: "The" })} <Link href="/" className="font-semibold text-air underline underline-offset-2">{tx({ id: "Pantau lahan", en: "Monitor fields" })}</Link>{" "}
            {tx({ id: "mensimulasikan kiriman kamera lampu perangkap dari tiga lahan. Fotonya adalah foto uji, sedangkan kotak, jenis hama, dan keyakinannya adalah keluaran asli model YOLO11l.", en: "page simulates light-trap camera photos from three fields. The photos are test photos, while the boxes, pest types, and confidence are real outputs of the YOLO11l model." })}
          </p>
          <p>
            {tx({
              id: `Status lahan dihitung dari jumlah hama tertangkap dalam 2 jam terakhir: di bawah ${BATAS_WASPADA} ekor aman, ${BATAS_WASPADA} sampai ${BATAS_PERLU_DICEK - 1} ekor waspada, ${BATAS_PERLU_DICEK} ekor atau lebih perlu dicek. Status ini pemicu untuk turun ke lahan, bukan pengganti ambang ekonomi hasil pengamatan langsung.`,
              en: `Field status comes from the number of pests caught in the last 2 hours: under ${BATAS_WASPADA} is safe, ${BATAS_WASPADA} to ${BATAS_PERLU_DICEK - 1} is watch, ${BATAS_PERLU_DICEK} or more means check now. It is a trigger to go to the field, not a replacement for economic thresholds from direct observation.`,
            })}
          </p>
        </div>
      </section>
    </div>
  );
}
