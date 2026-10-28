import type { ReactNode } from "react";

// Pita judul halaman bernuansa malam, senada dengan hero dasbor.
export default function KepalaHalaman({ judul, keterangan, kanan }: { judul: ReactNode; keterangan: ReactNode; kanan?: ReactNode }) {
  return (
    <header className="latar-malam relative -mx-4 overflow-hidden px-5 py-8 text-kertas sm:mx-0 sm:rounded-[26px] sm:px-8 sm:py-10">
      <div className="relative grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="max-w-[46rem]">
          <h1 className="text-[32px] font-bold leading-[1.08] sm:text-[44px]">{judul}</h1>
          <p className="mt-3 text-[16px] leading-relaxed text-kertas/80 sm:text-[17px]">{keterangan}</p>
        </div>
        {kanan}
      </div>
    </header>
  );
}
