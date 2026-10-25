import { ambilKelas } from "@/lib/kelas";
import type { Deteksi } from "@/lib/data";
import { persen } from "@/lib/format";

// Foto dari perangkap dengan kotak di sekeliling setiap hama yang dikenali.
export default function FotoDeteksi({ foto, lebar, tinggi, deteksi, judul }: { foto: string; lebar: number; tinggi: number; deteksi: Deteksi[]; judul: string }) {
  const rasio = lebar / tinggi;
  return (
    <figure className="wadah-foto relative overflow-hidden rounded-panel">
      <div className="relative mx-auto" style={{ aspectRatio: `${rasio}`, maxHeight: 460, maxWidth: `calc(460px * ${rasio})` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/sampel/${foto}`} alt={judul} className="absolute inset-0 h-full w-full object-contain" />
        {deteksi.map((d, i) => {
          const [x1, y1, x2, y2] = d.kotak;
          const atas = y1 < 0.12;
          return (
            <div
              key={i}
              className="absolute rounded-[6px] border-[2.5px] border-[#F2C14E] shadow-[0_0_0_1px_rgba(0,0,0,0.35)]"
              style={{ left: `${x1 * 100}%`, top: `${y1 * 100}%`, width: `${(x2 - x1) * 100}%`, height: `${(y2 - y1) * 100}%` }}
            >
              <span
                className={`absolute left-[-2.5px] whitespace-nowrap rounded-[5px] bg-[#F2C14E] px-1.5 py-0.5 text-[11.5px] font-bold text-tinta ${atas ? "top-full mt-0.5" : "bottom-full mb-0.5"}`}
              >
                {ambilKelas(d.kelas).nama} {persen(d.keyakinan)}
              </span>
            </div>
          );
        })}
      </div>
    </figure>
  );
}
