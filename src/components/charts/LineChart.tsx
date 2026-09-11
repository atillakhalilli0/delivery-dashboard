"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

interface Point {
  label: string;
  value: number;
}

export default function LineChart({ data, unit = "min" }: { data: Point[]; unit?: string }) {
  const width = 560;
  const height = 200;
  const padding = 24;

  const { path, area, points, max, min } = useMemo(() => {
    const values = data.map((d) => d.value);
    const max = Math.max(...values) * 1.15;
    const min = Math.min(...values) * 0.85;
    const stepX = (width - padding * 2) / (data.length - 1);
    const points = data.map((d, i) => {
      const x = padding + i * stepX;
      const y = height - padding - ((d.value - min) / (max - min || 1)) * (height - padding * 2);
      return { x, y, ...d };
    });
    const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
    const area = `${path} L ${points[points.length - 1]?.x ?? 0} ${height - padding} L ${points[0]?.x ?? 0} ${height - padding} Z`;
    return { path, area, points, max, min };
  }, [data]);

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[420px]" style={{ height }}>
        <defs>
          <linearGradient id="lineFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2FB6A6" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#2FB6A6" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1={padding}
            x2={width - padding}
            y1={padding + f * (height - padding * 2)}
            y2={padding + f * (height - padding * 2)}
            stroke="var(--border)"
            strokeDasharray="3 4"
          />
        ))}
        <motion.path
          d={area}
          fill="url(#lineFade)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
        <motion.path
          d={path}
          fill="none"
          stroke="#2FB6A6"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        />
        {points.map((p, i) => (
          <motion.g key={p.label} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 + i * 0.07 }}>
            <circle cx={p.x} cy={p.y} r={4} fill="var(--surface)" stroke="#2FB6A6" strokeWidth={2} />
            <text x={p.x} y={height - 4} textAnchor="middle" className="fill-current text-[10px]" fill="var(--faint)">
              {p.label}
            </text>
          </motion.g>
        ))}
      </svg>
      <p className="mt-1 text-[11px] text-faint">
        Range {Math.round(min)}–{Math.round(max)} {unit}
      </p>
    </div>
  );
}
