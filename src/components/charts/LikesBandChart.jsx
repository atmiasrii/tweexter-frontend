// src/components/charts/LikesBandChart.jsx
import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  Line
} from "recharts";
import { buildLikesBandData, abbr } from "../../utils/engagementCurve";

export default function LikesBandChart({ lowTotal = 0, highTotal = 0 }) {
  const data = useMemo(
    () => buildLikesBandData(lowTotal, highTotal),
    [lowTotal, highTotal]
  );

  // Calculate domain with headroom
  const maxValue = useMemo(() => {
    if (!data.length) return 100;
    const dataMax = Math.max(...data.map(d => d.low + d.delta));
    return Math.ceil(dataMax * 1.05);
  }, [data]);

  // Minimal tooltip with just Low/High (cumulative)
  const Tip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    const row = payload.reduce(
      (acc, p) => ({ ...acc, [p.dataKey]: p.value }),
      {}
    );
    return (
      <div
        style={{
          background: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
          borderRadius: 12,
          padding: "8px 12px",
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          color: "hsl(var(--card-foreground))",
          fontSize: "12px"
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: 4, color: "hsl(var(--muted-foreground))" }}>{label}</div>
        <div>Low: {abbr(row.low ?? 0)}</div>
        <div>High: {abbr((row.low ?? 0) + (row.delta ?? 0))}</div>
      </div>
    );
  };

  return (
    <div className="w-full h-full min-h-0">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart 
          data={data} 
          margin={{ top: 10, right: 60, left: 10, bottom: 20 }}
        >
          <defs>
            <pattern id="grid" patternUnits="userSpaceOnUse" width="1" height="1">
              <path d="M 1 0 L 0 0 0 1" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.3"/>
            </pattern>
          </defs>
          <XAxis 
            dataKey="t" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
            tickMargin={8}
          />
          <YAxis 
            orientation="right"
            tickFormatter={abbr} 
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
            tickMargin={8}
            width={50}
            domain={[0, maxValue]}
          />
          <Tooltip content={<Tip />} />

        {/* --- shaded band between low & high via stacked areas --- */}
        <Area
          type="monotone"
          dataKey="low"
          stackId="band"
          stroke="transparent"
          fill="transparent"
          isAnimationActive={false}
        />
        <Area
          type="monotone"
          dataKey="delta"       // fills from low up to high
          stackId="band"
          stroke="transparent"
          fill="hsl(var(--primary) / 0.18)"
          isAnimationActive={false}
        />

        {/* --- crisp edges: two lines --- */}
        <Line
          type="monotone"
          dataKey="low"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
        <Line
          type="monotone"
          dataKey={(d) => d.low + d.delta} // = high
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
    </div>
  );
}