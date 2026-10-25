import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageCircleQuestion } from "lucide-react";
import { DAFTAR_KELAS, ambilKelas } from "@/lib/kelas";
import { barisHamaUntuk, barisPestisidaUntuk, semuaSumberUnik, type BarisHama } from "@/lib/data";
import { CatatanKeandalan } from "@/components/Lencana";
import LangkahPHT from "@/components/LangkahPHT";
import DaftarSumber from "@/components/DaftarSumber";

export const generateStaticParams = () => DAFTAR_KELAS.map((k) => ({ id: String(k.id) }));

export function generateMetadata({ params }: { params: { id: string } }) {
  const k = DAFTAR_KELAS[Number(params.id)];
  return { title: k ? `${k.nama} · Pustaka hama AgriPest-RAG` : "Pustaka hama" };
}

const BAGIAN: { judul: string; aspek: string[] }[] = [
  { judul: "Ciri dan gejala serangan", aspek: ["identitas", "identitas_status", "gejala", "gejala_padi", "gejala_bawang", "perilaku", "biologi", "inang", "status_lokal", "vektor_penyakit", "penyakit_terkait"] },
  { judul: "Kapan muncul dan seberapa merugikan", aspek: ["faktor_pemicu", "waktu_kritis", "dampak", "dampak_ekonomi", "dampak_karantina", "resurgensi"] },
  { judul: "Cara memantau di lahan", aspek: ["pemantauan", "pemantauan_ambang"] },
];

function Paragraf({ baris }: { baris: BarisHama[] }) {
  return (
    <ul className="space-y-3">
      {baris.map((b) => (
        <li key={b.id} className="text-[15.5px] leading-relaxed">
          {b.isi}
        </li>
      ))}
    </ul>
  );
}

export default function HalamanDetailHama({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!Number.isInteger(id) || id < 0 || id > 23) notFound();
  const kelas = ambilKelas(id);
  const baris = barisHamaUntuk(id);
  const langkah = barisPestisidaUntuk(id);
  const analisis = baris.filter((b) => ["keandalan_deteksi", "catatan_model"].includes(b.aspek));
  const pakai = new Set(BAGIAN.flatMap((b) => b.aspek));
  const sumber = semuaSumberUnik([...baris.filter((b) => pakai.has(b.aspek)), ...langkah]);

  return (
    <article className="space-y-8">
      <Link href="/hama" className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-lumpur hover:text-tinta">
        <ArrowLeft className="h-4 w-4" aria-hidden /> Semua hama
      </Link>
      <header className="grid gap-5 lg:grid-cols-[1fr_360px] lg:items-end">
        <div>
          <p className="text-[14px] font-semibold text-lumpur">Hama {kelas.komoditas === "Bawang" ? "bawang merah" : kelas.komoditas.toLowerCase()}</p>
          <h1 className="mt-1 text-[34px] font-bold leading-[1.05] sm:text-[48px]">{kelas.nama}</h1>
          <p className="mt-2 text-[16px] text-lumpur"><i>{kelas.namaIlmiah}</i></p>
        </div>
        <CatatanKeandalan keandalan={kelas.keandalan} />
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="space-y-8">
          {BAGIAN.map(({ judul, aspek }) => {
            const isi = baris.filter((b) => aspek.includes(b.aspek));
            if (!isi.length) return null;
            return (
              <section key={judul}>
                <h2 className="mb-3 text-[22px] font-semibold">{judul}</h2>
                <Paragraf baris={isi} />
              </section>
            );
          })}
          {analisis.length > 0 && (
            <section>
              <h2 className="mb-3 text-[22px] font-semibold">Seberapa andal sistem untuk hama ini</h2>
              <Paragraf baris={analisis} />
            </section>
          )}
          <Link href={`/tanya?kelas=${id}`} className="inline-flex items-center gap-2 rounded-full bg-air px-5 py-3 text-[15px] font-semibold text-kertas">
            <MessageCircleQuestion className="h-4 w-4" aria-hidden /> Tanya asisten soal {kelas.nama.toLowerCase()}
          </Link>
        </div>
        <section className="rounded-panel border border-garis bg-kertas p-5 sm:p-6">
          <h2 className="text-[22px] font-semibold">Langkah pengendalian</h2>
          <p className="mb-5 mt-1 text-[14px] text-lumpur">Berurutan sesuai Pengendalian Hama Terpadu: mulai dari yang paling aman.</p>
          <LangkahPHT baris={langkah} kimiaTerbuka />
        </section>
      </div>

      <section className="border-t border-garis pt-6">
        <DaftarSumber sumber={sumber} judul="Sumber informasi halaman ini" />
      </section>
    </article>
  );
}
