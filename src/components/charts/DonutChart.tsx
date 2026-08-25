"use client";

import React from "react";
import { motion } from "framer-motion";

interface Segment {
  label: string;
  value: number;
  color: string;
}

export default function DonutChart({ segments }: { segments: Segment[] }) {
  const total = segments.reduce((a, s) => a + s.value, 0);
  const size = 168;
  const stroke = 20;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulative = 0;

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-8">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--border)" strokeWidth={stroke} />
          {segments.map((s, i) => {
            const fraction = s.value / total;
            const dash = fraction * circumference;
            const offset = circumference - (cumulative / total) * circumference;
            cumulative += s.value;
            return (
              <motion.circle
                key={s.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={s.color}
                strokeWidth={stroke}
                strokeLinecap="butt"
                strokeDasharray={`${dash} ${circumference - dash}`}
                initial={{ strokeDashoffset: circumference, opacity: 0 }}
                animate={{ strokeDashoffset: offset, opacity: 1 }}
                transition={{ duration: 0.9, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-2xl font-semibold tracking-tight">{total}</span>
          <span className="text-[10.5px] text-faint">total</span>
        </div>
      </div>
      <div className="grid w-full grid-cols-2 gap-x-4 gap-y-2.5 sm:w-auto">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 shrink-0 rounded-[3px]" style={{ background: s.color }} />
            <span className="text-[12.5px] text-muted">{s.label}</span>
            <span className="ml-auto tabular text-[12.5px] font-semibold text-ink">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
