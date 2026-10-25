import { Suspense } from "react";
import ObrolanAsisten from "@/components/ObrolanAsisten";

export const metadata = { title: "Tanya asisten · AgriPest-RAG" };

export default function HalamanTanya() {
  return (
    <div className="space-y-6">
      <header className="mx-auto max-w-[52rem]">
        <h1 className="text-[32px] font-bold leading-tight sm:text-[40px]">Tanya asisten</h1>
        <p className="mt-2 text-[16px] leading-relaxed text-tinta/80">Bertanya seperti ke penyuluh. Asisten hanya menjawab dari pustaka sumber resmi dan menyebutkan rujukannya.</p>
      </header>
      <Suspense fallback={null}>
        <ObrolanAsisten />
      </Suspense>
    </div>
  );
}
