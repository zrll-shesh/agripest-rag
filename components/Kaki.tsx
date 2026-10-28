"use client";
import { useBahasa } from "@/lib/i18n";

// Kaki halaman: tanda pembuat dan keterangan prototipe.
export default function Kaki() {
  const { tx } = useBahasa();
  return (
    <footer className="mt-6 border-t border-garis bg-kertas/70 backdrop-blur">
      <div className="mx-auto flex max-w-halaman flex-col gap-2 px-4 pb-28 pt-6 text-[13px] text-lumpur sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:pb-8">
        <p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/favicon.svg" alt="" className="mr-1.5 inline h-5 w-5 align-[-5px]" />
          <span className="font-semibold text-tinta">AgriPest-RAG</span>{" "}
          {tx({ id: "dibuat oleh", en: "built by" })} <span className="font-semibold text-tinta">Nazril Ravi Pratama</span>{tx({ id: ", S1 Sains Data, Universitas Negeri Surabaya, 2026.", en: ", Data Science undergraduate, Universitas Negeri Surabaya, 2026." })}
        </p>
        <p>{tx({ id: "Prototipe simulasi. Selalu konfirmasi ke petugas POPT atau penyuluh sebelum memakai pestisida.", en: "Simulation prototype. Always confirm with a pest observer or extension officer before using pesticides." })}</p>
      </div>
    </footer>
  );
}
