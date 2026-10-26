import { NextResponse } from "next/server";
import { cariKonteks, type PotonganKonteks } from "@/lib/rag";
import { ambilKelas } from "@/lib/kelas";
import type { Sumber } from "@/lib/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Pesan { peran: "pengguna" | "asisten"; teks: string }
interface Permintaan {
  pertanyaan: string;
  bahasa?: "id" | "en";
  riwayat?: Pesan[];
  konteks?: { kelas: number | null; keyakinan?: number; lahan?: string; jam?: string; jumlah?: number; cocok?: "ya" | "tidak" | "ragu" | null };
}

const MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";

const ATURAN = `Anda adalah asisten Pengendalian Hama Terpadu (PHT) di aplikasi AgriPest-RAG untuk petani padi, jagung, dan bawang merah di Indonesia.

Aturan wajib:
1. Jawab HANYA berdasarkan bagian PUSTAKA yang diberikan. Jika jawabannya tidak ada di pustaka, katakan terus terang bahwa informasinya belum tersedia dan sarankan bertanya ke petugas POPT atau penyuluh pertanian.
2. Pakai bahasa Indonesia sederhana yang mudah dipahami petani. Kalimat pendek. Hindari istilah teknis; bila terpaksa, jelaskan artinya.
3. Jawaban maksimal sekitar 150 kata. Boleh memakai daftar langkah singkat dengan tanda "-".
4. Selalu utamakan urutan PHT: cek ambang dulu, lalu cara tanpa obat, musuh alami atau agens hayati, ramuan nabati, dan obat kimia sebagai pilihan terakhir.
5. JANGAN pernah memberi dosis, takaran, atau interval semprot. Arahkan ke label resmi produk terdaftar.
6. JANGAN pernah menyarankan bahan aktif yang di pustaka berstatus DILARANG untuk komoditas tersebut. Jika ditanya tentang bahan itu, jelaskan bahwa bahan itu dilarang.
7. Jika pustaka menyebut keandalan deteksi sistem untuk hama itu rendah atau belum teruji, ingatkan petani untuk mencocokkan ciri atau bertanya ke petugas.
8. Jika petani menyatakan hasil deteksi tidak cocok dengan yang dilihat, jangan beri saran obat; sarankan konfirmasi ke petugas.
9. Cantumkan nomor rujukan pustaka dalam kurung siku, misalnya [1] atau [2], di akhir kalimat yang memakainya.`;

function susunPustaka(potongan: PotonganKonteks[]) {
  const daftarSumber: Sumber[] = [];
  const nomorSumber = new Map<string, number>();
  const teks = potongan
    .map((p) => {
      const nomor = p.sumber.map((s) => {
        if (!nomorSumber.has(s.judul)) { daftarSumber.push(s); nomorSumber.set(s.judul, daftarSumber.length); }
        return nomorSumber.get(s.judul);
      });
      return `- ${p.teks} [${nomor.join("][")}]`;
    })
    .join("\n");
  return { teks, daftarSumber };
}

function teksKonteksDeteksi(k?: Permintaan["konteks"]) {
  if (!k || k.kelas === null || k.kelas === undefined) return "Pengguna sedang tidak melihat hasil deteksi tertentu.";
  const kelas = ambilKelas(k.kelas);
  const bagian = [
    `Hasil deteksi yang sedang dilihat pengguna: ${kelas.nama} (${kelas.namaIlmiah}), komoditas ${kelas.komoditas}.`,
    k.lahan ? `Lokasi: ${k.lahan}${k.jam ? `, foto pukul ${k.jam}` : ""}.` : "",
    k.jumlah ? `Jumlah hama di foto: ${k.jumlah}.` : "",
    typeof k.keyakinan === "number" ? `Keyakinan sistem: ${Math.round(k.keyakinan * 100)} persen.` : "",
    k.cocok === "tidak" ? "Pengguna menyatakan hasil deteksi TIDAK cocok dengan yang dilihat di lahan." : "",
    k.cocok === "ya" ? "Pengguna sudah mencocokkan dan menyatakan ciri hama cocok." : "",
    k.cocok === "ragu" ? "Pengguna belum yakin apakah ciri hama cocok." : "",
  ];
  return bagian.filter(Boolean).join(" ");
}

