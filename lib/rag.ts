// Pencarian sederhana untuk asisten: tanpa basis data vektor.
// Skor = kecocokan kelas hama + kecocokan kata kunci pada kolom teks_rag.
import { BARIS_HAMA, BARIS_PESTISIDA, type Sumber } from "@/lib/data";
import { DAFTAR_KELAS } from "@/lib/kelas";

export interface PotonganKonteks { id: string; kelas: number | null; teks: string; sumber: Sumber[]; jenis: "hama" | "pestisida" }

const KATA_UMUM = new Set(
  "yang dan di ke dari untuk dengan pada ini itu apa apakah bagaimana kenapa mengapa saya kami kita bisa harus atau juga ada tidak jika kalau sudah akan dalam sebagai oleh lebih agar supaya tolong mohon pak bu kak min hama tanaman".split(" ")
);

const token = (t: string) =>
  t.toLowerCase().normalize("NFKD").replace(/[^a-z0-9\s-]/g, " ").split(/\s+/).filter((k) => k.length > 2 && !KATA_UMUM.has(k));

const SEMUA_POTONGAN: (PotonganKonteks & { kata: Set<string> })[] = [
  ...BARIS_HAMA.map((b) => ({ id: b.id, kelas: b.kelas, teks: b.teksRag, sumber: b.sumber, jenis: "hama" as const })),
  ...BARIS_PESTISIDA.map((b) => ({ id: b.id, kelas: b.kelas, teks: b.teksRag, sumber: b.sumber, jenis: "pestisida" as const })),
].map((p) => ({ ...p, kata: new Set(token(p.teks)) }));

// Kenali nama hama yang disebut dalam pertanyaan
export function kelasDisebut(pertanyaan: string): number[] {
  const q = pertanyaan.toLowerCase();
  return DAFTAR_KELAS.filter((k) => q.includes(k.nama.toLowerCase()) || q.includes(k.namaIlmiah.toLowerCase().split(" ")[0]) || q.includes(k.namaIp102.toLowerCase()))
    .map((k) => k.id);
}

export function cariKonteks(pertanyaan: string, kelasKonteks: number | null, batas = 12): PotonganKonteks[] {
  const kataTanya = token(pertanyaan);
  const kelasTerkait = new Set<number>([...kelasDisebut(pertanyaan), ...(kelasKonteks !== null ? [kelasKonteks] : [])]);
  const berskor = SEMUA_POTONGAN.map((p) => {
    let skor = 0;
    kataTanya.forEach((k) => { if (p.kata.has(k)) skor += 1; else if ([...p.kata].some((w) => w.startsWith(k.slice(0, 5)) && k.length > 5)) skor += 0.4; });
    if (p.kelas !== null && kelasTerkait.has(p.kelas)) skor += 4;
    if (p.kelas === null) skor += 0.3;
    if (p.kelas !== null && kelasTerkait.size && !kelasTerkait.has(p.kelas)) skor -= 1.5;
    return { p, skor };
  }).filter((x) => x.skor > 0.5);
  berskor.sort((a, b) => b.skor - a.skor);
  return berskor.slice(0, batas).map(({ p }) => ({ id: p.id, kelas: p.kelas, teks: p.teks, sumber: p.sumber, jenis: p.jenis }));
}
