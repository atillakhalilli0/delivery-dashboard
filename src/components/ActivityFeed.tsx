"use client";

import React from "react";
import { motion } from "framer-motion";
import { TbPackageImport, TbTruckDelivery, TbAlertTriangle, TbCircleCheck } from "react-icons/tb";
import { deliveries } from "@/lib/mockData";

const ICONS = {
  Delivered: { Icon: TbCircleCheck, color: "text-success" },
  Delayed: { Icon: TbAlertTriangle, color: "text-alert" },
  "In transit": { Icon: TbTruckDelivery, color: "text-signal" },
  Assigned: { Icon: TbPackageImport, color: "text-transit" },
} as const;

export default function ActivityFeed() {
  const items = deliveries
    .filter((d) => d.status in ICONS)
    .slice(0, 8)
    .map((d) => ({
      id: d.id,
      status: d.status as keyof typeof ICONS,
      text: `${d.id} — ${d.customer}`,
      time: d.createdAt,
    }));

  return (
    <div className="rounded-xl border border-border bg-surface p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-[15px] font-semibold">Live activity</h2>
        <span className="flex items-center gap-1.5 text-[11.5px] font-medium text-faint">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
          </span>
          Streaming
        </span>
      </div>
      <div className="divide-y divide-border">
        {items.map((item, i) => {
          const meta = ICONS[item.status];
          const Icon = meta.Icon;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.35 }}
              className="flex cursor-pointer items-center gap-3 py-2.5 transition-colors hover:bg-raised/60"
            >
              <Icon className={`shrink-0 text-[16px] ${meta.color}`} />
              <p className="min-w-0 flex-1 truncate text-[12.5px] text-ink">{item.text}</p>
              <span className="shrink-0 font-mono text-[11px] text-faint">{item.time}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
