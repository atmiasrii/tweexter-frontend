// src/components/RangeStat.tsx
import React from "react";
import { formatCompact } from "@/lib/format";
import { MetricRange } from "@/types/prediction";

type Props = {
  label: "Likes" | "Retweets" | "Replies";
  range?: MetricRange; // may be undefined if backend didn't send it
};

export default function RangeStat({ label, range }: Props) {
  const hasRange = !!range && typeof range.low === "number" && typeof range.high === "number";
  const low = hasRange ? formatCompact(Math.max(0, Math.floor(range!.low))) : "—";
  const high = hasRange ? formatCompact(Math.max(0, Math.floor(range!.high))) : "—";

  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
        {hasRange ? `${low}–${high}` : "—"}
      </div>
    </div>
  );
}