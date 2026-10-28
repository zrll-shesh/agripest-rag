import { Suspense } from "react";
import ObrolanAsisten from "@/components/ObrolanAsisten";
import { T } from "@/lib/i18n";
import KepalaHalaman from "@/components/KepalaHalaman";

export const metadata = { title: "Tanya asisten · AgriPest-RAG" };

export default function HalamanTanya() {
  return (
    <div className="space-y-7">
      <KepalaHalaman
        judul={<T id="Tanya asisten" en="Ask the assistant" />}
        keterangan={<T id="Bertanya seperti ke penyuluh. Asisten hanya menjawab dari pustaka sumber resmi dan menyebutkan rujukannya." en="Ask as you would ask an extension officer. The assistant only answers from a library of official sources and cites them." />}
      />
      <Suspense fallback={null}>
        <ObrolanAsisten />
      </Suspense>
    </div>
  );
}
