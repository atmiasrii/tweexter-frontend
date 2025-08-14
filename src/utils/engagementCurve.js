// src/utils/engagementCurve.js
// 12 time buckets: 12 AM → 10 PM (matches your UI ticks)
export const TIME_LABELS = [
  "12 AM","2 AM","4 AM","6 AM","8 AM","10 AM",
  "12 PM","2 PM","4 PM","6 PM","8 PM","10 PM"
];

// A reasonable, evening-tilted curve that sums to 1.0
export const ENGAGEMENT_WEIGHTS = [
  0.02, 0.02, 0.02, 0.03, 0.05, 0.08,
  0.10, 0.12, 0.15, 0.17, 0.12, 0.12
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
 * @param {string[]} labels  - x-axis labels (length 12)
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