// src/lib/format.ts
export function formatCompact(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  try {
    // Use built-in compact notation for 1.2K, 1.2M, etc.
    // https://developer.mozilla.org/... Intl.NumberFormat (compact notation)
    return new Intl.NumberFormat(undefined, {
      notation: "compact",
      compactDisplay: "short",
      maximumFractionDigits: 1,
    }).format(n);
  } catch {
    // Very old browsers fallback
    const abs = Math.abs(n);
    if (abs >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    if (abs >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    return String(n);
  }
}