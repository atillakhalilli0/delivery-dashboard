"use client";

import React from "react";
import { motion } from "framer-motion";
import type { DailyMetric } from "@/lib/types";

export default function BarChart({ data }: { data: DailyMetric[] }) {
  const max = Math.max(...data.map((d) => d.delivered)) * 1.15;
  const height = 200;

  return (
    <div className="w-full">
      <div className="flex items-end gap-3 sm:gap-5" style={{ height }}>
        {data.map((d, i) => {
          const deliveredH = (d.delivered / max) * height;
          const delayedH = (d.delayed / max) * height;
          return (
            <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
              <div className="relative flex w-full items-end justify-center gap-1" style={{ height }}>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: deliveredH }}
                  transition={{ duration: 0.7, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className="w-[40%] rounded-t-[5px] bg-signal/90"
                />
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: Math.max(delayedH, 3) }}
                  transition={{ duration: 0.7, delay: i * 0.06 + 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="w-[24%] rounded-t-[5px] bg-alert/70"
                />
              </div>
              <span className="text-[11px] font-medium text-faint">{d.day}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex items-center gap-4 text-[12px] text-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-signal/90" /> Delivered
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-alert/70" /> Delayed
        </span>
      </div>
    </div>
  );
}
