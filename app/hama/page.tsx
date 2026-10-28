import DaftarHama from "@/components/DaftarHama";
import { T } from "@/lib/i18n";
import KepalaHalaman from "@/components/KepalaHalaman";

export const metadata = { title: "Pustaka hama · AgriPest-RAG" };

export default function HalamanPustaka() {
  return (
    <div className="space-y-7">
      <KepalaHalaman
        judul={<T id="Pustaka hama" en="Pest library" />}
        keterangan={<T id="24 hama padi, jagung, dan bawang merah yang dikenali sistem. Setiap hama dilengkapi ciri serangan, kapan muncul, cara memantau, dan langkah pengendalian dari sumber resmi." en="The 24 rice, corn, and shallot pests the system recognises. Each comes with damage signs, when it appears, how to monitor it, and control steps from official sources." />}
        kanan={<div className="flex gap-2">{[["14", "Padi"], ["6", "Jagung"], ["4", "Bawang merah"]].map(([n, k]) => (<div key={k} className="rounded-2xl bg-white/[0.08] px-4 py-3 ring-1 ring-white/15"><p className="font-judul text-[26px] font-bold leading-none">{n}</p><p className="mt-1 text-[12.5px] text-kertas/70">{k}</p></div>))}</div>}
      />
      <DaftarHama />
    </div>
  );
}
