// src/utils/engagementCurve.js
// 7 time buckets: 12 PM → 12 AM (noon to midnight)
export const TIME_LABELS = [
  "12 PM", "2 PM", "4 PM", "6 PM", "8 PM", "10 PM", "12 AM"
];

// Evening-tilted curve that peaks around 6-8 PM, sums to 1.0
export const ENGAGEMENT_WEIGHTS = [
  0.08, 0.12, 0.18, 0.25, 0.20, 0.12, 0.05
];

// Guard against rounding drift; ensures ~1.0
const normalize = (arr) => {
  const s = arr.reduce((a, b) => a + b, 0) || 1;
  return arr.map(v => v / s);
};

/**
 * Build cumulative band data for Recharts.
 * @param {number} lowTotal  - ranges.likes.low from backend
 * @param {number} highTotal - ranges.likes.high from backend
 * @param {string[]} labels  - x-axis labels (length 7)
 * @returns {{t:string, low:number, high:number, delta:number}[]}
 */
export function buildLikesBandData(lowTotal, highTotal, labels = TIME_LABELS) {
  const w = normalize(ENGAGEMENT_WEIGHTS);

  let cumLow = 0;
  let cumHigh = 0;

  return w.map((weight, i) => {
    cumLow += lowTotal * weight;
    cumHigh += highTotal * weight;
    const low = Math.round(cumLow);
    const high = Math.round(cumHigh);
    return {
      t: labels[i],
      low,
      high,
      delta: Math.max(0, high - low) // used to shade band (stacked area)
    };
  });
}

/** 1.3K → "1.3K", 1_200_000 → "1.2M" */
export function abbr(n) {
  const v = Number(n || 0);
  if (v >= 1e6) return `${(v / 1e6).toFixed(v % 1e6 === 0 ? 0 : 1)}M`;
  if (v >= 1e3) return `${(v / 1e3).toFixed(v % 1e3 === 0 ? 0 : 1)}K`;
  return String(Math.round(v));
}