async function panggilGemini(model: string, kunci: string, sistem: string, isi: { role: string; parts: { text: string }[] }[]) {
  const respon = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": kunci },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: sistem }] },
      contents: isi,
      generationConfig: { temperature: 0.3, maxOutputTokens: 800 },
    }),
  });
  if (!respon.ok) throw Object.assign(new Error(`Gemini ${respon.status}`), { status: respon.status, detail: await respon.text() });
  const data = await respon.json();
  const teks: string = (data?.candidates?.[0]?.content?.parts ?? []).map((p: { text?: string }) => p.text ?? "").join("").trim();
  if (!teks) throw new Error("Jawaban kosong");
  return teks;
}

export async function POST(req: Request) {
  let badan: Permintaan;
  try { badan = await req.json(); } catch { return NextResponse.json({ galat: "Format permintaan tidak dikenali." }, { status: 400 }); }
  const pertanyaan = (badan.pertanyaan ?? "").toString().trim().slice(0, 600);
  if (!pertanyaan) return NextResponse.json({ galat: "Pertanyaan masih kosong." }, { status: 400 });

  const kelasKonteks = typeof badan.konteks?.kelas === "number" ? badan.konteks.kelas : null;
  const potongan = cariKonteks(pertanyaan, kelasKonteks);
  const { teks: pustaka, daftarSumber } = susunPustaka(potongan);
  const kunci = process.env.GEMINI_API_KEY;
  const en = badan.bahasa === "en";

  // Tanpa kunci API: tetap berguna, tampilkan potongan pustaka yang paling relevan.
  if (!kunci) {
    const jawaban = potongan.length
      ? [en ? "The AI assistant is not enabled yet, so here is the most relevant information from the AgriPest-RAG library (in Indonesian):" : "Asisten AI belum diaktifkan, jadi berikut informasi paling relevan dari pustaka AgriPest-RAG:", ...potongan.slice(0, 4).map((p) => `- ${p.teks.replace(/^\[[^\]]+\]\s*/, "")}`)].join("\n")
      : en
        ? "The AI assistant is not enabled yet and the library has no information for this question. Please ask your local pest observer or agricultural extension officer."
        : "Asisten AI belum diaktifkan dan pustaka belum memuat informasi untuk pertanyaan ini. Silakan tanyakan ke petugas POPT atau penyuluh pertanian setempat.";
    return NextResponse.json({ jawaban, sumber: daftarSumber.slice(0, 6), mode: "pustaka" });
  }

  const bahasaJawab = en
    ? "\n\nBAHASA JAWABAN: Pengguna memilih bahasa Inggris. Tulis seluruh jawaban dalam bahasa Inggris yang sederhana (terjemahkan isi pustaka yang berbahasa Indonesia). Nama hama boleh disertai nama Indonesia dalam kurung."
    : "";
  const sistem = `${ATURAN}${bahasaJawab}\n\nKONTEKS LAYAR PENGGUNA:\n${teksKonteksDeteksi(badan.konteks)}\n\nPUSTAKA:\n${pustaka || "(tidak ada potongan pustaka yang relevan)"}\n\nDAFTAR RUJUKAN:\n${daftarSumber.map((s, i) => `[${i + 1}] ${s.judul}`).join("\n")}`;
  const riwayat = (badan.riwayat ?? []).slice(-6).map((p) => ({ role: p.peran === "asisten" ? "model" : "user", parts: [{ text: p.teks.slice(0, 1500) }] }));
  const isi = [...riwayat, { role: "user", parts: [{ text: pertanyaan }] }];

  try {
    const jawaban = await panggilGemini(MODEL, kunci, sistem, isi);
    return NextResponse.json({ jawaban, sumber: daftarSumber, mode: "ai" });
  } catch (e) {
    console.error("Gagal memanggil Gemini:", e);
    return NextResponse.json(
      { galat: en ? "The assistant cannot be reached right now. Try again shortly, or open the Pest library for the same information." : "Asisten sedang tidak bisa dihubungi. Coba lagi sebentar, atau buka Pustaka Hama untuk informasi yang sama." },
      { status: 502 }
    );
  }
}
