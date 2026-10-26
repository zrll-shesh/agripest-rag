"use client";
import { useBahasa } from "@/lib/i18n";

// Kaki halaman: tanda pembuat dan keterangan prototipe.
export default function Kaki() {
  const { tx } = useBahasa();
  return (
    <footer className="border-t border-garis">
      <div className="mx-auto flex max-w-halaman flex-col gap-2 px-4 pb-28 pt-6 text-[13px] text-lumpur sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:pb-8">
        <p>
          <span className="font-semibold text-tinta">AgriPest-RAG</span>{" "}
          {tx({ id: "dibuat oleh", en: "built by" })} <span className="font-semibold text-tinta">Nazril Ravi Pratama</span>{tx({ id: ", S1 Sains Data, Universitas Negeri Surabaya, 2026.", en: ", Data Science undergraduate, Universitas Negeri Surabaya, 2026." })}
        </p>
        <p>{tx({ id: "Prototipe simulasi. Selalu konfirmasi ke petugas POPT atau penyuluh sebelum memakai pestisida.", en: "Simulation prototype. Always confirm with a pest observer or extension officer before using pesticides." })}</p>
      </div>
    </footer>
  );
}
