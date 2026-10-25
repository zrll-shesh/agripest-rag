import { ExternalLink } from "lucide-react";
import type { Sumber } from "@/lib/data";

export default function DaftarSumber({ sumber, judul = "Sumber" }: { sumber: Sumber[]; judul?: string }) {
  if (!sumber.length) return null;
  return (
    <div>
      <p className="mb-2 text-[13px] font-semibold text-lumpur">{judul}</p>
      <ol className="space-y-1.5 text-[13px] leading-snug">
        {sumber.map((s, i) => (
          <li key={s.judul} className="flex gap-2">
            <span className="w-5 shrink-0 text-right font-semibold text-lumpur">{i + 1}.</span>
            {s.url ? (
              <a href={s.url} target="_blank" rel="noreferrer" className="text-air underline-offset-2 hover:underline">
                {s.judul}
                <span className="text-lumpur"> · {s.lembaga}{s.tahun && s.tahun !== "-" ? `, ${s.tahun}` : ""}</span>
                <ExternalLink className="ml-1 inline h-3 w-3" aria-label="(tautan luar)" />
              </a>
            ) : (
              <span>{s.judul} <span className="text-lumpur">· {s.lembaga}</span></span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
