// src/lib/ranges.ts
export type Metric = "likes" | "retweets" | "replies";
type RangeTriple = { low: number; mid: number; high: number };

const TIER_RANGE_BANDS: Array<{ max?: number | null; band: number }> = [
  { max: 1000, band: 0.50 },
  { max: 5000, band: 0.35 },
  { max: 10000, band: 0.30 },
  { max: 50000, band: 0.25 },
  { max: 100000, band: 0.22 },
  { max: 300000, band: 0.20 },
  { max: 600000, band: 0.18 },
  { max: 1000000, band: 0.16 },
  { max: null, band: 0.15 } // >1M
];

const FLOORS = { likes: 8, retweets: 5, replies: 2 };
const RETWEET_BAND_SCALE = 0.70;
const REPLY_BAND_SCALE   = 0.50;

function bandForFollowers(followers: number): number {
  const f = Math.max(1, Math.floor(followers || 1));
  for (const row of TIER_RANGE_BANDS) {
    if (row.max == null || f <= row.max) return row.band;
  }
  return 0.20;
}
function metricBand(baseBand: number, metric: Metric): number {
  if (metric === "retweets") return baseBand * RETWEET_BAND_SCALE;
  if (metric === "replies")  return baseBand * REPLY_BAND_SCALE;
  return baseBand;
}
function clampInt(n: number) {
  return Math.max(0, Math.round(Number.isFinite(n) ? n : 0));
}

export function computeFallbackRange(
  mid: number,
  followers: number,
  metric: Metric
): RangeTriple {
  const base = bandForFollowers(followers);
  const rel  = metricBand(base, metric);
  const floor = FLOORS[metric];
  const safeMid = clampInt(mid);
  const delta = Math.max(Math.round(Math.abs(safeMid) * rel), floor);
  const low  = clampInt(safeMid - delta);
  const high = clampInt(safeMid + delta);
  return { low, mid: safeMid, high };
}

/**
 * Ensure resp.ranges.{likes,retweets,replies} exist and are not collapsed.
 * - If missing or low=mid=high → fill using computeFallbackRange(mid, followers, metric)
 * - Always return non-negative integers.
 */
export function normalizeRanges(resp: any, followers: number) {
  const out = { ...resp, ranges: resp?.ranges ? { ...resp.ranges } : {} };

  (["likes","retweets","replies"] as Metric[]).forEach((m) => {
    const mid = clampInt(out[m] ?? out?.ranges?.[m]?.mid ?? 0);
    const r = out.ranges[m] || {};
    const hasAll = ["low","mid","high"].every((k) => r[k] != null);
    const collapsed = hasAll && (clampInt(r.low) === clampInt(r.mid)) && (clampInt(r.mid) === clampInt(r.high));

    if (!hasAll || collapsed) {
      out.ranges[m] = computeFallbackRange(mid, followers, m);
    } else {
      out.ranges[m] = {
        low:  clampInt(r.low),
        mid:  clampInt(r.mid),
        high: clampInt(r.high),
      };
    }
  });

  return out;
}