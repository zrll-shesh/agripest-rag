import clsx, { type ClassValue } from "clsx";
export const cx = (...k: ClassValue[]) => clsx(k);
export const persen = (n: number) => `${Math.round(n * 100)}%`;
export const angkaId = (n: number, digit = 2) => n.toFixed(digit).replace(".", ",");

export type TingkatYakin = "yakin" | "cukup" | "kurang";
export function tingkatYakin(k: number): TingkatYakin {
  if (k >= 0.75) return "yakin";
  if (k >= 0.5) return "cukup";
  return "kurang";
}
export const LABEL_YAKIN: Record<TingkatYakin, string> = { yakin: "Yakin", cukup: "Cukup yakin", kurang: "Kurang yakin" };
