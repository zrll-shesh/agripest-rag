import DaftarHama from "@/components/DaftarHama";
import { T } from "@/lib/i18n";

export const metadata = { title: "Pustaka hama · AgriPest-RAG" };

export default function HalamanPustaka() {
  return (
    <div className="space-y-6">
      <header className="max-w-[44rem]">
        <h1 className="text-[32px] font-bold leading-tight sm:text-[40px]"><T id="Pustaka hama" en="Pest library" /></h1>
        <p className="mt-2 text-[16px] leading-relaxed text-tinta/80">
          <T id="24 hama padi, jagung, dan bawang merah yang dikenali sistem. Setiap hama dilengkapi ciri serangan, kapan muncul, cara memantau, dan langkah pengendalian dari sumber resmi." en="The 24 rice, corn, and shallot pests the system recognises. Each comes with damage signs, when it appears, how to monitor it, and control steps from official sources." />
        </p>
      </header>
      <DaftarHama />
    </div>
  );
}
