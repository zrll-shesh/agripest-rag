import type { Config } from "tailwindcss";

// Palet "pos pantau": warna sawah, gabah, dan bata. Merah dan kuning hanya untuk status.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        tanah: "#F3F5EF",
        kertas: "#FFFFFF",
        tinta: "#17251D",
        lumpur: "#56635A",
        garis: "#DCE2D8",
        daun: { DEFAULT: "#2D6A47", tua: "#1F4D33", muda: "#E2ECE3" },
        gabah: { DEFAULT: "#B97C0C", muda: "#F6EBD2" },
        bata: { DEFAULT: "#A63A28", muda: "#F5E0DA" },
        air: { DEFAULT: "#2A6478", muda: "#DCEAEF" },
        malam: "#16302A",
        lahan: { padi: "#2D6A47", jagung: "#C7951C", bawang: "#8A3F6E" },
      },
      fontFamily: {
        judul: ["'Bricolage Grotesque Variable'", "system-ui", "sans-serif"],
        teks: ["'Plus Jakarta Sans Variable'", "system-ui", "sans-serif"],
      },
      borderRadius: { panel: "18px", kecil: "10px" },
      maxWidth: { halaman: "1240px" },
    },
  },
  plugins: [],
};
export default config;
