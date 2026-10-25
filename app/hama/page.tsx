import DaftarHama from "@/components/DaftarHama";
import { ciriUntukDicocokkan } from "@/lib/data";
import { DAFTAR_KELAS } from "@/lib/kelas";

export const metadata = { title: "Pustaka hama · AgriPest-RAG" };

export default function HalamanPustaka() {
  const ringkas = Object.fromEntries(DAFTAR_KELAS.map((k) => [k.id, ciriUntukDicocokkan(k.id, k.komoditas)[0]?.isi ?? ""]));
  return (
    <div className="space-y-6">
      <header className="max-w-[44rem]">
        <h1 className="text-[32px] font-bold leading-tight sm:text-[40px]">Pustaka hama</h1>
        <p className="mt-2 text-[16px] leading-relaxed text-tinta/80">
          24 hama padi, jagung, dan bawang merah yang dikenali sistem. Setiap hama dilengkapi ciri serangan, kapan muncul, cara memantau, dan langkah pengendalian dari sumber resmi.
        </p>
      </header>
      <DaftarHama ringkas={ringkas} />
    </div>
  );
}
